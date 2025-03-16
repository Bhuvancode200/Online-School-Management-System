import React from "react";
import { Link } from "react-router-dom";
import './Assets/Sidebar.css';
import { FaHome, FaUser, FaCog } from 'react-icons/fa';  // Import FontAwesome icons
import { MdSettings } from 'react-icons/md'; 
import { CgProfile } from "react-icons/cg";
import { IoMdSettings } from "react-icons/io";



const Sidebar=()=>{


    return(
<div className="Sidebar-menu">

        <div className="sidebar-header">
            <h2>
                
            </h2>

            <nav>

<ul>

<li>

<Link to="/Profile" className="menu-item">
<FaHome size={20} color="#fff" style={{ marginRight: "10px" }} />   
    Home
</Link>

    </li>


    <li>

<Link to="/Profile" className="menu-item">
<CgProfile size={20} color="#fff" style={{ marginRight: "10px" }} />   
    Profile
</Link>

    </li>


    {/* <li>

<Link to="/Student" className="menu-item">
<IoMdSettings size={20} color="#fff" style={{ marginRight: "10px" }} /> 
Student</Link>

    </li>
    <li>

<Link to="/Graphwise" className="menu-item">
<IoMdSettings size={20} color="#fff" style={{ marginRight: "10px" }} /> 
Graphwise</Link>

    </li> */}


    <li>

<Link to="/Class" className="menu-item">
<IoMdSettings size={20} color="#fff" style={{ marginRight: "10px" }} /> 
Class</Link>

    </li>

{/* <li>

    <Link to="/Subject" className="menu-item">
<IoMdSettings size={20} color="#fff" style={{ marginRight: "10px" }} /> 
Subject</Link>

    </li> */}

    <li>

    <Link to="/Location" className="menu-item">
<IoMdSettings size={20} color="#fff" style={{ marginRight: "10px" }} /> 
Location</Link>

    </li>
    <li>

{/* <Link to="/Assessment" className="menu-item">
<IoMdSettings size={20} color="#fff" style={{ marginRight: "10px" }} /> 
Assessment</Link> */}

    </li>
    <li>

<Link to="/FeeParticulars" className="menu-item">
<IoMdSettings size={20} color="#fff" style={{ marginRight: "10px" }} /> 
Fee Particulars</Link>

    </li>
    
    <li>

<Link to="/Department" className="menu-item">
<IoMdSettings size={20} color="#fff" style={{ marginRight: "10px" }} /> 
Department</Link>

    </li>
    <li>

<Link to="/EmployeeType" className="menu-item">
<IoMdSettings size={20} color="#fff" style={{ marginRight: "10px" }} /> 
EmployeeType</Link>

    </li>
    <li>

<Link to="/EmployeeIncome" className="menu-item">
<IoMdSettings size={20} color="#fff" style={{ marginRight: "10px" }} /> 
Employee Income</Link>

    </li>
    <li>

<Link to="/EmployeeDeduction" className="menu-item">
<IoMdSettings size={20} color="#fff" style={{ marginRight: "10px" }} /> 
Employee Deduction</Link>

    </li>
    {/* <li>

<Link to="/ClassMessage" className="menu-item">
<IoMdSettings size={20} color="#fff" style={{ marginRight: "10px" }} /> 
ClassMessage</Link>

    </li> */}
    <li>

<Link to="/Shift" className="menu-item">
<IoMdSettings size={20} color="#fff" style={{ marginRight: "10px" }} /> 
Shift</Link>

    </li>
    {/* <li>

<Link to="/Classfees" className="menu-item">
<IoMdSettings size={20} color="#fff" style={{ marginRight: "10px" }} /> 
Classfees</Link>

    </li> */}
    
    
    
</ul>


            </nav>

        </div>

</div>


    );

}

export default Sidebar;

