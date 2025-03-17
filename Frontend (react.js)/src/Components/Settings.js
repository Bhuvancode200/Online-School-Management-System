import React,{useContext} from "react";
import Sidebar from "./Sidebar";
import CompanyHeader from './CompanyHeader';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "./UserContext"; // Import UserContext

const Setting=()=>{

    const { userDetails } = useContext(UserContext); // Access user details from context
    const navigate = useNavigate();  // To navigate programmatically if needed
  
    // Handle loading state when userDetails is not available
    if (!userDetails) {
      return <div>Loading...</div>; // Show loading or a redirect message
    }
  
    return (
      <div>
        <Sidebar />
       <CompanyHeader />
  <div  style={{ marginLeft: "300px",marginTop:"200px"}}>
        {/* Display Profile Details */}
        <h2>Welcome to Setting  Page</h2>
        <h3>{userDetails.companyName}</h3>
        {/* You can display more userDetails fields here */}
        <p>Company ID: {userDetails.compID}</p>
        <p>Status: {userDetails.status}</p>
      </div>
  
      </div>
    );

}


export default Setting;
