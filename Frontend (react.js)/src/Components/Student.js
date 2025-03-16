import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import CompanyHeader from "./CompanyHeader";
import { UserContext } from "./UserContext";
import LoaderOverlay from "./Loader"; // Import the loader component
import "./Assets/Profile.css";
import "./Assets/Alert.css";

function Student() {
  const { userDetails } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("display"); // State for active tab
  const [formData, setFormData] = useState({
    studentid: "",
    rollno: "",
    studentfirstname: "",
    lastname: "",
    gender: "",
    fathername: "",
    mobileno: "",
    dob: "",
    address: "",
    locationID: "",
    adharno: "",
    classID: "",
  });
  const [studentData, setStudentData] = useState([]); // Store students
  const [courseData, setCourseData] = useState([]); // Store courses
  const [locationData, setLocationData] = useState([]); // Store Locations
  const [editingStudent, setEditingStudent] = useState(null); // Store student being edited
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [message, setMessage] = useState(null); // Message state

  const profileUserData = {
    compID: userDetails?.compID || 0,
  };

  // Helper function to show a message with auto-hide
  const showMessage = (msg, duration = 7000) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, duration);
  };

  // Fetch students
  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://localhost:7057/api/AdmitStudent/GetAdmitStudent", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Error fetching students: ${response.statusText}`);
      }

      const data = await response.json();
      setStudentData(data || []);

      console.log(data); // Log the fetched data directly
    } catch (err) {
      setError(err.message || "An error occurred while fetching students.");
      console.error("Error fetching students:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch courses
  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://localhost:7057/api/Class/GetClass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          COMP_ID: profileUserData.compID,
          CLASS_ID: 0,
          IS_ACTIVE: 1,
          CLASS_NAME: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching courses: ${response.statusText}`);
      }

      const data = await response.json();
      setCourseData(data || []);
    } catch (err) {
      setError(err.message || "An error occurred while fetching courses.");
      console.error("Error fetching courses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  //Fetch Locations
  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://localhost:7057/api/Location/GetLocations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Company_ID: profileUserData.compID,
          Location_ID: 0,
          IsActive: 1,
          Location_NAME: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching locations: ${response.statusText}`);
      }

      const data = await response.json();
      setLocationData(data || []);
    } catch (err) {
      setError(err.message || "An error occurred while fetching locations.");
      console.error("Error fetching locations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
     fetchLocations();
   }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Student submission (Add)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("https://localhost:7057/api/AdmitStudent/CreateAdmitStudent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          COMP_ID: profileUserData.compID,
          ADMIT_STDID: 0,
          STATUS: "1",
          STUDENT_NAME: formData.studentfirstname,
          STUDENT_LASTNAME: formData.lastname,
          FATHER_NAME: formData.fathername,
          CLASS_ID: formData.classID,
          PHONE_NO: formData.mobileno,
          DOB: formData.dob,
          ROLL_NO: formData.rollno,
          STD_ID: formData.studentid,
          AADAR_NO: formData.adharno,
          GENDER: formData.gender,
          LocationID: formData.locationID,
          ADDRESS: formData.address,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add Student.");
      }

      const newStudent = await response.json();
      setStudentData([...studentData, newStudent]); // Add new student to state
      showMessage("Student added successfully!");

      setFormData({
        studentid: "",
        rollno: "",
        studentfirstname: "",
        lastname: "",
        gender: "",
        fathername: "",
        mobileno: "",
        dob: "",
        address: "",
        locationID: "",
        adharno: "",
        classID: "",
      });
      setActiveTab("display");
    } catch (err) {
      console.error("Error adding student:", err);
      showMessage(err.message, 7000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Sidebar />
      <CompanyHeader />

      <div className="profile-content">
        {/* Alert message */}
        {message && <div className="alert show">{message}</div>}

        <div className="profile-studentdatabox">
          {/* Tabs */}
          <div className="tabs">
            <button
              className={activeTab === "display" ? "active-tab" : ""}
              onClick={() => setActiveTab("display")}
            >
              Display Students
            </button>
            <button
              className={activeTab === "add" ? "active-tab" : ""}
              onClick={() => setActiveTab("add")}
            >
              Add student
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "display" && (
            <div>
              <h3>Existing Students</h3>
              {isLoading ? (
                <LoaderOverlay />
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : studentData.length === 0 ? (
                <p>No students available.</p>
              ) : (
                <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student ID</th>
                    <th>Roll No</th> 
                    <th>First Name</th>
                    <th>Last Name</th>
                     <th>Gender</th>
                    <th>Father Name</th>
                    <th>Mobile No</th>
                    <th>DOB</th>
                    <th>Address</th>
                    <th>Location</th>
                    <th>Aadhar No</th>
                    <th>Class</th> 
                  </tr>
                </thead>
                <tbody>
                  {studentData.map((student, index) => (
                    <tr key={student.STUDENT_NAME}>
                      <td>{index + 1}</td>
                      <td>{student.STD_ID}</td>
                      <td>{student.ROLL_NO}</td> 
                      <td>{student.STUDENT_NAME}</td>
                      <td>{student.STUDENT_LASTNAME}</td>
                      <td>{student.GENDER}</td>
                      <td>{student.FATHER_NAME}</td>
                      <td>{student.PHONE_NO}</td>
                      <td>{student.DOB}</td>
                      <td>{student.ADDRESS}</td>
                      <td>{student.Location_Name}</td>
                      <td>{student.AADAR_NO}</td> 
                      <td>{student.CLASS_NAME}</td> 
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          )}

          {activeTab === "add" && (
            <div>
              <h3>Add student Form</h3>
              <form onSubmit={handleSubmit}>
                <table className="tableStudent">
                  <tr>
                    <td>
                      <label htmlFor="studentid">Student ID</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="studentid"
                        id="studentid"
                        value={formData.studentid}
                        onChange={handleChange}
                        required
                      />
                    </td>
                    <td>
                      <label htmlFor="rollno">Roll No</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="rollno"
                        id="rollno"
                        value={formData.rollno}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <label htmlFor="classID">Select Class</label>
                    </td>
                    <td>
                      <select
                        id="classID"
                        name="classID"
                        value={formData.classID || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          Select a class
                        </option>
                        {courseData.map((course) => (
                          <option key={course.CLASS_ID} value={course.CLASS_ID}>
                            {course.CLASS_NAME}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <label htmlFor="studentfirstname">First Name</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="studentfirstname"
                        id="studentfirstname"
                        value={formData.studentfirstname}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <label htmlFor="lastname">Last Name</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <label htmlFor="gender">Gender</label>
                    </td>
                    <td>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Select Gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <label htmlFor="fathername">Father Name</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="fathername"
                        id="fathername"
                        value={formData.fathername}
                        onChange={handleChange}
                        required
                      />
                    </td>
                    <td>
                      <label htmlFor="mobileno">Mobile No</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="mobileno"
                        id="mobileno"
                        value={formData.mobileno}
                        onChange={handleChange}
                        required
                      />
                    </td>
                    <td>
                      <label htmlFor="dob">DOB</label>
                    </td>
                    <td>
                      <input
                        type="date"
                        name="dob"
                        id="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <label htmlFor="address">Address</label>
                    </td>
                    <td>
                      <textarea
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </td>
                    <td>
                      <label htmlFor="locationID">Location</label>
                    </td>
                    <td>
                      <select
                        id="locationID"
                        name="locationID"
                        value={formData.locationID || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          Select Location
                        </option>
                        {locationData.map((location) => (
                          <option key={location.Location_ID} value={location.Location_ID}>
                            {location.Location_Name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <label htmlFor="adharno">Aadhar No</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="adharno"
                        id="adharno"
                        value={formData.adharno}
                        onChange={handleChange}
                        required
                      />
                    </td>
                  </tr>
                </table>
                <button style={{ marginTop: "20px" }} type="submit">
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Student;

