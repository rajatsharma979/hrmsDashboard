import { Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import Employee from "../models/employees.js";
import Leaves from "../models/leaves.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getEmployees = async (req: Request, res: Response)=>{

    try{

        const employees = await Employee.find({});

        res.status(200).json({msg: employees});
        return;
    }
    catch(error){
        res.status(500).json({msg: "Internal server error"});
        return;
    }
}

const editEmployee = async (req: Request, res: Response)=>{

    try{

        const empId = req.body.id;
        const name = req.body.name;
        const email = req.body.email;
        const mobile = +req.body.mobile;
        const department = req.body.department;
        const position = req.body.position;
        const joiningDate = new Date(req.body.joiningDate);

        console.log("date",new Date(req.body.joiningDate));


        await Employee.findByIdAndUpdate(empId, {name: name, email: email, mobile: mobile, department: department, position: position, joiningDate:joiningDate});

        res.status(200).json({msg: "Employee updated successfully"});
        return;
    }
    catch(error){
        console.log(error);
        res.status(500).json({msg: "Internal server error"});
        return;
    }
}

const deleteEmployee = async (req: Request, res: Response)=>{

    try{
        const empId = req.params.id;

        await Employee.findByIdAndDelete(empId);

        res.status(200).json({msg: "successfully deleted"});
        return;
    }
    catch{
        res.status(500).json({msg: "Internal server error"});
        return;
    }
}

const updateAttendance = async(req: Request, res: Response)=>{

    try{

        const empId = req.params.id;
        const attendanceStatus = req.body.status;

        await Employee.findByIdAndUpdate(empId, { attendance: attendanceStatus});

        res.status(200).json({msg: "Attendance updated"});
        return;
    }
    catch(error){
        res.status(500).json({msg: "Internal Server error"});
        return;
    }
}

const assignTask = async (req: Request, res: Response)=>{

    try{
        const id = req.params.id;

        console.log("body", req.body);

        console.log("task",req.body.task);

        const task = req.body.task;

        console.log("task", task);

        await Employee.findByIdAndUpdate(id, { task: task});

        res.status(200).json({msg: "Task assigned succesfully"});
        return;
    }
    catch(error){
        console.log(error);
        res.status(500).json({msg: "Internal server error"});
        return;
    }
}

const updateLeaveStatus = async (req: Request, res: Response)=>{

    try{
        const id = req.params.id;
        const leaveStatus = req.body.leaveStatus;

        console.log(id, leaveStatus);

        await Leaves.findOneAndUpdate({empId: new mongoose.Types.ObjectId(id)}, { $set: {leaveStatus: leaveStatus}});

        res.status(201).json({msg: "Leave status updated successfully"});
        return;
    }
    catch(error){
        res.status(500).json({msg: "Internal server error"});
        return;
    }
}

const addLeave = async (req: Request, res: Response)=>{

    try{

        const empId = req.body.empId;
        const name = req.body.name;
        const designation = req.body.designation;
        const leaveDate = new Date(req.body.leaveDate);
        const leaveDoc = `/leaveDocs/${req.file!.filename}`;
        const leaveReason = req.body.leaveReason;

        const newLeave = new Leaves({
            empId: empId,
            name: name,
            designation: designation,
            leaveDate: leaveDate,
            leaveReason: leaveReason,
            leaveDoc: leaveDoc
        });

        await newLeave.save();

        res.status(201).json({msg: "Leave added successfully"});
        return;
    }
    catch(error){
        res.status(500).json({msg: "Internal Server Error while adding leave"});
        return;
    }
}

const downloadLeaveDoc = async (req: Request, res: Response)=>{

    try{
            const leaveDocPath = req.query.leaveDocPath as string;
    
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
        catch(error){
            console.log(error);
            res.status(500).json({msg: "Internal server error"});
        }
}

const getLeaves = async (req: Request, res: Response)=>{

    try{
        const leaves = await Leaves.find({});

        res.status(200).json({msg: leaves});
        return;
    }
    catch(error){
        res.status(500).json({msg: "Internal server error"});
        return;
    }
}

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
}