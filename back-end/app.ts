require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from 'cors';
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db";
import { ErrorMiddleware } from "./middleware/error";

// routes
import userRouter from "./routes/userRoute";
import courseRouter from "./routes/courseRoute";
import orderRouter from "./routes/orderRoute";
import notificationRouter from "./routes/notificationRoute";
import analyticsRouter from "./routes/analyticsRoute";
import layoutRouter from "./routes/layoutRoute";

// body parser
app.use(express.json({ limit: '50mb' }));

// cookieParser
app.use(cookieParser());

// cors
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));

// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// mongodb Database 
connectDB();


// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/layout", layoutRouter);




// Unknown route handler
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
});

// Error handling middleware
app.use(ErrorMiddleware);