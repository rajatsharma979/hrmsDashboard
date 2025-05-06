import { Document } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

export type hrSignup = {
    name: string,
    email: string,
    password: string
}

export type hrLogin = {
    email: string,
    password: string
}

export interface savedhr extends Document{
    name: string,
    email: string,
    password: string
}

export interface accessTokenData extends JwtPayload{
    id: string,
    name: string,
    email: string
}