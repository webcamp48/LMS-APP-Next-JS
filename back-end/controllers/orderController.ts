import { NextFunction, Request, Response } from "express";
import path from "path";
import ejs from 'ejs';

import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from './../utils/ErrorHandler';
import User from "../models/userModel";
import Course from "../models/courseModel";
import { newOrder } from "../services/LMS_Services/order.Services";
import sendMail from './../services/email/sendMail';
import Notification from "../models/notificationModel";
import Order, { IOrder } from "../models/orderModel";


// create user order
export const createOrder = CatchAsyncErrors(async (req:Request, res : Response, next: NextFunction) => {
    try {
        const {courseId, payment_Info} = req.body as IOrder;

        // first check if user already purchased this course
        const user = await User.findById(req.user?._id);
        const courseExistInUser = user?.courses.some((course: any) => course._id.toString() === courseId);
        if(courseExistInUser){
            return next(new ErrorHandler('You have already Purchased this course', 400));
        }

        // Check if course exists
        const course = await Course.findById(courseId) as any;
        if(!course){
            return next(new ErrorHandler('Course not found', 404));
        }


        const mailData = {
            order: {
                _id: course._id.toString().slice(0,7) || 'N/A',
                name: course.name || 'N/A',
                userName: user?.name || "Guest",
                price: course.price || 0,
                date: new Date().toLocaleDateString('en-US', {year:'numeric', month: 'long', day:"numeric"})
            }
        }


        // send mail to user
        const html = await ejs.renderFile(path.join(__dirname, '../services/email/order-confirmation.ejs'), mailData);

        if(user){
            sendMail({
                email : user.email,
                subject: 'Order Confirmation',
                template: html,
                data: mailData,
            }).catch((error:any)=> {
                return next(new ErrorHandler(error.message, 500));
            })
        }

        // Add course to user and save
        user?.courses.push(course?._id);
        await user?.save();


        // send a notification to admin 
        await Notification.create({
            user: user?._id,
            title: "New Order Recived",
            message: `User ${user?.name} has purchased ${course?.name} course`,
        });

        
        // update purchased course 
        // course.purchased ? course.purchased += 1: course.purchased;
        course.purchased = (course.purchased || 0) + 1; 
        await course.save();

        const data:any = {
            courseId: course._id,
            userId: user?._id,
            payment_Info,
        };

        // now create new order
        newOrder(data, res, next);
        

    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// get all Order --- only for admin
export const getAllOrders = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction) => {
    try {
      const orders = await Order.find().sort({createdAt: -1});
      res.status(201).json({success: true, orders});
    } catch (error:any) {
      return  next(new ErrorHandler(error.message, 400));
    }
  }); 