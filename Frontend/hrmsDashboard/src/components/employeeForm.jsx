import React, { useState } from "react";

import "./candidateForm.css";
import BtnSpinner from './btnSpinner';

const employeeData = ({ onClose, onSuccess, employee }) => {
  const [fName, setFname] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [mobile, setMobile] = useState(employee.mobile);
  const [position, setPosition] = useState(employee.position);
  const [department, setDepartment] = useState(employee.department);
  const [joiningDate, setJoiningDate] = useState(employee.joiningDate);

  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!fName){
        setErrors({ fName: "Name cannot be empty" });
      return;
    }

    if(!email){
        setErrors({ email: "Email cannot be empty" });
      return;
    }

    if(!mobile){
        setErrors({ mobile: "Phone number cannot be empty" });
      return;
    }

    if(!position){
        setErrors({ position: "Position cannot be empty" });
      return;
    }

    if(!department){
        setErrors({ department: "Department cannot be empty" });
      return;
    }

    if(!joiningDate){
        setErrors({ joiningDate: "JoiningDate cannot be empty" });
      return;
    }

    console.log(employee);

    setSubmitting(true);

    const formData = {
        id: employee.id,
        name: fName,
        email: email,
        mobile: mobile,
        position: position,
        department: department,
        joiningDate: joiningDate
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/editEmployee`, {
        method: 'POST',
        credentials: 'include',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
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
        setEmail("");
        setMobile("");
        setDepartment("");
        setPosition("");
        setJoiningDate("");
        setErrors({});

        onClose();
        onSuccess(formData);

        console.log("Employee updated successfully");
    

      }
    } catch (err) {
      console.error("Server error", err);
      setErrors({ general: "An error occurred. Please try again." });
      alert("Error editing employee");
    } finally{
        setSubmitting(false);
    }
  };


  return (
    <div>
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="fields">
            <div>
          <input
            type="text"
            name="fName"
            value={fName}
            onChange={(e) => setFname(e.target.value)}
            placeholder="Full Name"
          />
          {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
          />
          {errors.email && <p className="error">{errors.email}</p>}
          </div>
        </div>

        <div className="fields">
            <div>
          <input
            type="text"
            name="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Phone Number"
          />
          {errors.mobile && <p className="error">{errors.mobile}</p>}
          </div>

          <div>
          <select className="positionFilter" value={position} onChange={(e) => setPosition(e.target.value)}>
                            <option value="">Position</option>
                            <option value="Intern">Intern</option>
                            <option value="FullTime">Full Time</option>
                            <option value="Junior">Junior</option>
                            <option value="Senior">Senior</option>
                            <option value="TeamLead">Team Lead</option>
                        </select>
          {errors.position && <p className="error">{errors.position}</p>}
          </div>
        </div>

        <div className="fields">
            <div>
          <input
            type="text"
            name="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Department"
          />
          {errors.experience && <p className="error">{errors.experience}</p>}
          </div>

          <div className="joiningDate">
          <input
            type="date"
            name="joiningDate"
            value={joiningDate}
            placeholder="yyyy-mm-dd"
            onChange={(e) => setJoiningDate(e.target.value)}
          />
          {errors.joiningDate && <p className="error">{errors.joiningDate}</p>}
          </div>
        </div>
        
        <div className="btn">
        <button type="submit" disabled={!agreed}>
            {submitting ? (
              <BtnSpinner />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default employeeData;
