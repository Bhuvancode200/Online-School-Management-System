/* eslint-disable no-empty-pattern */
import React, { useContext, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { UserContext } from "./UserContext"; 
import CompanyHeader from './CompanyHeader';
import "./Assets/Profile.css";

function Coursecopy() {
  const { userDetails } = useContext(UserContext);
  const [] = useState(false);


  const [editingCourse, setEditingCourse] = useState(null); // Course being edited

// Start editing a course
const startEditing = (course) => {
  setEditingCourse(course);
};


 // Handle updating the course
 const handleUpdate = async (e) => {
  e.preventDefault();

  const postData = {
    COMP_ID: editingCourse.COMP_ID,
    CLASS_ID: editingCourse.CLASS_ID, // Use the correct CLASS_ID from the course
    IS_ACTIVE: 1,
    CLASS_NAME: editingCourse.CLASS_NAME,
  };

  try {
    const response = await fetch("https://localhost:44350/api/Class/UpdateClass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error(`Error updating course, status: ${response.status}`);
    }

    alert("Course updated successfully!");
/*     setCourseData((prev) =>
      prev.map((course) =>
        course.CLASS_ID === editingCourse.CLASS_ID
          ? { ...course, CLASS_NAME: editingCourse.CLASS_NAME }
          : course
      )
    ); */
    setEditingCourse(null);
  } catch (error) {
    console.error("Error:", error.message);
    alert("Error during class update. Please try again.");
  }
};

// Cancel editing
const cancelEditing = () => {
  setEditingCourse(null);
};


  const [ProfileuserData] = useState({
    companyName: userDetails?.companyName || '',
    Email: userDetails?.Email || '',
    compID: userDetails?.compID || '',
    status: userDetails?.status || '',
    mobno: userDetails?.mobno || '',
    Address: '',
  });

  const [courseData, setCourseData] = useState([]); // To store course data from API

  const [formData, setFormData] = useState({
    coursename: '',
    coursecode: ''
  });

  useEffect(() => {
    if (ProfileuserData.compID) {
      const GetClassData = {
        COMP_ID: ProfileuserData.compID,
        CLASS_ID: 0,
        IS_ACTIVE: 1,
        CLASS_NAME: '',
      };
  
      fetch("https://localhost:44350/api/Class/GetClass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(GetClassData),
      })
      .then((response) => {
        // Check if response status is OK
        if (!response.ok) {
          throw new Error('Failed to fetch class data, server returned an error: ' + response.status);
        }
  
        // Log the response for debugging
        console.log('Response Status:', response.status);
        console.log('Response Headers:', response.headers);
  
        // Check if the response body is empty
        if (response.status === 204) {
          console.log('No content returned from the server');
          return [];  // Return empty array if no content
        }
  
        // Read the response body as text first
        return response.text().then((text) => {
          if (!text) {
            throw new Error('Received empty response body');
          }
  
          // Try parsing the text as JSON
          try {
            return JSON.parse(text);
          } catch (error) {
            throw new Error('Failed to parse JSON: ' + error.message);
          }
        });
      })
      .then((data) => {
        if (data) {
          setCourseData(data);  // Update course data state
          console.log("Course data:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching class data:", error.message);
        alert("An error occurred while fetching the class data.");
      });
    }
  }, [ProfileuserData.compID]);

  




  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      COMP_ID: ProfileuserData.compID,
      CLASS_ID: 0,
      IS_ACTIVE: 1,
      CLASS_NAME: formData.coursename,
    };

    try {
      const response = await fetch("https://localhost:44350/api/Class/ClassCreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.text();
      console.log("Success:", data);
      alert("Course created successfully!");
      setFormData({ coursename: '', coursecode: '' }); // Clear form after submission
    } catch (error) {
      console.error("Error:", error);
      alert("Error during class creation. Please try again.");
    }
  };

  return (
    <div>
      <Sidebar />
      <CompanyHeader />

      <div className="profile-content">
        <h3>Course</h3>
        <div className="profile-details">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="coursename">Course Name</label>
              <input
                type="text"
                name="coursename"
                id="coursename"
                value={formData.coursename}
                onChange={handleChange}
                placeholder="Enter course name"
                required
              />
            </div>

            {/* Uncomment if you want to include course code */}
            {/* <div>
              <label htmlFor="coursecode">Course Code</label>
              <input
                type="text"
                name="coursecode"
                id="coursecode"
                value={formData.coursecode}
                onChange={handleChange}
                placeholder="Enter course code"
                required
              />
            </div> */}

            <button style={{ marginTop: '20px' }} type="submit">Submit</button>
          </form>
        </div>

    {/* Editing an existing course */}
    {editingCourse && (
          <div className="edit-course-section">
            <h4>Edit Course</h4>
            <form onSubmit={handleUpdate}>
              <div style={{ marginTop: '20px' }}>
                <label htmlFor="edit-coursename">Course Name</label>
                <input
                  type="text"
                  id="edit-coursename"
                  value={editingCourse.CLASS_NAME}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      CLASS_NAME: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <button style={{ marginTop: '20px' }}type="submit">Save</button>
              <button style={{ marginTop: '20px' }} type="button" onClick={cancelEditing}>
                Cancel
              </button>
            </form>
          </div>
        )}



        {/* Optionally, display course data */}
        <div>
          <h4>Existing Courses</h4>
       

<table style={{ marginTop: '40px' }}>

     <thead>
<tr>

  <th>
     #
  </th>

  <th>
  Course Name
  </th>

    <th>
    Actions

    </th>

</tr>

    </thead>

<tbody>
            {courseData.map((course, index) => (
             // <li key={index}>{course.CLASS_NAME}</li>

                <tr>

                  <td>
                  {index+1}
                  </td>

                  <td>
                  {course.CLASS_NAME}
                    </td>
                
                    <td>
                    <button onClick={() => startEditing(course)}>Edit</button>
                    </td>
                </tr>
            ))}

</tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default Coursecopy;
