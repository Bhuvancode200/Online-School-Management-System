import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import CompanyHeader from "./CompanyHeader";
import { UserContext } from "./UserContext";
import "./Assets/Profile.css";
import "./Assets/Alert.css";

function Shift() {
    const { userDetails } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState("display");
    const [formData, setFormData] = useState({ Shift_Name: "" });
    const [shiftData, setShiftData] = useState([]);
    const [editingShift, setEditingShift] = useState(null);
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

    const fetchShifts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("https://localhost:44350/api/Shift/GetShifts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    compID: profileUserData.compID,
                    Shift_ID: 0,
                    IsActive: 1,
                    Shift_Name: "",
                }),
            });

            if (!response.ok) {
                throw new Error(`Error fetching shifts: ${response.statusText}`);
            }

            const data = await response.json();
            setShiftData(data || []);
        } catch (err) {
            setError(err.message || "An error occurred while fetching shifts.");
            console.error("Error fetching shifts:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchShifts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (activeTab === "add") {
            setFormData({ ...formData, [name]: value });
        } else if (activeTab === "edit" && editingShift) {
            setEditingShift({ ...editingShift, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.Shift_Name.trim()) {
            showMessage("Shift name cannot be empty.", 5000);
            return;
        }

        try {
            const response = await fetch("https://localhost:44350/api/Shift/CreateShift", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    compID: profileUserData.compID,
                    IsActive: 1,
                    Shift_Name: formData.Shift_Name,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add shift.");
            }

            showMessage("Shift added successfully!");
            fetchShifts();
            setFormData({ Shift_Name: "" });
            setActiveTab("display");
        } catch (err) {
            console.error("Error adding shift:", err);
            showMessage(err.message || "An error occurred while adding shift.", 5000);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingShift?.Shift_Name.trim()) {
            showMessage("Shift name cannot be empty.", 5000);
            return;
        }

        try {
            const response = await fetch("https://localhost:44350/api/Shift/UpdateShift", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    compID: editingShift.compID,
                    Shift_ID: editingShift.Shift_ID,
                    IsActive: 1,
                    Shift_Name: editingShift.Shift_Name,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update shift.");
            }

            showMessage("Shift updated successfully!");
            fetchShifts();
            setEditingShift(null);
            setActiveTab("display");
        } catch (err) {
            console.error("Error updating shift:", err);
            showMessage(err.message || "An error occurred while updating shift.", 5000);
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
                            Display Shifts
                        </button>
                        <button
                            className={activeTab === "add" ? "active-tab" : ""}
                            onClick={() => setActiveTab("add")}
                        >
                            Add Shift
                        </button>
                        <button
                            className={activeTab === "edit" ? "active-tab" : ""}
                            disabled={!editingShift}
                            onClick={() => setActiveTab("edit")}
                        >
                            Edit Shift
                        </button>
                    </div>

                    {activeTab === "display" && (
                        <div>
                            <h3>Existing Shifts</h3>
                            {isLoading ? (
                                <p>Loading Shifts...</p>
                            ) : error ? (
                                <p style={{ color: "red" }}>{error}</p>
                            ) : shiftData.length === 0 ? (
                                <p>No shifts available.</p>
                            ) : (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Shift Name</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shiftData.map((shift, index) => (
                                            <tr key={shift.Shift_ID || `shift-${index}`}>
                                                <td>{index + 1}</td>
                                                <td>{shift.Shift_Name}</td>
                                                <td>
                                                    <button onClick={() => { setEditingShift(shift); setActiveTab("edit"); }}>
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
                            <h3>Add New Shift</h3>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="Shift_Name">Shift Name</label>
                                    <input
                                        type="text"
                                        name="Shift_Name"
                                        id="Shift_Name"
                                        value={formData.Shift_Name}
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

                    {activeTab === "edit" && editingShift && (
                        <div>
                            <h3>Edit Shift</h3>
                            <form onSubmit={handleUpdate}>
                                <div>
                                    <label htmlFor="Shift_Name">Shift Name</label>
                                    <input
                                        type="text"
                                        name="Shift_Name"
                                        id="Shift_Name"
                                        value={editingShift.Shift_Name}
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

export default Shift;
