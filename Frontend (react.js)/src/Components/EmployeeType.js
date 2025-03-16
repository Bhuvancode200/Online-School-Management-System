import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import CompanyHeader from "./CompanyHeader";
import { UserContext } from "./UserContext";
import "./Assets/Profile.css";
import "./Assets/Alert.css";

function EmployeeType() {
  const { userDetails } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("display");
  const [formData, setFormData] = useState({ employeeTypeName: "" });
  const [employeeTypeData, setEmployeeTypeData] = useState([]);
  const [editingEmployeeType, setEditingEmployeeType] = useState(null);
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

  const fetchEmployeeTypes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://localhost:44350/api/EmployeeType/GetEmployeeTypes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Comp_ID: profileUserData.compID,
          EmployeeType_ID: 0,
          IsActive: 1,
          EmployeeType_Name: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching employee types: ${response.statusText}`);
      }

      const data = await response.json();
      setEmployeeTypeData(data || []);
    } catch (err) {
      setError(err.message || "An error occurred while fetching employee types.");
      console.error("Error fetching employee types:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === "add") {
      setFormData({ ...formData, [name]: value });
    } else if (activeTab === "edit" && editingEmployeeType) {
      setEditingEmployeeType({ ...editingEmployeeType, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeTypeName.trim()) {
      showMessage("Employee type name cannot be empty.", 5000);
      return;
    }

    try {
      const response = await fetch("https://localhost:44350/api/EmployeeType/CreateEmployeeType", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Comp_ID: profileUserData.compID,
          IsActive: 1,
          EmployeeType_Name: formData.employeeTypeName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add employee type.");
      }

      showMessage("Employee type added successfully!");
      fetchEmployeeTypes();
      setFormData({ employeeTypeName: "" });
      setActiveTab("display");
    } catch (err) {
      console.error("Error adding employee type:", err);
      showMessage(err.message || "An error occurred while adding employee type.", 5000);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingEmployeeType?.EmployeeType_Name.trim()) {
      showMessage("Employee type name cannot be empty.", 5000);
      return;
    }

    try {
      const response = await fetch("https://localhost:44350/api/EmployeeType/UpdateEmployeeType", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Comp_ID: editingEmployeeType.CompID,
          EmployeeType_ID: editingEmployeeType.EmployeeType_ID,
          IsActive: 1,
          EmployeeType_Name: editingEmployeeType.EmployeeType_Name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update employee type.");
      }

      showMessage("Employee type updated successfully!");
      fetchEmployeeTypes();
      setEditingEmployeeType(null);
      setActiveTab("display");
    } catch (err) {
      console.error("Error updating employee type:", err);
    
      showMessage(err.message || "An error occurred while updating employee type.", 5000);
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
              Display Employee Types
            </button>
            <button
              className={activeTab === "add" ? "active-tab" : ""}
              onClick={() => setActiveTab("add")}
            >
              Add Employee Type
            </button>
            <button
              className={activeTab === "edit" ? "active-tab" : ""}
              disabled={!editingEmployeeType}
              onClick={() => setActiveTab("edit")}
            >
              Edit Employee Type
            </button>
          </div>

          {activeTab === "display" && (
            <div>
              <h3>Existing Employee Types</h3>
              {isLoading ? (
                <p>Loading Employee Types...</p>
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : employeeTypeData.length === 0 ? (
                <p>No employee types available.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Employee Type Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeTypeData.map((employeeType, index) => (
                      <tr key={employeeType.EmployeeType_ID || `employeeType-${index}`}>
                        <td>{index + 1}</td>
                        <td>{employeeType.EmployeeType_Name}</td>
                        <td>
                          <button onClick={() => (setEditingEmployeeType(employeeType), setActiveTab("edit"))}>
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
              <h3>Add New Employee Type</h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="employeeTypeName">Employee Type Name</label>
                  <input
                    type="text"
                    name="employeeTypeName"
                    id="employeeTypeName"
                    value={formData.employeeTypeName}
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

          {activeTab === "edit" && editingEmployeeType && (
            <div>
              <h3>Edit Employee Type</h3>
              <form onSubmit={handleUpdate}>
                <div>
                  <label htmlFor="employeeTypeName">Employee Type Name</label>
                  <input
                    type="text"
                    name="EmployeeType_Name"
                    id="employeeTypeName"
                    value={editingEmployeeType.EmployeeType_Name}
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

export default EmployeeType;
