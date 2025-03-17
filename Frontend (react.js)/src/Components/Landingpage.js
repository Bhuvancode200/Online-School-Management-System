import React,{useContext} from 'react';
import Sidebar from './Sidebar';
import CompanyHeader from './CompanyHeader';
import {UserContext} from "./UserContext";

const Landingpage = () => {

  const { userDetails } = useContext(UserContext); // Access user details from context
  if (!userDetails) {
    return <div>Loading...</div>; // or redirect to login page, depending on your flow
  }

  return (

    <div >

<Sidebar/>
<CompanyHeader />
      </div>

    




    
  );
};

export default Landingpage;
