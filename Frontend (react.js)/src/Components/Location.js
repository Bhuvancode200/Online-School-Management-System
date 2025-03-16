import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import CompanyHeader from "./CompanyHeader";
import { UserContext } from "./UserContext";
import "./Assets/Profile.css";
import "./Assets/Alert.css";

function Locations() {
  const { userDetails } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("display");
  const [formData, setFormData] = useState({ locationName: "" });
  const [locationData, setLocationData] = useState([]);
  const [editingLocation, setEditingLocation] = useState(null);
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

  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://localhost:44350/api/Location/GetLocations", {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === "add") {
      setFormData({ ...formData, [name]: value });
    } else if (activeTab === "edit" && editingLocation) {
      setEditingLocation({ ...editingLocation, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.locationName.trim()) {
      showMessage("Location name cannot be empty.", 5000);
      return;
    }

    try {
      const response = await fetch("https://localhost:44350/api/Location/LocationCreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Company_ID: profileUserData.compID,
          IsActive: 1,
          Location_NAME: formData.locationName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add location.");
      }

      showMessage("Location added successfully!");
      fetchLocations();
      setFormData({ locationName: "" });
      setActiveTab("display");
    } catch (err) {
      console.error("Error adding location:", err);
      showMessage(err.message || "An error occurred while adding location.", 5000);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingLocation?.Location_Name.trim()) {
      showMessage("Location name cannot be empty.", 5000);
      return;
    }

    try {
      const response = await fetch("https://localhost:44350/api/Location/UpdateLocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Company_ID: editingLocation.compID,
          Location_ID: editingLocation.Location_ID,
          IsActive: 1,
          Location_NAME: editingLocation.Location_Name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update location.");
      }

      showMessage("Location updated successfully!");
      fetchLocations();
      setEditingLocation(null);
      setActiveTab("display");
    } catch (err) {
      console.error("Error updating location:", err);
      showMessage(err.message || "An error occurred while updating location.", 5000);
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
              Display Locations
            </button>
            <button
              className={activeTab === "add" ? "active-tab" : ""}
              onClick={() => setActiveTab("add")}
            >
              Add Location
            </button>
            <button
              className={activeTab === "edit" ? "active-tab" : ""}
              disabled={!editingLocation}
              onClick={() => setActiveTab("edit")}
            >
              Edit Location
            </button>
          </div>

          {activeTab === "display" && (
            <div>
              <h3>Existing Locations</h3>
              {isLoading ? (
                <p>Loading Locations...</p>
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : locationData.length === 0 ? (
                <p>No locations available.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Location Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locationData.map((location, index) => (
                      <tr key={location.Location_ID || `location-${index}`}>
                        <td>{index + 1}</td>
                        <td>{location.Location_Name}</td>
                        <td>
                          <button onClick={() => (setEditingLocation(location), setActiveTab("edit"))}>
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
              <h3>Add New Location</h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="locationName">Location Name</label>
                  <input
                    type="text"
                    name="locationName"
                    id="locationName"
                    value={formData.locationName}
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

          {activeTab === "edit" && editingLocation && (
            <div>
              <h3>Edit Location</h3>
              <form onSubmit={handleUpdate}>
                <div>
                  <label htmlFor="locationName">Location Name</label>
                  <input
                    type="text"
                    name="Location_Name"
                    id="locationName"
                    value={editingLocation.Location_Name}
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

export default Locations;
