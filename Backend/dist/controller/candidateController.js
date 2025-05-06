var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { validationResult } from "express-validator";
import path from "path";
import { fileURLToPath } from "url";
import Candidates from "../models/candidates.js";
import Employee from "../models/employees.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getCandidates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const candidates = yield Candidates.find({});
        res.status(200).json({ msg: candidates });
        return;
    }
    catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
});
const postCandidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const name = body.name;
        const email = body.email;
        const mobile = +body.mobile;
        const position = body.position;
        const experience = +body.experience;
        console.log(name, email, mobile);
        const resume = `/resumes/${req.file.filename}`;
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            res.status(401).json({ msg: validationErrors.array() });
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
        });
        yield newCandidate.save();
        res.status(201).json({ msg: "Candidate saved successfully" });
        return;
    }
    catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
});
const getResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resumePath = req.query.resumePath;
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
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});
const updateCandidateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const candId = req.params.id;
        const newStatus = req.body.status;
        console.log(candId, newStatus);
        const updatedUser = yield Candidates.findByIdAndUpdate(candId, { status: newStatus }, { new: true });
        const date = new Date().toISOString().split('T')[0];
        if (newStatus === "Selected") {
            const employee = new Employee({
                name: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.name,
                email: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.email,
                mobile: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.mobile,
                position: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.position,
                department: "Pending...",
                joiningDate: date
            });
            yield employee.save();
        }
        res.status(200).json({ msg: "Candidates status updated successfully" });
        return;
    }
    catch (error) {
        res.status(500).json({ msg: "Internal server error" });
        return;
    }
});
export default {
    getCandidates,
    postCandidate,
    getResume,
    updateCandidateStatus
};
