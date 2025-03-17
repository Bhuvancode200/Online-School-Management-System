import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import CompanyHeader from "./CompanyHeader";
import { UserContext } from "./UserContext";
import "./Assets/Profile.css";
import "./Assets/Alert.css";

function Graphwise() {
  const { userDetails } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("classwiseGender");
  const [classwiseGenderData, setClasswiseGenderData] = useState([]);
  const [classwiseStudentData, setClasswiseStudentData] = useState([]);
  const [locationWiseStudentData, setLocationWiseStudentData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const profileUserData = {
    COMP_ID: userDetails?.COMP_ID || 0,
  };

  const showMessage = (msg, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, duration);
  };

  const fetchClasswiseGenderCount = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://localhost:44350/api/Graph/GetClasswiseGenderCount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          COMP_ID: profileUserData.COMP_ID,
          CLASS_ID: 0,
          IS_ACTIVE: 1,
          CLASS_NAME: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching classwise gender count: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Classwise Gender Data:", data); // Add console log
      setClasswiseGenderData(data || []);
    } catch (err) {
      setError(err.message || "An error occurred while fetching classwise gender count.");
      console.error("Error fetching classwise gender count:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClasswiseStudentCount = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://localhost:44350/api/Graph/GetClassWiseStudentCount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          COMP_ID: profileUserData.COMP_ID,
          CLASS_ID: 0,
          IS_ACTIVE: 1,
          CLASS_NAME: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching classwise student count: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Classwise Student Data:", data); // Add console log
      setClasswiseStudentData(data || []);
    } catch (err) {
      setError(err.message || "An error occurred while fetching classwise student count.");
      console.error("Error fetching classwise student count:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLocationWiseStudentList = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://localhost:44350/api/Graph/GetLocationWiseStudentList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          COMP_ID: profileUserData.COMP_ID,
          Location_ID: 0,
          IsActive: 1,
          Location_NAME: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching location-wise student list: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Location-wise Student Data:", data); // Add console log
      setLocationWiseStudentData(data || []);
    } catch (err) {
      setError(err.message || "An error occurred while fetching location-wise student list.");
      console.error("Error fetching location-wise student list:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "classwiseGender") {
      fetchClasswiseGenderCount();
    } else if (activeTab === "classwiseStudent") {
      fetchClasswiseStudentCount();
    } else if (activeTab === "locationWiseStudent") {
      fetchLocationWiseStudentList();
    }
  }, [activeTab]);

  return (
    <div>
      <Sidebar />
      <CompanyHeader />

      <div className="profile-content">
        {message && <div className="alert show">{message}</div>}

        <div className="profile-databox">
          <div className="tabs">
            <button
              className={activeTab === "classwiseGender" ? "active-tab" : ""}
              onClick={() => setActiveTab("classwiseGender")}
            >
              Classwise Gender Count
            </button>
            <button
              className={activeTab === "classwiseStudent" ? "active-tab" : ""}
              onClick={() => setActiveTab("classwiseStudent")}
            >
              Classwise Student Count
            </button>
            <button
              className={activeTab === "locationWiseStudent" ? "active-tab" : ""}
              onClick={() => setActiveTab("locationWiseStudent")}
            >
              Location-wise Student List
            </button>
          </div>

          {activeTab === "classwiseGender" && (
            <div>
              <h3>Classwise Gender Count</h3>
              {isLoading ? (
                <p>Loading data...</p>
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : classwiseGenderData.length === 0 ? (
                <p>No data available.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Class</th>
                      <th>Boys Count</th>
                      <th>Girls Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classwiseGenderData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.ClassName}</td>
                        <td>{item.BoysCount}</td>
                        <td>{item.GirlsCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "classwiseStudent" && (
            <div>
              <h3>Classwise Student Count</h3>
              {isLoading ? (
                <p>Loading data...</p>
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : classwiseStudentData.length === 0 ? (
                <p>No data available.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Class</th>
                      <th>Student Names</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classwiseStudentData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.ClassNameWiseCount}</td>
                        <td>{item.StudentNames}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "locationWiseStudent" && (
            <div>
              <h3>Location-wise Student List</h3>
              {isLoading ? (
                <p>Loading data...</p>
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : locationWiseStudentData.length === 0 ? (
                <p>No data available.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>Student Count</th>
                      <th>Location with Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locationWiseStudentData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.LocationName}</td>
                        <td>{item.StudentCount}</td>
                        <td>{item.LocationWithCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Graphwise;