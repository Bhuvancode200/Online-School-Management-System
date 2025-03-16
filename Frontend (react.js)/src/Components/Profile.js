import React, { useContext, useState } from "react";
import Sidebar from "./Sidebar";
import { UserContext } from "./UserContext"; 
import CompanyHeader from './CompanyHeader';
import { useNavigate } from 'react-router-dom';
import "./Assets/Profile.css";

const Profile = () => {
  const { userDetails, setUserDetails } = useContext(UserContext); 
  const navigate = useNavigate();  
  const [isEditing, setIsEditing] = useState(false);

  const [ProfileuserData, setProfileUserData] = useState({
    companyName: userDetails?.companyName || '',
    Email: userDetails?.Email || '',
    compID: userDetails?.compID || '',
    status: userDetails?.status || '',
    mobno: userDetails?.mobno || '',
    Address: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileUserData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      console.log(updatedData);
      return updatedData;
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const EditpostData = {
      companyID: ProfileuserData.compID,
      companyName: ProfileuserData.companyName,
      Email: ProfileuserData.Email,
      MobileNo: ProfileuserData.mobno,
      Address: "",
      Password:"",
      Status: ProfileuserData.status,
    };

    try {
      const response = await fetch("https://localhost:44350/api/Company/Editcompany", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(EditpostData),
      });

      const data = await response.text();
      console.log("Success:", data);
     // setUserDetails(ProfileuserData); 
      setIsEditing(false); 
    // alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Error during profile update. Please try again.");
    }
  };

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Sidebar />
      <CompanyHeader />

      <div className="profile-content">
     
        <div className="profile-databox">
        <h3>Profile</h3>
        <div className="profile-details">
        {!isEditing ? (
  <table>
    <tbody> {/* Wrap the rows in tbody */}
      <tr>
        <td>Institution ID:</td>
        <td>{userDetails.compID}</td>
      </tr>
      <tr>
        <td>Institution Name:</td>
        <td>{userDetails.companyName}</td>
      </tr>
      <tr>
        <td>Status:</td>
        <td>{userDetails.status}</td>
      </tr>
      <tr>
        <td>Mobile No:</td>
        <td>{userDetails.mobno}</td>
      </tr>
      <tr>
        <td>Email:</td>
        <td>{userDetails.Email}</td>
      </tr>
      <tr>
        <td></td>
        <td>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </td>
      </tr>
    </tbody>
  </table>
) : (
  <form onSubmit={handleFormSubmit}>
    <div className="form-group">
      <label htmlFor="name">Institution Name:</label>
      <input
        type="text"
        id="name"
        name="companyName"
        value={ProfileuserData.companyName}
        onChange={handleInputChange}
      />
    </div>

    <div className="form-group">
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="Email"
        value={ProfileuserData.Email}
        onChange={handleInputChange}
      />
    </div>

    <div className="form-group">
      <label htmlFor="status">Status</label>
      <input
        id="status"
        name="status"
        value={ProfileuserData.status}
        onChange={handleInputChange}
        disabled
      />
    </div>

    <div className="form-group">
      <label htmlFor="mob">Mobile No</label>
      <input
        type="text"
        id="mob"
        name="mobno"
        value={ProfileuserData.mobno}
        onChange={handleInputChange}
      />
    </div>

    <div className="form-group">
      <label htmlFor="compid">Institute ID</label>
      <textarea
        id="compid"
        name="compID"
        value={ProfileuserData.compID}
        onChange={handleInputChange}
        disabled
      />
    </div>

    <button type="submit">Save Changes</button>
  </form>
)}

        </div>
      </div>
      </div>
    </div>
  );
};

export default Profile;
