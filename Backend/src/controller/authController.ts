import { Request, Response } from "express";
import bcrypt, { genSalt } from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { validationResult } from "express-validator";

import Hr from "../models/hr.js";
import {hrSignup , hrLogin, savedhr} from "../types/authTypes.js";


const generateToken = (hr: savedhr) => {

    const accessToken = jsonwebtoken.sign(
        {
            id: hr._id,
            name: hr.name,
            enail: hr.email
        },
        process.env.JSON_WEB_TOKEN_SECRET!,
        { expiresIn: Number(process.env.JWT_Access_Token_Expiry) });

        return accessToken;
}

const postLogin = async (req: Request, res: Response)=>{

    const body = req.body as hrLogin;

    try{

        const email = body.email;
        const password = body.password;

        const validationErrors = validationResult(req);

        if(!validationErrors.isEmpty()){
            
            res.status(400).json({msg: validationErrors.array() });
            return;
        }

        const hr = await Hr.findOne({email: email}) as savedhr;

        if(!hr){
            res.status(401).json({msg: "Invalid email or password"});
            return;
        }

        const isMatch = await bcrypt.compare(password, hr.password);

        if(!isMatch){
            res.status(401).json({msg: "Invalid email or password"});
            return;
        }

        const accessToken = generateToken(hr);

        res.cookie("accessToken", accessToken,
            {
            httpOnly: true,
            //secure: true,
            secure: false,
            sameSite: "lax",
            maxAge: Number(process.env.Cookie_expiry)!
        })

        res.status(200).json({msg: "LoggedIn Successfully"});
        return;
    }
    catch(error){
        console.log(error);
        res.status(500).json({msg: "Internal server error"});
    }
}

const postSignup = async (req: Request, res: Response)=>{

    const body = req.body as hrSignup;

    try{

        const name = body.name;
        const email = body.email;
        const password = body.password;

        const validationErrors = validationResult(req);

        if(!validationErrors.isEmpty()){
            console.log(validationErrors.array());
            res.status(400).json({msg: validationErrors.array() });
            return;
        }

        const pwd = await bcrypt.hash(password, 12);

        const newHr = new Hr({
            name: name,
            email: email,
            password: pwd
        });

        await newHr.save();

        res.status(200).json({msg: "Registered Successfully"});
        return;

    }
    catch(error){
        res.status(500).json({msg: "Internal server error"});
        return;
    }
}

export default {
    postLogin,
    postSignup
}