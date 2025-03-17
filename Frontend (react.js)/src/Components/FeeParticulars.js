import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import CompanyHeader from "./CompanyHeader";
import { UserContext } from "./UserContext";
import "./Assets/Profile.css";
import "./Assets/Alert.css";

function FeesParticulars() {
  const { userDetails } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("display");
  const [formData, setFormData] = useState({ feesParticularName: "" });
  const [feesParticularData, setFeesParticularData] = useState([]);
  const [editingFeesParticular, setEditingFeesParticular] = useState(null);
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


  const fetchFeesParticulars = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://localhost:44350/api/Fees/GetFeesParticulars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Company_ID: profileUserData.compID,
          FeesParticularID: 0,
          IsActive: 1,
          FeesParticularName: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching Fees Particulars: ${response.statusText}`);
      }

      const data = await response.json();
      setFeesParticularData(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching Fees Particulars:", err);
    } finally {
      setIsLoading(false);
    }
  } ;

  useEffect(() => {
    fetchFeesParticulars();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === "add") {
      setFormData({ ...formData, [name]: value });
    } else if (activeTab === "edit" && editingFeesParticular) {
      setEditingFeesParticular({ ...editingFeesParticular, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:44350/api/Fees/InsertFeesParticular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Company_ID: profileUserData.compID,
          IsActive: 1,
          FeesParticularName: formData.feesParticularName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add Fees Particular.");
      }

      showMessage("Fees Particular added successfully!");
      fetchFeesParticulars();
      setFormData({ feesParticularName: "" });
      setActiveTab("display");
    } catch (err) {
      console.error("Error adding Fees Particular:", err);
      showMessage(err.message, 5000);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:44350/api/Fees/UpdateFeesParticular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Company_ID: editingFeesParticular.Company_ID,
          FeesParticularID: editingFeesParticular.FeesParticularID,
          IsActive: 1,
          FeesParticularName: editingFeesParticular.FeesParticularName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update Fees Particular.");
      }

      showMessage("Fees Particular updated successfully!");
      fetchFeesParticulars();
      setEditingFeesParticular(null);
      setActiveTab("display");
    } catch (err) {
      console.error("Error updating Fees Particular:", err);
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
              Display Fees Particulars
            </button>
            <button
              className={activeTab === "add" ? "active-tab" : ""}
              onClick={() => setActiveTab("add")}
            >
              Add Fees Particular
            </button>
            <button
              className={activeTab === "edit" ? "active-tab" : ""}
              disabled={!editingFeesParticular}
              onClick={() => setActiveTab("edit")}
            >
              Edit Fees Particular
            </button>
          </div>

          {activeTab === "display" && (
            <div>
              <h3>Existing Fees Particulars</h3>
              {isLoading ? (
                <p>Loading Fees Particulars...</p>
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : feesParticularData.length === 0 ? (
                <p>No Fees Particulars available.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Fees Particular Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feesParticularData.map((feesParticular, index) => (
                      <tr key={feesParticular.FeesParticularID || `feesParticular-${index}`}>
                        <td>{index + 1}</td>
                        <td>{feesParticular.FeesParticularName}</td>
                        <td>
                          <button onClick={() => {
                            setEditingFeesParticular(feesParticular);
                            setActiveTab("edit");
                          }}
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
              <h3>Add New Fees Particular</h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="feesParticularName">Fees Particular Name</label>
                  <input
                    type="text"
                    name="feesParticularName"
                    id="feesParticularName"
                    value={formData.feesParticularName}
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

          {activeTab === "edit" && editingFeesParticular && (
            <div>
              <h3>Edit Fees Particular</h3>
              <form onSubmit={handleUpdate}>
                <div>
                  <label htmlFor="feesParticularName">Fees Particular Name</label>
                  <input
                    type="text"
                    name="FeesParticularName"
                    id="feesParticularName"
                    value={editingFeesParticular.FeesParticularName}
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

export default FeesParticulars;
