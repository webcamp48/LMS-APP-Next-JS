import { NextFunction, Response } from "express";
import { CatchAsyncErrors } from "../../middleware/catchAsyncErrors";
import Course from "../../models/courseModel";

export const createCourse = CatchAsyncErrors(async (data: any, res:Response, next: NextFunction)=> {
    const course = await Course.create(data);
    console.log("data", course)
    res.status(201).json({success: true, course});
})