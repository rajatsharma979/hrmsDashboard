import { Router } from "express";
import authController from "../controller/authController.js";
import validateHrData from "../public/validatingHrData.js";
const router = Router();
router.post('/login', validateHrData.validateLoginData, authController.postLogin);
router.post('/signup', validateHrData.validateSignupData, authController.postSignup);
router.get('/logout', authController.logout);
export default router;
