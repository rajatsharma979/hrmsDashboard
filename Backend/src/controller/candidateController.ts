import { Request, Response } from "express";
import { validationResult } from "express-validator";
import path from "path";
import { fileURLToPath } from "url";

import Candidates from "../models/candidates.js";
import {candidate} from "../types/candidateType.js";
import Employee from "../models/employees.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getCandidates = async(req: Request, res: Response)=>{

    try{
        const candidates = await Candidates.find({});



        res.status(200).json({msg: candidates});
        return;
    }
    catch(error){
        res.status(500).json({msg: "Internal server error"});
    }
}

const postCandidate = async (req: Request, res: Response)=>{

    const body = req.body as candidate;

    try{

        const name = body.name;
        const email = body.email;
        const mobile = +body.mobile;
        const position = body.position;
        const experience = +body.experience;

        console.log(name, email, mobile);

        const resume = `/resumes/${req.file!.filename}`;

        const validationErrors = validationResult(req);

        if(!validationErrors.isEmpty()){
            res.status(401).json({msg: validationErrors.array()});
            return;
        }

        const newCandidate = new Candidates({
            name: name,
            email: email,
            mobile: mobile,
            position: position,
            experience: experience,
            status: 'New',
            resume: resume
        })

        await newCandidate.save();

        res.status(201).json({msg: "Candidate saved successfully"});
        return;
    }
    catch(error){
        res.status(500).json({msg: "Internal server error"});
    }
}

const getResume = async(req: Request, res: Response)=>{

    try{
        const resumePath = req.query.resumePath as string;

        console.log(resumePath);

        console.log("dirname", __dirname);
        const filePath = path.join(__dirname, '../', '../', resumePath);

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

const updateCandidateStatus = async(req: Request, res: Response)=>{

    try{
        const candId = req.params.id;
        const newStatus = req.body.status;

        console.log(candId, newStatus);

        const updatedUser = await Candidates.findByIdAndUpdate(candId, {status: newStatus}, {new: true});

        const date = new Date().toISOString().split('T')[0];

        if(newStatus === "Selected"){
            const employee = new Employee({
                name: updatedUser?.name,
                email: updatedUser?.email,
                mobile: updatedUser?.mobile,
                position: updatedUser?.position,
                department: "Pending...",
                joiningDate: date
            });

            await employee.save();
        }

        res.status(200).json({msg: "Candidates status updated successfully"});
        return;
    }
    catch(error){
        res.status(500).json({msg: "Internal server error"});
        return;
    }
}


export default{
    getCandidates,
    postCandidate,
    getResume,
    updateCandidateStatus
}