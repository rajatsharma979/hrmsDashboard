import { useNavigate, useSearchParams } from "react-router-dom";
import Signup from "./signup";
import Login from "./login";
import "./home.css";
import { useState } from "react";

const homePage = () => {

    const [isSignup, setIsSignup] = useState(true);
    return (
        <div className="parent">
            <div className="subBox">
                <div className="container">

                    <div className="advertisement">
                        <div className="image"><img src="/download.jpeg"></img></div>
                        <p className="headingContent">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis, rerum eius labore, ad assumenda quasi voluptas ullam accusamus eveniet error exercitationem rem deleniti, at animi? Beatae inventore optio doloremque recusandae.</p>
                    </div>
                    <div className="forms">
                        <div className="page">
                        {isSignup ? <Signup onSignupSuccess={() => setIsSignup(false)} /> : <Login />}
                        </div>
                        
                        <div className= "navigation" onClick={() => setIsSignup(!isSignup)}>
                            {isSignup ? "Already have an account? Log in" : "New here? Sign up"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default homePage;