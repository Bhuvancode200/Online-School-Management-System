import React from "react";
import "./Assets/Alert.css";

const Alert = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`alert ${type}`}>
      <span>{message}</span>
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

export default Alert;
