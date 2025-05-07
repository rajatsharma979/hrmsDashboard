import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";

import LeaveForm from "./leaveForm";
import FormModal from "./formModal";
import 'react-calendar/dist/Calendar.css';
import Loader from "./loader";

import "./leaves.css";

const Leaves = ()=>{

    const [searchQuery, setSearchQuery] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [presentEmployees, setPresentEmployees] = useState([]);
    const [filterStatus, setFilterStatus] = useState("");
    const [leaveDates, setLeaveDates] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    const fetchEmployees = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getLeaves`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
    
                if (!response.ok) {
                    console.log(response);
                    setLoading(false);
                }
    
                const data = await response.json();
                console.log("all emp", data.msg);
                
                

                let approvedLeaves = [];

                for(let emp of data.msg){
                    if(emp.leaveStatus === "Approved"){
                        approvedLeaves.push(new Date(emp.leaveDate).toLocaleDateString('en-CA'));
                    }   
                }

                setLeaveDates(approvedLeaves);

                setEmployees(data.msg);
                setLoading(false);

                console.log("leaves", leaveDates);

            } catch (err) {
                setError(err.message);
                setLoading(false);
                alert("Error getting leaves");
            }
        };

    const fetchPresentEmployees = async()=>{

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getEmployees`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                console.log(response);
                setLoading(false);
            }

            const data = await response.json();
            console.log("all emp", data.msg);

            const emps = data.msg;

            const femps = emps.filter(emp => emp.attendance.toLowerCase() === "present");
            
            setPresentEmployees(femps);
            setLoading(false);

        } catch (err) {
            setError(err.message);
            alert("Error fetching employees");
        }
    }
    
        useEffect(() => {
                fetchEmployees();
                fetchPresentEmployees();
            }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {

            console.log("in status change");

            setEmployees((prev) =>
                prev.map((c) =>
                  c._id === id ? { ...c, status: newStatus } : c
                )
            );

            for(let emp of employees){
                if(emp.leaveStatus === "Approved"){
                    approvedLeaves.push(new Date(emp.leaveDate).toLocaleDateString('en-CA'));
                }   
            }

            setLeaveDates(approvedLeaves);

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/updateEmployeeLeaveStatus/${id}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ leaveStatus: newStatus }),
            });
        
            if (!res.ok) throw new Error("Failed to update status");
            //fetchEmployees();

          } catch (err) {
            console.error(err);
            setLoading(false);
            alert("Error updating leave status");
          }
      };

      const filteredEmployeesByLeave = searchQuery ? 
        employees.filter
        (emp=> 
            (emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.leaveReason.toLowerCase().includes(searchQuery.toLowerCase()) || 
            emp.leaveDate.toString().includes(searchQuery))
        ) : employees;
        
    const filteredEmployees = filterStatus ? filteredEmployeesByLeave.filter(emp => emp.leaveStatus.toLowerCase() === filterStatus.toLowerCase()) : filteredEmployeesByLeave;

    const downloadLeaveDocs = async (leavePath) => {

        console.log("inside leaveDoc");

        const url = `${import.meta.env.VITE_BACKEND_URL}/downloadLeaveDoc?leaveDocPath=${encodeURIComponent(leavePath)}`;

        const link = document.createElement('a');
        link.href = url;
        link.download = '';
        link.click();
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
          const dateString = date.toLocaleDateString('en-CA');
          if (leaveDates.includes(dateString)) {
            console.log("true");
            return 'leave-date';
          }
        }

        if (view === 'month') {
            const today = new Date();
            if (date < today.setHours(0, 0, 0, 0)) {
              return 'past-date';
            }
        }
        return null;
      };

      if (loading) return <Loader />;

    return(
        
        <div>
                <h3>Leaves</h3>
                <div className="filtersParent">
                    <div className="filterSubParent">
                        <div className="filters">
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="">Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                    <div className="filterSubParent">
                        <div>
                            <input className="newsearch" type="text"  name="search" value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)} placeholder="Search Employees"></input>
                        </div>
                        <div className="addCandidateBox">
                            <div className="addCandidate" onClick={() => setShowForm(true)}>Add Leave</div>
                            {showForm && (
                                <FormModal onClose={() => setShowForm(false)}>
                                    <LeaveForm onClose={() => setShowForm(false)} onSuccess={fetchEmployees} employeeList={presentEmployees}/>
                                </FormModal>
                            )}
                        </div>
                    </div>
                </div>

                <div className="cal">
                <div className="allContent cont">
                    <div className="subjects">
                        <div className=" subfield leaves srnumber">Profile</div>
                        <div className=" subfield leaves name">Name</div>
                        <div className="subfield leaves date">Date</div>
                        <div className="subfield leaves reason">Reason</div>
                        <div className="subfield leaves status">Status</div>
                        <div className="subfield leaves action">Docs</div>
                    </div>
                    {filteredEmployees.length > 0 && filteredEmployees.map((employee) => (
                        <div className="data" key={employee._id}>
                            <div className=" subfield leaves srnumber">{employee.profile || ""}</div>
                            <div className=" subfield leaves  name">{employee.name}</div>
                            <div className="subfield  leaves date">{employee.leaveDate.split('T')[0]}</div>
                            <div className=" subfield leaves reason">{employee.leaveReason}</div>
                            <div className="subfield leaves status">
                                <select className="org" value={employee.leaveStatus} onChange={(e) => handleStatusChange(employee.empId, e.target.value)}>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="subfield leaves action" onClick={() => downloadLeaveDocs(employee.leaveDoc)}>...</div>
                        </div>
                    ))}
                </div >
                <div className="calendar">
                    <div className="upcal"></div>
                    <div className="mainCal"><Calendar tileClassName={tileClassName} /></div>
                </div>
                </div>
            </div>
    );
}

export default Leaves;