
import SignInSignup from "./Components/SignInSignup";
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Landingpage from "./Components/Landingpage";
import { Link } from "react-router-dom";
import Profile from "./Components/Profile";
import Setting from "./Components/Settings";
import Course from "./Components/Course";
import Student from "./Components/Student";
import Graphwise from "./Components/Graphwise";
import Subject from "./Components/Subject";
import Location from "./Components/Location";
//import Assessment from "./Components/Assessment";
import FeeParticulars from "./Components/FeeParticulars";
import Department from "./Components/Department";
import EmployeeType from "./Components/EmployeeType";
import ClassMessage from "./Components/ClassMessage";
import "./App.css";
import EmployeeIncome from "./Components/EmployeeIncome";
import EmployeeDeduction from "./Components/EmployeeDeduction";
import Shift from "./Components/Shift";
import Classfees from "./Components/Classfees";
function App() {

const[user,setUser]=useState(null);
//const[compuser,Setcompdetials]=useState(null);



  return (


   
    <Router>
    <div className="background">
 
     

      <Routes>
        {/* Home Page */}
        <Route path="/" element={<SignInSignup setUser={setUser} />} />

        {/* Login Page */}
        <Route path="/login" element={<SignInSignup setUser={setUser} />} />

        {/* Landing Page */}
        <Route
          path="/landing"
          element={ <Landingpage/>}
        />

        {/* Catch-all Route for Unknown Paths */}
        <Route path="*" element={<Navigate to="/" />} />

        <Route
          path="/Profile"
          element={ <Profile/>}
        />
     <Route
          path="/Setting"
          element={ <Setting/>}
        />

<Route
          path="/Class"
          element={ <Course/>}
        />

         <Route
          path="/Subject"
          element={ <Subject/>}
        />

       <Route
          path="/Student"
          element={ <Student/>}
        />
<Route
          path="/Graphwise"
          element={ <Graphwise/>}
        />

<Route
          path="/Location"
          element={ <Location/>}
        />
{/* <Route
          path="Assessment"
          element={ <Assessment/>}
        /> */}
 <Route
          path="FeeParticulars"
          element={ <FeeParticulars/>}
        />
 <Route
          path="Department"
          element={ <Department/>}
        />
  <Route
          path="EmployeeType"
          element={ <EmployeeType/>}
        />
  <Route
          path="EmployeeIncome"
          element={ <EmployeeIncome/>}
        />
  <Route
          path="EmployeeDeduction"
          element={ <EmployeeDeduction/>}
        />          
  <Route
          path="ClassMessage"
          element={ <ClassMessage/>}
        />
  <Route
          path="Shift"
          element={ <Shift/>}
        />
  <Route
          path="Classfees"
          element={ <Classfees/>}
        />



       { /*<Route path="/Profile" element={user?<Profile Profileinfo={user} />:<Navigate to="/login" />} />
        <Route path="/Setting" element={<Setting/>} />*/}
      </Routes>
    </div>
  </Router>

  
  );
}

export default App;
