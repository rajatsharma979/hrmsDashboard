import React,{ useState } from "react";

const taskAssign = ({ onClose, onSuccess, id })=>{

    const [task, setTask] = useState("");
    const [loading, setLoading] = useState(true);

    const handleSubmit = async (e)=>{

        e.preventDefault();

        try{

            console.log(task);

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/assignTask/${id}`,{
                method: "PATCH",
                credentials: "include",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({task: task})
            });
    
            if(!res.ok){
                setLoading(false);
                throw new Error("error in assigning task");
            }else{
                setTask("");
                onClose();
                onSuccess();
                setLoading(false);
            }  
        }
        catch(error){
            alert("Error assigning task");
            console.log("Error assigning task");
            setLoading(false);
        } 
    }

    return(
        <div>
            <h2>Assign Task</h2>
            <form className="taskForm" onSubmit={handleSubmit}>
          <input
          className="task"
            type="text"
            name="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Assign Task"
          />
        <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default taskAssign;