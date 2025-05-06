var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import Employee from "../models/employees.js";
import Leaves from "../models/leaves.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield Employee.find({});
        res.status(200).json({ msg: employees });
        return;
    }
    catch (error) {
        res.status(500).json({ msg: "Internal server error" });
        return;
    }
});
const editEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empId = req.body.id;
        const name = req.body.name;
        const email = req.body.email;
        const mobile = +req.body.mobile;
        const department = req.body.department;
        const position = req.body.position;
        const joiningDate = new Date(req.body.joiningDate);
        console.log("date", new Date(req.body.joiningDate));
        yield Employee.findByIdAndUpdate(empId, { name: name, email: email, mobile: mobile, department: department, position: position, joiningDate: joiningDate });
        res.status(200).json({ msg: "Employee updated successfully" });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
        return;
    }
});
const deleteEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empId = req.params.id;
        yield Employee.findByIdAndDelete(empId);
        res.status(200).json({ msg: "successfully deleted" });
        return;
    }
    catch (_a) {
        res.status(500).json({ msg: "Internal server error" });
        return;
    }
});
const updateAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empId = req.params.id;
        const attendanceStatus = req.body.status;
        yield Employee.findByIdAndUpdate(empId, { attendance: attendanceStatus });
        res.status(200).json({ msg: "Attendance updated" });
        return;
    }
    catch (error) {
        res.status(500).json({ msg: "Internal Server error" });
        return;
    }
});
const assignTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        console.log("body", req.body);
        console.log("task", req.body.task);
        const task = req.body.task;
        console.log("task", task);
        yield Employee.findByIdAndUpdate(id, { task: task });
        res.status(200).json({ msg: "Task assigned succesfully" });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
        return;
    }
});
const updateLeaveStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const leaveStatus = req.body.leaveStatus;
        console.log(id, leaveStatus);
        yield Leaves.findOneAndUpdate({ empId: new mongoose.Types.ObjectId(id) }, { $set: { leaveStatus: leaveStatus } });
        res.status(201).json({ msg: "Leave status updated successfully" });
        return;
    }
    catch (error) {
        res.status(500).json({ msg: "Internal server error" });
        return;
    }
});
const addLeave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empId = req.body.empId;
        const name = req.body.name;
        const designation = req.body.designation;
        const leaveDate = new Date(req.body.leaveDate);
        const leaveDoc = `/leaveDocs/${req.file.filename}`;
        const leaveReason = req.body.leaveReason;
        const newLeave = new Leaves({
            empId: empId,
            name: name,
            designation: designation,
            leaveDate: leaveDate,
            leaveReason: leaveReason,
            leaveDoc: leaveDoc
        });
        yield newLeave.save();
        res.status(201).json({ msg: "Leave added successfully" });
        return;
    }
    catch (error) {
        res.status(500).json({ msg: "Internal Server Error while adding leave" });
        return;
    }
});
const downloadLeaveDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leaveDocPath = req.query.leaveDocPath;
        console.log(leaveDocPath);
        console.log("dirname", __dirname);
        const filePath = path.join(__dirname, '../', '../', leaveDocPath);
        console.log("file", filePath);
        res.download(filePath, (err) => {
            if (err) {
                res.status(404).json({ error: 'File not found' });
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});
const getLeaves = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leaves = yield Leaves.find({});
        res.status(200).json({ msg: leaves });
        return;
    }
    catch (error) {
        res.status(500).json({ msg: "Internal server error" });
        return;
    }
});
export default {
    getEmployees,
    editEmployee,
    deleteEmployee,
    updateAttendance,
    assignTask,
    updateLeaveStatus,
    downloadLeaveDoc,
    addLeave,
    getLeaves
};
