import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import CompanyHeader from "./CompanyHeader";
import "./Assets/Profile.css";
import "./Assets/Alert.css";
import { UserContext } from "./UserContext";



function ClassFeesForm  () {
  const { userDetails } = useContext(UserContext);

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [feesData, setFeesData] = useState([]);
  const [courseData, setCourseData] = useState([]); // Store courses
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const profileUserData = {
    compID: userDetails?.compID || 0,
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

  //     if (!response.ok) {
  //       throw new Error(`Error fetching courses: ${response.statusText}`);
  //     }

  //     const data = await response.json();
  //     setCourseData(data || []);
  //   } catch (err) {
  //     setError(err.message || "An error occurred while fetching courses.");
  //     console.error("Error fetching courses:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const data = await response.json();
    console.log("API Response:", data); // Debugging

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format. Expected an array.");
    }

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

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const handleSubmit = () => {
    console.log("Submitting data: ", { selectedClass, feesData });
  };

  return (
    <div>
      <Sidebar />
      <CompanyHeader />
      <div className="profile-content">
        <div
          style={{
            maxWidth: "600px",
            margin: "20px auto",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
           <h2
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#007bff",
              fontSize: "24px",
            }}
          >
            Class Fees
          </h2>
          <label>Select Class</label>
          <select value={selectedClass} onChange={handleClassChange} style={{ width: "100%", marginBottom: "20px", padding: "10px" }}>
            <option value="">-- Select Class --</option>
            {courseData.map((course) => (
              <option key={course.CLASS_ID} value={course.CLASS_ID}>
                {course.CLASS_NAME}
              </option>
            ))}
          </select> 
          
          <table border="1" width="100%" style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Fees Particular Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {feesData.length > 0 ? (
                feesData.map((fee, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{fee.feesParticularName}</td>
                    <td>{fee.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>No Data Available</td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button onClick={handleSubmit} style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassFeesForm;



