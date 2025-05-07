import react from "react";
import { RiseLoader } from "react-spinners";

const Loader = () => {

    return (
        <div>
            <RiseLoader
                color="rgb(255, 135, 241)"
                size={15}
            />;
        </div>
    );
}

export default Loader;