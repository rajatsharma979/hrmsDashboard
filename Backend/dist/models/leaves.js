import mongoose from "mongoose";
import employees from "./employees.js";
const leavesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    leaveStatus: {
        type: String,
        default: "Pending"
    },
    leaveReason: {
        type: String,
        required: true
    },
    leaveDate: {
        type: Date,
        require: true
    },
    leaveDoc: {
        type: String,
        required: true
    },
    empId: {
        type: mongoose.Schema.ObjectId,
        refrences: employees
    }
});
export default mongoose.model('Leaves', leavesSchema);
