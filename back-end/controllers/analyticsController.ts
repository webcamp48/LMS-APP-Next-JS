import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { generateLast12MonthData } from "../utils/adminAnalytics.generator";

import User from "../models/userModel";
import Course from "../models/courseModel";
import Order from "../models/orderModel";

// get user analytics __ only for admin
export const getUserAnalytics = CatchAsyncErrors(async(req:Request, res:Response, next: NextFunction)=> {
    try {
        const users = await generateLast12MonthData(User);
        res.status(200).json({success: true, users});
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500))
    }
});

// get courses analytics __ only for admin
export const getCourseAnalytics = CatchAsyncErrors(async(req:Request, res:Response, next: NextFunction)=> {
    try {
        const courses = await generateLast12MonthData(Course);
        res.status(200).json({success: true, courses});
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500))
    }
});


// get orders analytics __ only for admin
export const getOrderAnalytics = CatchAsyncErrors(async(req:Request, res:Response, next: NextFunction)=> {
    try {
        const orders = await generateLast12MonthData(Order);
        res.status(200).json({success: true, orders});
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500))
    }
});

