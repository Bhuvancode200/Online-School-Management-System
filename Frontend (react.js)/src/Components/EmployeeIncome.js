import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import CompanyHeader from "./CompanyHeader";
import { UserContext } from "./UserContext";
import "./Assets/Profile.css";
import "./Assets/Alert.css";

function EmployeeIncome() {
    const { userDetails } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState("display");
    const [formData, setFormData] = useState({ IncomeParticularName: "" });
    const [incomeData, setIncomeData] = useState([]);
    const [editingIncome, setEditingIncome] = useState(null);
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

    const fetchIncomes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("https://localhost:44350/api/Income/GetIncomes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    compID: profileUserData.compID,
                    IncomeID: 0,
                    IsActive: 1,
                    IncomeParticularName: "",
                }),
            });

            if (!response.ok) {
                throw new Error(`Error fetching incomes: ${response.statusText}`);
            }

            const data = await response.json();
            setIncomeData(data || []);
        } catch (err) {
            setError(err.message || "An error occurred while fetching incomes.");
            console.error("Error fetching incomes:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchIncomes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (activeTab === "add") {
            setFormData({ ...formData, [name]: value });
        } else if (activeTab === "edit" && editingIncome) {
            setEditingIncome({ ...editingIncome, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.IncomeParticularName.trim()) {
            showMessage("Income ParticularName cannot be empty.", 5000);
            return;
        }

        try {
            const response = await fetch("https://localhost:44350/api/Income/IncomeCreate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    compID: profileUserData.compID,
                    IsActive: 1,
                    IncomeParticularName: formData.IncomeParticularName,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add income.");
            }

            showMessage("Income added successfully!");
            fetchIncomes();
            setFormData({ IncomeParticularName: "" });
            setActiveTab("display");
        } catch (err) {
            console.error("Error adding income:", err);
            showMessage(err.message || "An error occurred while adding income.", 5000);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingIncome?.IncomeParticularName.trim()) {
            showMessage("Income ParticularName cannot be empty.", 5000);
            return;
        }

        try {
            const response = await fetch("https://localhost:44350/api/Income/UpdateIncome", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    compID: editingIncome.compID,
                    IncomeID: editingIncome.IncomeID,
                    IsActive: 1,
                    IncomeParticularName: editingIncome.IncomeParticularName,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update income.");
            }

            showMessage("Income updated successfully!");
            fetchIncomes();
            setEditingIncome(null);
            setActiveTab("display");
        } catch (err) {
            console.error("Error updating income:", err);
            showMessage(err.message || "An error occurred while updating income.", 5000);
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
                            Display Incomes
                        </button>
                        <button
                            className={activeTab === "add" ? "active-tab" : ""}
                            onClick={() => setActiveTab("add")}
                        >
                            Add Income
                        </button>
                        <button
                            className={activeTab === "edit" ? "active-tab" : ""}
                            disabled={!editingIncome}
                            onClick={() => setActiveTab("edit")}
                        >
                            Edit Income
                        </button>
                    </div>

                    {activeTab === "display" && (
                        <div>
                            <h3>Existing Incomes</h3>
                            {isLoading ? (
                                <p>Loading Incomes...</p>
                            ) : error ? (
                                <p style={{ color: "red" }}>{error}</p>
                            ) : incomeData.length === 0 ? (
                                <p>No incomes available.</p>
                            ) : (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Income Particular Name</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incomeData.map((income, index) => (
                                            <tr key={income.IncomeID || `income-${index}`}>
                                                <td>{index + 1}</td>
                                                <td>{income.IncomeParticularName}</td>
                                                <td>
                                                    <button onClick={() => (setEditingIncome(income), setActiveTab("edit"))}>
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
                            <h3>Add New Income</h3>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="IncomeParticularName">Income Particular Name</label>
                                    <input
                                        type="text"
                                        name="IncomeParticularName"
                                        id="IncomeParticularName"
                                        value={formData.IncomeParticularName}
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

                    {activeTab === "edit" && editingIncome && (
                        <div>
                            <h3>Edit Income</h3>
                            <form onSubmit={handleUpdate}>
                                <div>
                                    <label htmlFor="IncomeParticularName">Income Particular Name</label>
                                    <input
                                        type="text"
                                        name="IncomeParticularName"
                                        id="IncomeParticularName"
                                        value={editingIncome.IncomeParticularName}
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

export default EmployeeIncome;