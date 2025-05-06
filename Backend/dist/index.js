import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookiesParser from "cookie-parser";
dotenv.config();
import authRoutes from "./routes/authRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const corsOptions = {
    origin: process.env.Frontend_Url,
    credentials: true,
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
};
//app.options('/{*splat}', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookiesParser());
app.use('/resumes', express.static(path.join(__dirname, '../', 'thumbnails')));
app.use(authRoutes);
app.use(candidateRoutes);
app.use(employeeRoutes);
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
    app.listen(process.env.PORT || 8080, () => {
        console.log("Connected and listening...");
    });
});
