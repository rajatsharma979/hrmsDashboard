import express from "express";
import { accessTokenData } from "./authTypes";

declare global{
    namespace Express{
        interface Request{
            user: accessTokenData
        }
    }
}