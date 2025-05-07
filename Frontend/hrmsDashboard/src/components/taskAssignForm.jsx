import React,{ useState } from "react";

const taskAssign = ({ onClose, onSuccess, id })=>{

    const [task, setTask] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e)=>{

        e.preventDefault();

        try{

            console.log(task);
            setSubmitting(true);

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/assignTask/${id}`,{
                method: "POST",
                credentials: "include",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({task: task})
            });
    
            if(!res.ok){
             
                throw new Error("error in assigning task");
            }else{
                setTask("");
                onClose();
                onSuccess();
            
            }  
        }
        catch(error){
            alert("Error assigning task");
            console.log("Error assigning task");
        } finally{ 
            setSubmitting(false);
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
        <button type="submit">
            {submitting ? (
              <BtnSpinner />
            ) : (
              "Submit"
            )}
          </button>
            </form>
        </div>
    );
}

export default taskAssign;