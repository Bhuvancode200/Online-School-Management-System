import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import CompanyHeader from "./CompanyHeader";
import { UserContext } from "./UserContext";
import "./Assets/Profile.css";
import "./Assets/Alert.css";

function EmployeeDeduction() {
    const { userDetails } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState("display");
    const [formData, setFormData] = useState({ DeductionParticularName: "" });
    const [deductionData, setDeductionData] = useState([]);
    const [editingDeduction, setEditingDeduction] = useState(null);
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

    const fetchDeductions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("https://localhost:44350/api/Deduction/GetDeductions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    compID: profileUserData.compID,
                    DeductionID: 0,
                    IsActive: 1,
                    DeductionParticularName: "",
                }),
            });

            if (!response.ok) {
                throw new Error(`Error fetching deductions: ${response.statusText}`);
            }

            const data = await response.json();
            setDeductionData(data || []);
        } catch (err) {
            setError(err.message || "An error occurred while fetching deductions.");
            console.error("Error fetching deductions:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDeductions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (activeTab === "add") {
            setFormData({ ...formData, [name]: value });
        } else if (activeTab === "edit" && editingDeduction) {
            setEditingDeduction({ ...editingDeduction, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.DeductionParticularName.trim()) {
            showMessage("Deduction ParticularName cannot be empty.", 5000);
            return;
        }

        try {
            const response = await fetch("https://localhost:44350/api/Deduction/DeductionCreate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    compID: profileUserData.compID,
                    IsActive: 1,
                    DeductionParticularName: formData.DeductionParticularName,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add deduction.");
            }

            showMessage("Deduction added successfully!");
            fetchDeductions();
            setFormData({ DeductionParticularName: "" });
            setActiveTab("display");
        } catch (err) {
            console.error("Error adding deduction:", err);
            showMessage(err.message || "An error occurred while adding deduction.", 5000);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingDeduction?.DeductionParticularName.trim()) {
            showMessage("Deduction ParticularName cannot be empty.", 5000);
            return;
        }

        try {
            const response = await fetch("https://localhost:44350/api/Deduction/UpdateDeduction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    compID: editingDeduction.compID,
                    DeductionID: editingDeduction.DeductionID,
                    IsActive: 1,
                    DeductionParticularName: editingDeduction.DeductionParticularName,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update deduction.");
            }

            showMessage("Deduction updated successfully!");
            fetchDeductions();
            setEditingDeduction(null);
            setActiveTab("display");
        } catch (err) {
            console.error("Error updating deduction:", err);
            showMessage(err.message || "An error occurred while updating deduction.", 5000);
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
                            Display Deductions
                        </button>
                        <button
                            className={activeTab === "add" ? "active-tab" : ""}
                            onClick={() => setActiveTab("add")}
                        >
                            Add Deduction
                        </button>
                        <button
                            className={activeTab === "edit" ? "active-tab" : ""}
                            disabled={!editingDeduction}
                            onClick={() => setActiveTab("edit")}
                        >
                            Edit Deduction
                        </button>
                    </div>

                    {activeTab === "display" && (
                        <div>
                            <h3>Existing Deductions</h3>
                            {isLoading ? (
                                <p>Loading Deductions...</p>
                            ) : error ? (
                                <p style={{ color: "red" }}>{error}</p>
                            ) : deductionData.length === 0 ? (
                                <p>No deductions available.</p>
                            ) : (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Deduction Particular Name</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deductionData.map((deduction, index) => (
                                            <tr key={deduction.DeductionID || `deduction-${index}`}>
                                                <td>{index + 1}</td>
                                                <td>{deduction.DeductionParticularName}</td>
                                                <td>
                                                    <button onClick={() => (setEditingDeduction(deduction), setActiveTab("edit"))}>
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
                            <h3>Add New Deduction</h3>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="DeductionParticularName">Deduction Particular Name</label>
                                    <input
                                        type="text"
                                        name="DeductionParticularName"
                                        id="DeductionParticularName"
                                        value={formData.DeductionParticularName}
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

                    {activeTab === "edit" && editingDeduction && (
                        <div>
                            <h3>Edit Deduction</h3>
                            <form onSubmit={handleUpdate}>
                                <div>
                                    <label htmlFor="DeductionParticularName">Deduction Particular Name</label>
                                    <input
                                        type="text"
                                        name="DeductionParticularName"
                                        id="DeductionParticularName"
                                        value={editingDeduction.DeductionParticularName}
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

export default EmployeeDeduction;