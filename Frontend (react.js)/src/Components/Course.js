/* eslint-disable no-sequences */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import CompanyHeader from "./CompanyHeader";
import { UserContext } from "./UserContext";
import LoaderOverlay from "./Loader"; // Import the loader component
import "./Assets/Profile.css";
import "./Assets/Alert.css";

function Course() {
  const { userDetails } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("display"); // State for active tab
  const [formData, setFormData] = useState({ coursename: "" });
  const [courseData, setCourseData] = useState([]); // Store courses
  const [editingCourse, setEditingCourse] = useState(null); // Store course being edited
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

  // Fetch courses
  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://localhost:44350/api/Class/GetClass", {
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
      setError(err.message);
      console.error("Error fetching courses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle input change for adding/editing a course
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === "add") {
      setFormData({ ...formData, [name]: value });
    } else if (activeTab === "edit" && editingCourse) {
      setEditingCourse({ ...editingCourse, [name]: value });
    }
  };

  // Handle course submission (Add)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:44350/api/Class/ClassCreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          COMP_ID: profileUserData.compID,
          IS_ACTIVE: 1,
          CLASS_NAME: formData.coursename,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add course.");
      }

      showMessage("Course added successfully!");
      fetchCourses(); // Refresh courses
      setFormData({ coursename: "" }); // Reset form
      setActiveTab("display"); // Switch to display tab
    } catch (err) {
      console.error("Error adding course:", err);
      showMessage(err.message, 7000);
    }
  };

  // Handle course update (Edit)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:44350/api/Class/UpdateClass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          COMP_ID: editingCourse.COMP_ID,
          CLASS_ID: editingCourse.CLASS_ID,
          IS_ACTIVE: 1,
          CLASS_NAME: editingCourse.CLASS_NAME,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update course.");
      }

      showMessage("Course updated successfully!");
      fetchCourses(); // Refresh courses
      setEditingCourse(null); // Reset editing state
      setActiveTab("display"); // Switch to display tab
    } catch (err) {
      console.error("Error updating course:", err);
      showMessage(err.message, 7000);
    }
  };

  return (
    <div>
      <Sidebar />
      <CompanyHeader />

      <div className="profile-content">
        {/* Alert message */}
        {message && <div className="alert show">{message}</div>}

        <div className="profile-databox">
          {/* Tabs */}
          <div className="tabs">
            <button
              className={activeTab === "display" ? "active-tab" : ""}
              onClick={() => setActiveTab("display")}
            >
              Display Courses
            </button>
            <button
              className={activeTab === "add" ? "active-tab" : ""}
              onClick={() => setActiveTab("add")}
            >
              Add Course
            </button>
            <button
              className={activeTab === "edit" ? "active-tab" : ""}
              disabled={!editingCourse}
              onClick={() => setActiveTab("edit")}
            >
              Edit Course
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "display" && (
            <div>
              <h3>Existing Courses</h3>
              {isLoading ? (
                <LoaderOverlay />
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : courseData.length === 0 ? (
                <p>No courses available.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Course Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseData.map((course, index) => (
                      <tr key={course.CLASS_ID}>
                        <td>{index + 1}</td>
                        <td>{course.CLASS_NAME}</td>
                        <td>
                          <button
                            onClick={() => (setEditingCourse(course), setActiveTab("edit"))}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "add" && (
            <div>
              <h3>Add New Course</h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="coursename">Course Name</label>
                  <input
                    type="text"
                    name="coursename"
                    id="coursename"
                    value={formData.coursename}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button style={{ marginTop: "20px" }} type="submit">
                  Submit
                </button>
              </form>
            </div>
          )}

          {activeTab === "edit" && editingCourse && (
            <div>
              <h3>Edit Course</h3>
              <form onSubmit={handleUpdate}>
                <div>
                  <label htmlFor="coursename">Course Name</label>
                  <input
                    type="text"
                    name="CLASS_NAME"
                    id="coursename"
                    value={editingCourse.CLASS_NAME}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button style={{ marginTop: "20px" }} type="submit">
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Course;
