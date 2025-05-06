var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { validationResult } from "express-validator";
import Hr from "../models/hr.js";
const generateToken = (hr) => {
    const accessToken = jsonwebtoken.sign({
        id: hr._id,
        name: hr.name,
        enail: hr.email
    }, process.env.JSON_WEB_TOKEN_SECRET, { expiresIn: Number(process.env.JWT_Access_Token_Expiry) });
    return accessToken;
};
const postLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const email = body.email;
        const password = body.password;
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            res.status(400).json({ msg: validationErrors.array() });
            return;
        }
        const hr = yield Hr.findOne({ email: email });
        if (!hr) {
            res.status(401).json({ msg: "Invalid email or password" });
            return;
        }
        const isMatch = yield bcrypt.compare(password, hr.password);
        if (!isMatch) {
            res.status(401).json({ msg: "Invalid email or password" });
            return;
        }
        const accessToken = generateToken(hr);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: Number(process.env.Cookie_expiry)
        });
        res.status(200).json({ msg: "LoggedIn Successfully" });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});
const postSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const name = body.name;
        const email = body.email;
        const password = body.password;
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            console.log(validationErrors.array());
            res.status(400).json({ msg: validationErrors.array() });
            return;
        }
        const pwd = yield bcrypt.hash(password, 12);
        const newHr = new Hr({
            name: name,
            email: email,
            password: pwd
        });
        yield newHr.save();
        res.status(200).json({ msg: "Registered Successfully" });
        return;
    }
    catch (error) {
        res.status(500).json({ msg: "Internal server error" });
        return;
    }
});
const logout = (req, res) => {
    try {
        if (!req.cookies.accessToken) {
            res.status(400).json({ msg: "invalid token" });
            return;
        }
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({ msg: "logout successful" });
        return;
    }
    catch (error) {
        res.status(500).json({ msg: "Internsl server error" });
        return;
    }
};
export default {
    postLogin,
    postSignup,
    logout
};
