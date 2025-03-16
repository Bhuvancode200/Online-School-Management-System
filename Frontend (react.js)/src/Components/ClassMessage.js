import React, { useState } from "react";
import Sidebar from "./Sidebar";
import CompanyHeader from "./CompanyHeader";
import "./Assets/Profile.css";
import "./Assets/Alert.css";

const ClassMessageForm = () => {
  const [subjectTitle, setSubjectTitle] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [recipients, setRecipients] = useState([]); 
  const [fileAttachment, setFileAttachment] = useState(null);
  const [urgencyLevel, setUrgencyLevel] = useState("");
  const [statusMessage, setStatusMessage] = useState("Pending");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  const classData = [
    { CLASS_ID: 1, CLASS_NAME: "Class A" },
    { CLASS_ID: 2, CLASS_NAME: "Class B" },
    { CLASS_ID: 3, CLASS_NAME: "Class C" },
    { CLASS_ID: 4, CLASS_NAME: "Class D" },
  ];

  const urgencyOptions = ["High", "Medium", "Low"];

  const handleRecipientsChange = (classId) => {
    setRecipients((prev) => {
      if (prev.includes(classId)) {
        return prev.filter((id) => id !== classId);
      } else {
        return [...prev, classId];
      }
    });
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen); 
  };
/*
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      subjectTitle,
      messageBody,
      recipients,
      fileAttachment,
      urgencyLevel,
      statusMessage,
    };
    console.log("Submitting message:", formData);
  };  */
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      SenderID: 1, // Replace with the actual sender ID
      Subject: subjectTitle,
      MessageBody: messageBody,
      Recipients: recipients.join(","), 
      Attachments: null, 
      UrgencyLevel: urgencyLevel,
      StatusMessage: statusMessage,
    };
  
    try {
      const response = await fetch("http://localhost:3000/api/ClassMessages/InsertMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit message.");
      }
  
      const result = await response.json();
      console.log("Message submitted successfully:", result);
    } catch (error) {
      console.error("Error submitting message:", error);
    }
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
            Send Class Message
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Subject Title */}
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="subjectTitle"
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Subject Title
              </label>
              <input
                type="text"
                id="subjectTitle"
                value={subjectTitle}
                onChange={(e) => setSubjectTitle(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>

            {/* Message Body */}
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="messageBody"
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Message Body
              </label>
              <textarea
                id="messageBody"
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                required
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>

            {/* Select Classes */}
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Select Classes
              </label>
              <div>
                <button
                  type="button"
                  onClick={handleDropdownToggle}
                  style={{
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    width: "100%",
                    textAlign: "left",
                    backgroundColor: "#f9f9f9",
                    cursor: "pointer",
                    color: recipients.length === 0 ? "black" : "inherit",
                  }}
                >
                  {recipients.length > 0
                    ? `${recipients.length} Class Selected`
                    : "-- select classes --"}
                </button>

                {isDropdownOpen && (
                  <div
                    style={{
                      marginTop: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "10px",
                      maxHeight: "200px",
                      overflowY: "auto",
                      backgroundColor: "#fff",
                    }}
                  >
                    {classData.map((classItem) => (
                      <div
                        key={classItem.CLASS_ID}
                        style={{
                          marginBottom: "5px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <label
                          htmlFor={`class-${classItem.CLASS_ID}`}
                          style={{
                            marginRight: "10px",
                            fontWeight: "normal",
                            whiteSpace: "nowrap", 
                          }}
                        >
                          {classItem.CLASS_NAME}
                        </label>
                        <input
                          type="checkbox"
                          id={`class-${classItem.CLASS_ID}`}
                          value={classItem.CLASS_ID}
                          checked={recipients.includes(classItem.CLASS_ID)}
                          onChange={() => handleRecipientsChange(classItem.CLASS_ID)}
                          style={{
                            transform: "scale(1.2)", 
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>

            {/* File Attachment */}
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="fileAttachment"
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                File Attachment
              </label>
              <input
                type="file"
                id="fileAttachment"
                onChange={(e) => setFileAttachment(e.target.files[0])}
                style={{
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  width: "100%",
                }}
              />
            </div>

            {/* Urgency Level */}
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="urgencyLevel"
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Urgency Level
              </label>
              <select
                id="urgencyLevel"
                value={urgencyLevel}
                onChange={(e) => setUrgencyLevel(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="">Select urgency...</option>
                {urgencyOptions.map((level, index) => (
                  <option key={index} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div style={{ textAlign: "center" }}>
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClassMessageForm;
