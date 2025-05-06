import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./candidateForm.css";

const CandidateData = ({ onClose, onSuccess }) => {
  const [fName, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [position, setPosition] = useState("");
  const [experience, setExperience] = useState("");
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(true);

  const [agreed, setAgreed] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      setErrors({ resume: "Please select a PDF file" });
      return;
    }

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

    if(!experience){
        setErrors({ experience: "Experience cannot be empty" });
      return;
    }

    const formData = new FormData();
    formData.append("name", fName);
    formData.append("email", email);
    formData.append("mobile", mobile);
    formData.append("position", position);
    formData.append("experience", experience);
    formData.append("resume", resume);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/postCandidate`, {
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
        setLoading(false);
        console.log("Validation errors:", data.msg);
      } else {
       
        setFname("");
        setEmail("");
        setMobile("");
        setExperience("");
        setPosition("");
        setResume(null);
        setErrors({});

        onClose();
        onSuccess();
        setLoading(false);

        console.log("Candidate added successfully");

      }
    } catch (err) {
      console.error("Server error", err);
      setErrors({ general: "An error occurred. Please try again." });
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading candidates...</div>;

  return (
    <div>
      <h2>Add Candidate</h2>
      <form type="multipart" onSubmit={handleSubmit} encType="multipart/form-data">
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
          <input
            type="text"
            name="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Position"
          />
          {errors.position && <p className="error">{errors.position}</p>}
          </div>
        </div>

        <div className="fields">
            <div>
          <input
            type="text"
            name="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Experience"
          />
          {errors.experience && <p className="error">{errors.experience}</p>}
          </div>

          <div>
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            onChange={(e) => setResume(e.target.files[0])}
          />
          {errors.resume && <p className="error">{errors.resume}</p>}
          </div>
        </div>
          <input
            type="checkbox"
            className="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          I agree to the terms
        
        <div className="btn">
        <button type="submit" disabled={!agreed}>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CandidateData;
