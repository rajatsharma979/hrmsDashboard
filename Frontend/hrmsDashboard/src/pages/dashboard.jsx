import react, { useState } from "react";

import "./dashboard.css";
import Candidate from "../components/candidate";
import Employee from "../components/employee";
import Attendance from "../components/attendence";
import Leave from "../components/leaves";

const dashboard = () => {

    const [activeComponent, setActiveComponent] = useState("candidates");

    const logout = async ()=>{

        try{

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if(res.ok){
                navigate('/');
            }
        }
        catch(error){
            alert("Error logging out");
        }
    }

  const renderComponent = () => {

    if(activeComponent === "candidates"){
        return <Candidate />;
    }
    else if(activeComponent === "employees"){
        return <Employee />;
    }
    else if(activeComponent === "attendance"){
        return <Attendance />
    }
    else if(activeComponent === "leaves"){
        return <Leave />
    }
}

    return (
        <div className="main">
            <div className="sidePannel">
                <div className="searchField">
                    <input className="search" type="text" name="search" placeholder="search"></input>
                </div>
                <div className="headings">
                    Recruitment
                    <div className={`fields ${activeComponent === "candidates" ? "active" : ""}`} onClick={() => setActiveComponent("candidates")}>Candidates</div>
                </div>
                <div className="headings">
                    Organisation
                    <div className={`fields ${activeComponent === "employees" ? "active" : ""}`} onClick={() => setActiveComponent("employees")}>Employees</div>
                    <div className={`fields ${activeComponent === "attendance" ? "active" : ""}`} onClick={() => setActiveComponent("attendance")}>Attendance</div>
                    <div className={`fields ${activeComponent === "leaves" ? "active" : ""}`} onClick={() => setActiveComponent("leaves")}>Leaves</div>
                </div>
                <div className="headings">
                    Others
                    <div className="fields" onClick={logout}>Logout</div>
                </div>
            </div>
            <div className="contentPannel">
                {renderComponent()}
            </div>
        </div>
    );
}

export default dashboard;