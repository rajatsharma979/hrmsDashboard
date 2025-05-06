import React, { useState } from "react";

import "./candidateForm.css";

const LeaveData = ({ onClose, onSuccess, employeeList }) => {

  const [empId, setEmpId] = useState("");
  const [fName, setFname] = useState("");
  const [designation, setDesignation] = useState("");
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveDoc, setLeaveDoc] = useState(null);
  const [errors, setErrors] = useState({});

  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
    const handleChange = (e) => {
      const value = e.target.value;
      setFname(value);
  
      if (value.trim() === "") {
        setFilteredSuggestions([]);
        setShowSuggestions(false);
        return;
      }
  
      const filtered = employeeList.filter(emp =>
        emp.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    };
  
    const handleSelect = (emp) => {
      setFname(emp.name);
      setDesignation(emp.position)
      setEmpId(emp._id);
      setShowSuggestions(false);
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!empId){
        setErrors({ fName: "Please select a valid person" });
        return;
    }

    if (!leaveDoc) {
      setErrors({ leavedoc: "Please select a PDF file" });
      return;
    }

    if(!fName){
        setErrors({ fName: "Name cannot be empty" });
      return;
    }

    if(!designation){
        setErrors({ designation: "Designation cannot be empty" });
      return;
    }

    if(!leaveReason){
        setErrors({ leaveReason: "Reason cannot be empty" });
      return;
    }

    if(!leaveDate){
        setErrors({ leaveDate: "LeaveDate cannot be empty" });
      return;
    }

    const formData = new FormData();
    formData.append("empId", empId);
    formData.append("name", fName);
    formData.append("leaveReason", leaveReason);
    formData.append("designation", designation);
    formData.append("leaveDate", leaveDate);
    formData.append("leaveDoc", leaveDoc);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/addEmployeeLeave`, {
        method: 'POST',
            credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const allErrors = {};
        for (let err of data.msg) {
          allErrors[err.path] = err.msg;
        }
        setErrors(allErrors);
     
        console.log("Validation errors:", data.msg);
      } else {
       
        setFname("");
        setLeaveDate("");
        setLeaveReason("");
        setLeaveDoc(null)
        setDesignation("");
        setErrors({});

        onClose();
        onSuccess();

        console.log("Leave added successfully");
   

      }
    } catch (err) {
      console.error("Server error", err);
      setErrors({ general: "An error occurred. Please try again." });
    }
  };


  return (
    <div>
      <h2>Add Leave</h2>
      <form type="multipart" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="fields">

        <div>
        <input
        type="text"
        value={fName}
        onChange={handleChange}
        placeholder="Type employee name"
        required
        // style={{ width: "100%", padding: "8px" }}
        />
        {errors.fName && <p className="error">{errors.fName}</p>}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: "4px",
            border: "1px solid rgb(255, 135, 241)",
            borderTop: "none",
            position: "absolute",
            width: "38%",
            backgroundColor: "white",
            zIndex: 10,
            maxHeight: "150px",
            overflowY: "auto"
          }}
        >
          {filteredSuggestions.map(emp => (
            <li
              key={emp._id}
              onClick={() => handleSelect(emp)}
              style={{ padding: "6px", cursor: "pointer" }}
            >
              {emp.name}
            </li>
          ))}
        </ul>
      )}

          </div>
          <div>
          <input
            type="text"
            name="designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="Designation"
            required
          />
          {errors.designation && <p className="error">{errors.designation}</p>}
          </div>
        </div>

        <div className="fields">
            <div>
          <input
            type="text"
            name="leaveReason"
            value={leaveReason}
            onChange={(e) => setLeaveReason(e.target.value)}
            placeholder="Reason"
            required
          />
          {errors.leaveReason && <p className="error">{errors.leaveReason}</p>}
          </div>

          <div>
          <input
            type="date"
            name="leaveDate"
            value={leaveDate}
            placeholder="yyyy-mm-dd"
            required
            onChange={(e) => setLeaveDate(e.target.value)}
          />
          {errors.leaveDate && <p className="error">{errors.leaveDate}</p>}
          </div>
        </div>

        <div className="fields">

          <div>
          <input
            type="file"
            name="leaveDoc"
            accept="application/pdf"
            required
            onChange={(e) => setLeaveDoc(e.target.files[0])}
          />
          {errors.leaveDoc && <p className="error">{errors.leaveDoc}</p>}
          </div>
        </div>
        
        <div className="btn">
        <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default LeaveData;
