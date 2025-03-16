/* eslint-disable no-sequences */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import CompanyHeader from "./CompanyHeader";
import { UserContext } from "./UserContext";
import "./Assets/Profile.css";
import "./Assets/Alert.css";

function Subjects() {
  const { userDetails } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("display");
  const [formData, setFormData] = useState({ subjectName: "" });
  const [subjectData, setSubjectData] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const profileUserData = {
    compID: userDetails?.compID || 0,
  };

  const showMessage = (msg, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, duration);
  };

  const fetchSubjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://localhost:44350/api/Subject/GetSubjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Company_ID: profileUserData.compID,
          SUBJECT_ID: 0,
          IsActive: 1,
          SUBJECT_NAME: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching subjects: ${response.statusText}`);
      }

      const data = await response.json();
      setSubjectData(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching subjects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === "add") {
      setFormData({ ...formData, [name]: value });
    } else if (activeTab === "edit" && editingSubject) {
      setEditingSubject({ ...editingSubject, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:44350/api/Subject/SubjectCreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Company_ID: profileUserData.compID,
          IsActive: 1,
          SUBJECT_NAME: formData.subjectName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add subject.");
      }

      showMessage("Subject added successfully!");
      fetchSubjects();
      setFormData({ subjectName: "" });
      setActiveTab("display");
    } catch (err) {
      console.error("Error adding subject:", err);
      showMessage(err.message, 5000);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:44350/api/Subject/UpdateSubjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Company_ID: editingSubject.Company_ID,
          Subject_ID: editingSubject.Subject_ID,
          IsActive: 1,
          Subject_Name: editingSubject.Subject_Name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update subject.");
      }

      showMessage("Subject updated successfully!");
      fetchSubjects();
      setEditingSubject(null);
      setActiveTab("display");
    } catch (err) {
      console.error("Error updating subject:", err);
      showMessage(err.message, 5000);
    }
  };

  return (
    <div>
      <Sidebar />
      <CompanyHeader />

      <div className="profile-content">
        {message && <div className="alert show">{message}</div>}

        <div className="profile-databox">
          <div className="tabs">
            <button
              className={activeTab === "display" ? "active-tab" : ""}
              onClick={() => setActiveTab("display")}
            >
              Display Subjects
            </button>
            <button
              className={activeTab === "add" ? "active-tab" : ""}
              onClick={() => setActiveTab("add")}
            >
              Add Subject
            </button>
            <button
              className={activeTab === "edit" ? "active-tab" : ""}
              disabled={!editingSubject}
              onClick={() => setActiveTab("edit")}
            >
              Edit Subject
            </button>
          </div>

          {activeTab === "display" && (
            <div>
              <h3>Existing Subjects</h3>
              {isLoading ? (
                <p>Loading subjects...</p>
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : subjectData.length === 0 ? (
                <p>No subjects available.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Subject Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectData.map((subject, index) => (
                     <tr key={subject.SUBJECT_ID || `subject-${index}`}>
                        <td>{index + 1}</td>
                        <td>{subject.Subject_Name}</td>
                        <td>
                          <button onClick={() => (setEditingSubject(subject), setActiveTab("edit"))}>
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
              <h3>Add New Subject</h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="subjectName">Subject Name</label>
                  <input
                    type="text"
                    name="subjectName"
                    id="subjectName"
                    value={formData.subjectName}
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

          {activeTab === "edit" && editingSubject && (
            <div>
              <h3>Edit Subject</h3>
              <form onSubmit={handleUpdate}>
                <div>
                  <label htmlFor="subjectName">Subject Name</label>
                  <input
                    type="text"
                    name="Subject_Name"
                    id="subjectName"
                    value={editingSubject.Subject_Name}
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

export default Subjects;
