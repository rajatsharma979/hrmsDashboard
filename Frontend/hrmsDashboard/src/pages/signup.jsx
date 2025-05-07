import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./signup.css";
import BtnSpinner from "../components/btnSpinner";

const signup = ({ onSignupSuccess })=>{

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCpassword] = useState("");
    const [errors, setErrors] = useState({});

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e)=>{

        e.preventDefault();

        if (password !== cPassword) {
            setErrors({cpwd: "Passwords do not match"});
            return;
        }

        const formData = {
            name: name,
            email: email,
            password: password
        }
        setErrors({});

        setSubmitting(true);

        fetch(`${import.meta.env.VITE_BACKEND_URL}/signup`,{
            method: 'POST',
            credentials: 'include',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(async (response)=>{
            const data = await response.json();
            if(!response.ok){
                const allErrors = {};
                for(let err of data.msg){
                    allErrors[err.path] = err.msg;
                }
                console.log("all errors", allErrors);
                setSubmitting(false);
                setErrors(allErrors);
                console.log("errors while siging", data.msg);
            } else {

                setName("");
                setEmail("");
                setPassword("");
                setCpassword("");
                setErrors([]);

                console.log("signed up successsfully");
                setSubmitting(false);
                onSignupSuccess(); 
            }
        })
        .catch(err=>{
            setErrors(["something went wrong. Please try again later"]);
            setSubmitting(false);
            console.log("error in signup", err);
        })
    }

    return(
        <div className="signup">
            <div className="mainBox">
                <h3>Register</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                    <label id="name">Full Name*</label>
                    <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required></input>
                    {errors.name && <p className="error">{errors.name}</p>}
                    </div>
                    <div>
                    <label id="email">Email Address*</label>
                    <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required></input>
                    {errors.email && <p className="error">{errors.email}</p>}
                    </div>
                    <div>
                    <label id="pwd">Password*</label>
                    <input type="password" id="pwd" name="password" value={password}  onChange={(e) => setPassword(e.target.value)} placeholder="Password" required></input>
                    {errors.password && <p className="error">{errors.password}</p>}
                    </div>
                    <div>
                    <label id="cpwd">Confirm Password*</label>
                    <input type="password" id="cpwd" name="cPassword" value={cPassword} onChange={(e) => setCpassword(e.target.value)} placeholder="Confirm Password" required></input>
                    {errors.cpwd && <p className="error">{errors.cpwd}</p>}
                    </div>
                    <button type="submit">
            {submitting ? (
              <BtnSpinner />
            ) : (
              "Register"
            )}
          </button>
                </form>
            </div>
        </div>
    );

}

export default signup;