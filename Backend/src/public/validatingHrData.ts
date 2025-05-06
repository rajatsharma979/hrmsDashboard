import { body } from "express-validator";
import Hr from "../models/hr.js";

const validateSignupData = [

    body("name").trim().notEmpty().withMessage("Name cannot be empty"),
    body("email").trim().notEmpty().withMessage("Email cannot be empty").isEmail().withMessage("Enter valid email address").normalizeEmail()
    .custom(async (value: string, {})=>{

        const hr = await Hr.findOne({email: value});

        if(hr){
            throw new Error("Email already exists");
        }
    }),
    body("password").trim().notEmpty()
    .withMessage("password cannot be empty")
    .isLength({min: 6})
    .withMessage('Password should be of minimum 6 characters')
]

const validateLoginData = [

    body("email").trim().notEmpty().withMessage("Email cannot be empty"),
    body("password").trim().notEmpty().withMessage("Password cannot be empty")
]

export default {
    validateLoginData,
    validateSignupData
}