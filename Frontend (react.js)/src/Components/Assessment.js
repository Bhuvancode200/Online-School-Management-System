import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import CompanyHeader from "./CompanyHeader";
import { UserContext } from "./UserContext";
import "./Assets/Profile.css";
import "./Assets/Alert.css";

function Assessment() {
const { userDetails } = useContext(UserContext);
const [activeTab, setActiveTab] = useState("display");
const [formData, setFormData] = useState({ assessmentName: "" });
const [assessmentData, setAssessmentData] = useState([]);
const [editingAssessment, setEditingAssessment] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [message, setMessage] = useState(null);

const profileUserData = {
CompID: userDetails?.CompID || 0,
};

const showMessage = (msg, duration = 3000) => {
setMessage(msg);
setTimeout(() => {
setMessage(null);
}, duration);
};

const fetchAssessments = async () => {
setIsLoading(true);
setError(null);
try {
const response = await fetch("https://localhost:44350/api/Assessments/GetAssessments", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
CompID: profileUserData.CompID,
AssessmentID: 0,
IsActive: 1,
AssessmentName: "",
}),
});

if (!response.ok) {
throw new Error(`Error fetching Assessments: ${response.statusText}`);
}

const data = await response.json();
setAssessmentData(data || []);
} catch (err) {
setError(err.message);
console.error("Error fetching Assessments:", err);
} finally {
setIsLoading(false);
}
};

useEffect(() => {
fetchAssessments();
}, []);

const handleChange = (e) => {
const { name, value } = e.target;
if (activeTab === "add") {
setFormData({ ...formData, [name]: value });
} else if (activeTab === "edit" && editingAssessment) {
setEditingAssessment({ ...editingAssessment, [name]: value });
}
};

const handleSubmit = async (e) => {
e.preventDefault();
if (!formData.assessmentName.trim()) {
showMessage("Assessment name cannot be empty.", 5000);
return;
}

try {
const response = await fetch("https://localhost:44350/api/Assessments/InsertAssessment", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
CompID: profileUserData.CompID,
IsActive: 1,
AssessmentName: formData.assessmentName,
}),
});

if (!response.ok) {
//const errorData = await response.json();
throw new Error( "Failed to add Assessment.");
}

showMessage("Assessment added successfully!");
fetchAssessments();
setFormData({ assessmentName: "" });
setActiveTab("display");
} catch (err) {
console.error("Error adding Assessment:", err);
showMessage(err.message || "An error occurred while adding assessment.", 5000);
}
};

const handleUpdate = async (e) => {
e.preventDefault();
if (!editingAssessment?.AssessmentName.trim()) {
showMessage("Assessment name cannot be empty.", 5000);
return;
}

try {
const response = await fetch("https://localhost:44350/api/Assessments/UpdateAssessment", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
CompID: editingAssessment.CompID,
AssessmentID: editingAssessment.AssessmentID,
IsActive: 1,
AssessmentName: editingAssessment.AssessmentName,
}),
});

if (!response.ok) {
//const errorData = await response.json();
throw new Error( "Failed to update Assessment.");
}

showMessage("Assessment updated successfully!");
fetchAssessments();
setEditingAssessment(null);
setActiveTab("display");
} catch (err) {
console.error("Error updating Assessment:", err);
showMessage(err.message || "An error occurred while updating assessment.", 5000);
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
Display Assessments
</button>
<button
className={activeTab === "add" ? "active-tab" : ""}
onClick={() => setActiveTab("add")}
>
Add Assessment
</button>
<button
className={activeTab === "edit" ? "active-tab" : ""}
disabled={!editingAssessment}
onClick={() => setActiveTab("edit")}
>
Edit Assessment
</button>
</div>

{activeTab === "display" && (
<div>
<h3>Existing Assessments</h3>
{isLoading ? (
<p>Loading Assessments...</p>
) : error ? (
<p style={{ color: "red" }}>{error}</p>
) : assessmentData.length === 0 ? (
<p>No Assessments available.</p>
) : (
<table className="table">
<thead>
<tr>
<th>#</th>
<th>Assessment Name</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
{assessmentData.map((assessment, index) => (
<tr key={assessment.AssessmentID || `assessment-${index}`}>
<td>{index + 1}</td>
<td>{assessment.AssessmentName}</td>
<td>
<button
onClick={() => 
(setEditingAssessment(assessment),
setActiveTab("edit"))
}
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
<h3>Add New Assessment</h3>
<form onSubmit={handleSubmit}>
<div>
<label htmlFor="assessmentName">Assessment Name</label>
<input
type="text"
name="assessmentName"
id="assessmentName"
value={formData.assessmentName}
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

{activeTab === "edit" && editingAssessment && (
<div>
<h3>Edit Assessment</h3>
<form onSubmit={handleUpdate}>
<div>
<label htmlFor="assessmentName">Assessment Name</label>
<input
type="text"
name="AssessmentName"
id="assessmentName"
value={editingAssessment.AssessmentName}
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

export default Assessment;