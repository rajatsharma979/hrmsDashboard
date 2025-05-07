import React, { useState, useEffect } from "react";

import FormModal from "./formModal";
import TaskAssign from "./taskAssignForm";
import Loader from "./loader";

const attendance = ()=>{

    const [filterStatus, setFilterStatus] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const [employees, setEmployees] = useState([]);
        const [error, setError] = useState(null);
    
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
                alert("Error getting employees");
            }
        };

        useEffect(() => {
                fetchEmployees();
            }, []);

            const handleStatusChange = async (id, newStatus) => {
                try {
        
                    console.log("in status change");
                    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/updateEmployeeAttendance/${id}`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                      body: JSON.stringify({ status: newStatus }),
                    });
                
                    if (!res.ok) throw new Error("Failed to update status");
                
                    setEmployees((prev) =>
                      prev.map((c) =>
                        c._id === id ? { ...c, attendance: newStatus } : c
                      )
                    );
                  } catch (err) {
                    console.error(err);
                    alert("Error updating attendance");
                    
                  }
              };
    

    const filteredEmployeesByStatus = filterStatus ? employees.filter(emp => emp.attendance.toLowerCase() === filterStatus.toLowerCase()) : employees;
    
        const filteredEmployees = searchQuery ? 
            filteredEmployeesByStatus.filter(emp=>
                emp.name.toLowerCase().includes(searchQuery.toLowerCase())||
                emp.position.toLowerCase().includes(searchQuery.toLowerCase())||
                emp.department.toLowerCase().includes(searchQuery.toLowerCase())||
                emp.task.toLowerCase().includes(searchQuery.toLowerCase())
            ) : filteredEmployeesByStatus;

            if (loading) return <Loader />;
    return(
        <div>
            <h3>Attendance</h3>
            <div className="filtersParent">
                <div className="filterSubParent">
                    <div className="filters">
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="">Status</option>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
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
                    <div className=" subfield position">Position</div>
                    <div className="subfield experience">Department</div>
                    <div className="subfield task">Task</div>
                    <div className="subfield status">Status</div>
                    <div className="subfield action">Action</div>
                </div>
                {filteredEmployees.length > 0 && filteredEmployees.map(employee => (
                    <div className="data" key={employee._id}>
                        <div className=" subfield srnumber">{employee.profile || ""}</div>
                        <div className=" subfield name">{employee.name}</div>
                        <div className=" subfield position">{employee.position}</div>
                        <div className="subfield experience">{employee.department}</div>
                        <div className="subfield task">{employee.task || ""}</div>
                        <div className="subfield status">
                                <select className="org" value={employee.attendance} onChange={(e) => handleStatusChange(employee._id, e.target.value)}>
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                </select>
                        </div>
                        <div className="subfield action">
                            <div className="main-box">...</div>
                            <div className="hover-options">
                                <div className="hover-option" onClick={() => setShowForm(true)}>Assign Task</div>
                                {showForm && (
                                <FormModal onClose={() => setShowForm(false)}>
                                    <TaskAssign onClose={() => setShowForm(false)} onSuccess={fetchEmployees} id={employee._id}/>
                                </FormModal>
                            )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default attendance;