import React, { useState, useEffect } from "react";

import "./employee.css";
import "../pages/dashboard.css";
import EmployeeForm from "./employeeForm";
import FormModal from "./formModal";

const getEmployees = () => {

    const [filterPosition, setFilterPosition] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);

    const handleUpdateEmployee = (updatedEmployee) => {
        setEmployees((prev) =>
            prev.map((emp) =>
                emp._id === updatedEmployee.id ? { ...emp, ...updatedEmployee } : emp
            )
        );
    };

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getEmployees`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                setLoading(false);
                console.log(response);
            }

            const data = await response.json();
            console.log("all emp", data.msg);
            
            setEmployees(data.msg);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
            alert("Error fetching employees");
        }
    };

    useEffect(() => {
            fetchEmployees();
        }, []);

        const filteredEmployeesByPosition = filterPosition ? employees.filter(emp => emp.position.toLowerCase() === filterPosition.toLowerCase()) : employees;
    
        const filteredEmployees = searchQuery ? 
            filteredEmployeesByPosition.filter(emp=>
                emp.name.toLowerCase().includes(searchQuery.toLowerCase())||
                emp.email.toLowerCase().includes(searchQuery.toLowerCase())||
                emp.position.toLowerCase().includes(searchQuery.toLowerCase())||
                emp.department.toLowerCase().includes(searchQuery.toLowerCase())||
                emp.mobile.toString().includes(searchQuery.toLowerCase())
            ) : filteredEmployeesByPosition;

        const handleDelete = async(id)=>{

            try{
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/deleteEmployee/${id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
    
                if(!res.ok){
                    throw new Error("Failed to delete");
                    setLoading(false);
                }
                fetchEmployees();

                console.log("deleted successfully");
            }
            catch(error){
                console.log("Error while deleting employee", error);
                setLoading(false);
                alert("Error deleting employing");
            }

        }

        if (loading) return <div className="loading">Loading candidates...</div>;
        
    return (

        <div>
            <h3>Employees</h3>
            <div className="filtersParent">
                <div className="filterSubParent">
                    <div className="filters">
                        <select value={filterPosition} onChange={(e) => setFilterPosition(e.target.value)}>
                            <option value="">Position</option>
                            <option value="Intern">Intern</option>
                            <option value="FullTime">Full Time</option>
                            <option value="Junior">Junior</option>
                            <option value="Senior">Senior</option>
                            <option value="TeamLead">Team Lead</option>
                        </select>
                    </div>
                </div>
                <div className="filterSubParent">
                    <div>
                        <input className="newsearch" type="text" name="search" value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)} placeholder="Search employees"></input>
                    </div>
                </div>
            </div>

            <div className="allContent">
                <div className="subjects">
                    <div className=" subfield srnumber">Profile</div>
                    <div className=" subfield name">Employee Name</div>
                    <div className="subfield email">Email Address</div>
                    <div className="subfield mobile">Phone Number</div>
                    <div className=" subfield position">Position</div>
                    <div className="subfield status">Department</div>
                    <div className="subfield experience">Date Of Joining</div>
                    <div className="subfield action">Action</div>
                </div>
                {filteredEmployees.length > 0 && filteredEmployees.map(employee => (
                    <div className="data" key={employee._id}>
                        <div className=" subfield srnumber">{employee.profile || ""}</div>
                        <div className=" subfield name">{employee.name}</div>
                        <div className="subfield email">{employee.email}</div>
                        <div className="subfield mobile">{employee.mobile}</div>
                        <div className=" subfield position">{employee.position}</div>
                        <div className="subfield status">{employee.department}</div>
                        <div className="subfield experience">{employee.joiningDate.split('T')[0]}</div>
                        <div className="subfield action">
                            <div className="main-box">...</div>
                            <div className="hover-options">
                                <div className="hover-option" onClick={() => setShowForm(true)}>Edit</div>
                                {showForm && (
                                <FormModal onClose={() => setShowForm(false)}>
                                    <EmployeeForm onClose={() => setShowForm(false)} onSuccess={handleUpdateEmployee} employee={{ 
                                        id: employee._id, 
                                        name: employee.name, 
                                        email: employee.email,
                                        department: employee.department,
                                        mobile: employee.mobile,
                                        position: employee.position,
                                        joiningDate: employee.joiningDate.split('T')[0]
                                    }}/>
                                </FormModal>
                            )}
                                <div className="hover-option" onClick={() => handleDelete(employee._id)}>Delete</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default getEmployees;