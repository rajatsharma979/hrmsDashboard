import { check } from "express-validator";
import Candidates from "../models/candidates.js";

const validateCandidateData = [

    check("name").trim().notEmpty().withMessage("Name cannot be empty"),
    check("email").trim().notEmpty().withMessage("Email cannot be empty").isEmail().withMessage("Enter valid email address").normalizeEmail()
    .custom(async (value: string, {})=>{

        const candidate = await Candidates.findOne({email: value});

        if(candidate){
            throw new Error("Email already exists");
        }
    }),
    check('mobile').trim().notEmpty().withMessage("Mobile no. can't be empty").isNumeric()
    .withMessage("Mobile number must contain only digits"),
    check('position').trim().notEmpty().withMessage("Position can't be empty"),
    check('experience').trim().notEmpty().withMessage("Experience can't be empty").isNumeric()
    .withMessage("Experience must contain digits must contain only digits")
]

export default validateCandidateData;
