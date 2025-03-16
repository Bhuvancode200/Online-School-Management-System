import React, { useContext } from "react";
import Sidebar from "./Sidebar";
import { UserContext } from "./UserContext";
import profileIcon from "./Assets/Icons/profile.png"; // Adjust path as necessary
import { CgEnter } from "react-icons/cg";
import bgIcon from "./Assets/Icons/Lib.png"; // Adjust path as necessary

import bgheader from "./Assets/Icons/LoginPageHeader.jpg"; // Adjust path as necessary
const divStyle = {
  backgroundImage: `url(${bgheader})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
 
};

const CompanyHeader = () => {
  const { userDetails } = useContext(UserContext); // Access user details from context

  const handleClick = () => {
    alert("Button clicked!");
  };

  if (!userDetails) {
    return <div>Loading...</div>; // or redirect to login page, depending on your flow
  }

  return (

   
    <div className="CompanyHeader">

      <div style={{ display: "flex"}}>

      <div >
      <div style={{ marginLeft:"10px",alignItems:"center",display:"flex" }}>

       
      <img
            src={bgIcon}
            alt="Profile Icon"
            style={{ width: "80px", height: "80px" }}
          />


<div style={{
  marginLeft: "10px",
  alignItems: "center",
  display: "flex",
  fontSize: "30px", // Bigger text size
  color: "yellow",        // Purple text color
  fontFamily: "'Georgia', serif" ,
  fontWeight: "bold" // Make it bold if desired
}}>
   Next Gen AI
</div>
        </div>

        </div>

        <div >
      <div style={{ marginLeft:"200px",alignItems:"center" }}>

       
        <h1 style={{ marginTop:"15px",alignItems:"center" }}>{userDetails.companyName}</h1>
        </div>

        </div>

        <div style={{alignItems:"center",marginLeft:"800px",marginBottom:"50px"} }>
        <button onClick={handleClick}   style={{ border: "none", background: "none", cursor: "pointer", marginLeft: "auto" }}>
          <img
            src={profileIcon}
            alt="Profile Icon"
            style={{ width: "50px", height: "50px" }}
          />
        </button>
        </div>
      </div>

     
    </div>


  );



};

export default CompanyHeader;
