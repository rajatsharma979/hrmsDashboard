import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import isAuthenticated from "../public/authentication.js";
import employeeController from "../controller/employeeController.js";
const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const leaveDocStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../', 'leaveDocs');
        console.log(uploadPath);
        cb(null, 'leaveDocs');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});
const leaveDocUpload = multer({ storage: leaveDocStorage, fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDFs are allowed!'));
        }
    } }).single('leaveDoc');
router.get('/getEmployees', isAuthenticated, employeeController.getEmployees);
router.post('/editEmployee', isAuthenticated, employeeController.editEmployee);
router.post('/updateEmployeeAttendance/:id', isAuthenticated, employeeController.updateAttendance);
router.post('/assignTask/:id', isAuthenticated, employeeController.assignTask);
router.post('/deleteEmployee/:id', isAuthenticated, employeeController.deleteEmployee);
router.post('/addEmployeeLeave', isAuthenticated, leaveDocUpload, employeeController.addLeave);
router.post('/updateEmployeeLeaveStatus/:id', isAuthenticated, employeeController.updateLeaveStatus);
router.get('/downloadLeaveDoc', isAuthenticated, employeeController.downloadLeaveDoc);
router.get('/getLeaves', isAuthenticated, employeeController.getLeaves);
export default router;
