import jsonwebtoken from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { accessTokenData } from "../types/authTypes";

const authenticate = (req: Request, res: Response, next: NextFunction)=>{

    try{

        const token = req.cookies.accessToken;

        if(!token){
            res.status(401).json({msg: "Access denied. Please login again."});
            return;
        }

        const tokenData = jsonwebtoken.verify(token, process.env.JSON_WEB_TOKEN_SECRET!) as accessTokenData;

        if(!tokenData){
            res.status(401).json({msg: "Access denied. Please login again."});
            return;
        }

        req.user = tokenData;
        next();
    }
    catch(error){
        res.status(401).json({msg: "Internal server error"});
    }
}

export default authenticate;