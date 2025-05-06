import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import candidateController from "../controller/candidateController.js";
import validateCandidateData from "../public/validatingCandidateData.js";
import isAuthenticated from "../public/authentication.js";
const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resumeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../', 'resumes');
        console.log(uploadPath);
        cb(null, 'resumes');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});
const resumeUpload = multer({ storage: resumeStorage, fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDFs are allowed!'));
        }
    } }).single('resume');
router.get('/getCandidates', isAuthenticated, candidateController.getCandidates);
router.post('/postCandidate', isAuthenticated, resumeUpload, validateCandidateData, candidateController.postCandidate);
router.get('/downloadResume', isAuthenticated, candidateController.getResume);
router.post('/updateCandidateStatus/:id', isAuthenticated, candidateController.updateCandidateStatus);
export default router;
