import react from "react";
import { PulseLoader } from "react-spinners";

import "./loader.css";

const BtnSpinner = () => {

    return (
        <div className="loader btnSpinner">
            <div>
                <PulseLoader
                    color="#ffffff"
                    size={7}
                />
            </div>
        </div>
    );
}

export default BtnSpinner;