import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import CompanyHeader from "./CompanyHeader";
import { UserContext } from "./UserContext";
import "./Assets/Profile.css";
import "./Assets/Alert.css";

function ClassSubjectMapping() {
  const { userDetails } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("display");
  const [formData, setFormData] = useState({ classId: "", subjectId: "" });
  const [classData, setClassData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [mappingData, setMappingData] = useState([]);
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

  // Fetch classes and subjects
  const fetchClassesAndSubjects = async () => {
    setIsLoading(true);
    try {
      const [classesResponse, subjectsResponse] = await Promise.all([
        fetch("https://localhost:44350/api/Class/GetClass", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            COMP_ID: profileUserData.compID,
            CLASS_ID: 0,
            IS_ACTIVE: 1,
            CLASS_NAME: "",
          }),
        }),
        fetch("https://localhost:44350/api/Subject/GetSubjects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Company_ID: profileUserData.compID,
            SUBJECT_ID: 0,
            IsActive: 1,
            SUBJECT_NAME: "",
          }),
        }),
      ]);

      const [classesData, subjectsData] = await Promise.all([
        classesResponse.json(),
        subjectsResponse.json(),
      ]);

      setClassData(classesData || []);
      setSubjectData(subjectsData || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClassesAndSubjects();
    fetchMappings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchMappings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://localhost:44350/api/ClassSubjects/GetClassSubjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classID: formData.classId || null,
          compID: profileUserData.compID,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching mappings: ${response.statusText}`);
      }
  
      const data = await response.json();
      setMappingData(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching mappings:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:44350/api/Mapping/CreateMapping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          COMP_ID: profileUserData.compID,
          CLASS_ID: formData.classId,
          SUBJECT_ID: formData.subjectId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to map class and subject.");
      }

      showMessage("Mapping added successfully!");
      fetchMappings(); // Refresh mappings
      setFormData({ classId: "", subjectId: "" });
    } catch (err) {
      console.error("Error adding mapping:", err);
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
              Display Mappings
            </button>
            <button
              className={activeTab === "add" ? "active-tab" : ""}
              onClick={() => setActiveTab("add")}
            >
              Add Mapping
            </button>
          </div>

          {activeTab === "display" && (
            <div>
              <h3>Existing Class-Subject Mappings</h3>
              {isLoading ? (
                <p>Loading mappings...</p>
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : mappingData.length === 0 ? (
                <p>No mappings available.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Class Name</th>
                      <th>Subject Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mappingData.map((mapping, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{mapping.CLASS_NAME}</td>
                        <td>{mapping.SUBJECT_NAME}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "add" && (
            <div>
              <h3>Add New Class-Subject Mapping</h3>
              <form onSubmit={handleSubmit}>
                {/* Class Dropdown */}
                <div>
                  <label htmlFor="classDropdown">Select Class</label>
                  <select
                    id="classDropdown"
                    name="classId"
                    value={formData.classId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select a Class --</option>
                    {classData.map((classItem) => (
                      <option key={classItem.CLASS_ID} value={classItem.CLASS_ID}>
                        {classItem.CLASS_NAME}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subjects Table with Checkboxes */}
                <div>
                  <h4>Select Subjects</h4>
                  {subjectData.length === 0 ? (
                    <p>No subjects available.</p>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Subject Name</th>
                          <th>Select</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjectData.map((subject, index) => (
                          <tr key={subject.SUBJECT_ID}>
                            <td>{index + 1}</td>
                            <td>{subject.Subject_Name}</td>
                            <td>
                              <input
                                type="checkbox"
                                name="subjectId"
                                value={subject.SUBJECT_ID}
                                onChange={(e) => {
                                  const selectedId = e.target.value;
                                  setFormData((prevData) => {
                                    const updatedSubjectIds = prevData.subjectId
                                      ? prevData.subjectId.split(",")
                                      : [];
                                    if (e.target.checked) {
                                      updatedSubjectIds.push(selectedId);
                                    } else {
                                      const idx = updatedSubjectIds.indexOf(selectedId);
                                      if (idx > -1) updatedSubjectIds.splice(idx, 1);
                                    }
                                    return {
                                      ...prevData,
                                      subjectId: updatedSubjectIds.join(","),
                                    };
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

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

export default ClassSubjectMapping;
