import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./signup.css";
import BtnSpinner from "../components/btnSpinner";

const login = ()=>{

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e)=>{

        e.preventDefault();

        const formData = {
            email: email,
            password: password
        }
        setErrors({});

        setSubmitting(true);

        fetch(`${import.meta.env.VITE_BACKEND_URL}/login`,{
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
                setErrors({msg: data.msg});
                setSubmitting(false);
                console.log("errors while login", data.msg);
                navigate('/');
            } else {

                setEmail("");
                setPassword("");
                setErrors({});

                console.log("logged in successsfully");
                setSubmitting(false);
                navigate('/dashboard');
            }
        })
        .catch(err=>{
            setErrors(["something went wrong. Please try again later"]);
            setSubmitting(false);
            console.log("error in login", err);
        })
    }

    return(
        <div className="signup">
            <div className="mainBox">
                <h3>Login</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                    <label id="email">Email Address</label>
                    <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required></input>
                    </div>
                    <div>
                    <label id="pwd">Password</label>
                    <input type="password" id="pwd" name="password" value={password}  onChange={(e) => setPassword(e.target.value)} placeholder="Password" required></input>
                    {errors.msg && <p className="error">{errors.msg}</p>}
                    </div>
                    <button type="submit">
            {submitting ? (
              <BtnSpinner />
            ) : (
              "Login"
            )}
          </button>
                </form>
            </div>
        </div>
    );

}

export default login;