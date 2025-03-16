import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import CompanyHeader from "./CompanyHeader";
import { UserContext } from "./UserContext";
import "./Assets/Profile.css";
import "./Assets/Alert.css";

function Department() {
  const {userDetails } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("display");
  const [formData, setFormData] = useState({ departmentName: "" });
  const [departmentData, setDepartmentData] = useState([]);
  const [editingDepartment, setEditingDepartment] = useState(null);
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

  const fetchDepartments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://localhost:44350/api/Department/GetDepartments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          compID: profileUserData.compID,
          Department_ID: 0,
          IsActive: 1,
          Department_Name: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching departments: ${response.statusText}`);
      }

      const data = await response.json();
      setDepartmentData(data || []);
    } catch (err) {
      setError(err.message || "An error occurred while fetching departments.");
      console.error("Error fetching departments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === "add") {
      setFormData({ ...formData, [name]: value });
    } else if (activeTab === "edit" && editingDepartment) {
      setEditingDepartment({ ...editingDepartment, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.departmentName.trim()) {
      showMessage("Department name cannot be empty.", 5000);
      return;
    }

    
    try {
      const response = await fetch("https://localhost:44350/api/Department/CreateDepartment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          compID: profileUserData.compID,
          IsActive: 1,
          Department_Name: formData.departmentName,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add department.");
      }
      showMessage("Department added successfully!");
      fetchDepartments();
      setFormData({ departmentName: "" });
      setActiveTab("display");
    } catch (err) {
      console.error("Error adding department:", err);
      showMessage(err.message || "An error occurred while adding department.", 5000);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingDepartment?.Department_Name.trim()) {
      showMessage("Department name cannot be empty.", 5000);
      return;
    }

    try {
      const response = await fetch("https://localhost:44350/api/Department/UpdateDepartment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          compID: editingDepartment.compID,
          Department_ID: editingDepartment.Department_ID,
          IsActive: 1,
          Department_Name: editingDepartment.Department_Name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update department.");
      }

      showMessage("Department updated successfully!");
      fetchDepartments();
      setEditingDepartment(null);
      setActiveTab("display");
    } catch (err) {
      console.error("Error updating department:", err);
      showMessage(err.message || "An error occurred while updating department.", 5000);
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
              Display Departments
            </button>
            <button
              className={activeTab === "add" ? "active-tab" : ""}
              onClick={() => setActiveTab("add")}
            >
              Add Department
            </button>
            <button
              className={activeTab === "edit" ? "active-tab" : ""}
              disabled={!editingDepartment}
              onClick={() => setActiveTab("edit")}
            >
              Edit Department
            </button>
          </div>

          {activeTab === "display" && (
            <div>
              <h3>Existing Departments</h3>
              {isLoading ? (
                <p>Loading Departments...</p>
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : departmentData.length === 0 ? (
                <p>No departments available.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Department Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentData.map((department, index) => (
                      <tr key={department.Department_ID || `department-${index}`}>
                        <td>{index + 1}</td>
                        <td>{department.Department_Name}</td>
                        <td>
                          <button onClick={() => (setEditingDepartment(department), setActiveTab("edit"))}>
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
              <h3>Add New Department</h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="departmentName">Department Name</label>
                  <input
                    type="text"
                    name="departmentName"
                    id="departmentName"
                    value={formData.departmentName}
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
          {activeTab === "edit" && editingDepartment && (
            <div>
              <h3>Edit Department</h3>
              <form onSubmit={handleUpdate}>
                <div>
                  <label htmlFor="departmentName">Department Name</label>
                  <input
                    type="text"
                    name="Department_Name"
                    id="departmentName"
                    value={editingDepartment.Department_Name}
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
export default Department;
