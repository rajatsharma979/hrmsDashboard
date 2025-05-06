var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { check } from "express-validator";
import Candidates from "../models/candidates.js";
const validateCandidateData = [
    check("name").trim().notEmpty().withMessage("Name cannot be empty"),
    check("email").trim().notEmpty().withMessage("Email cannot be empty").isEmail().withMessage("Enter valid email address").normalizeEmail()
        .custom((value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, {}) {
        const candidate = yield Candidates.findOne({ email: value });
        if (candidate) {
            throw new Error("Email already exists");
        }
    })),
    check('mobile').trim().notEmpty().withMessage("Mobile no. can't be empty").isNumeric()
        .withMessage("Mobile number must contain only digits"),
    check('position').trim().notEmpty().withMessage("Position can't be empty"),
    check('experience').trim().notEmpty().withMessage("Experience can't be empty").isNumeric()
        .withMessage("Experience must contain digits must contain only digits")
];
export default validateCandidateData;
