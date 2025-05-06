var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { body } from "express-validator";
import Hr from "../models/hr.js";
const validateSignupData = [
    body("name").trim().notEmpty().withMessage("Name cannot be empty"),
    body("email").trim().notEmpty().withMessage("Email cannot be empty").isEmail().withMessage("Enter valid email address").normalizeEmail()
        .custom((value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, {}) {
        const hr = yield Hr.findOne({ email: value });
        if (hr) {
            throw new Error("Email already exists");
        }
    })),
    body("password").trim().notEmpty()
        .withMessage("password cannot be empty")
        .isLength({ min: 6 })
        .withMessage('Password should be of minimum 6 characters')
];
const validateLoginData = [
    body("email").trim().notEmpty().withMessage("Email cannot be empty"),
    body("password").trim().notEmpty().withMessage("Password cannot be empty")
];
export default {
    validateLoginData,
    validateSignupData
};
