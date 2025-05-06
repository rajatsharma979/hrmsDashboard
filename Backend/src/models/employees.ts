import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({

    profile:{
        type: String,
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    mobile:{
        type: Number,
        required: true
    },
    position:{
        type: String,
        required: true
    },
    department:{
        type: String,
        required: true
    },
    joiningDate:{
        type: Date,
        required: true
    },
    task:{
        type: String,
        default: "Null"
    },
    attendance:{
        type: String,
        default: "Present"
    },
    leaveReason:{
        type: String
    },
    leaveStatus:{
        type: String,
        default: "Pending"
    },
    leaveDate:{
        type: Date
    },
    leaveDocs:{
        type: String
    }
})

export default mongoose.model("Employees", employeeSchema);