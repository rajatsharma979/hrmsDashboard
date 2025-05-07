import react from "react";
import { RiseLoader } from "react-spinners";

import "loader.css";

const Loader = () => {

    return (
        <div className="loader">
            <RiseLoader
                color="rgb(255, 135, 241)"
                size={15}
            />;
        </div>
    );
}

export default Loader;