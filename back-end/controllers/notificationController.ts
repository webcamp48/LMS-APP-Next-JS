import cron from 'node-cron'
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import { NextFunction, Request, Response } from 'express';
import ErrorHandler from "../utils/ErrorHandler";
import Notification from "../models/notificationModel";


// get all notification -- only for admin
export const getAllNotifications = CatchAsyncErrors(async (req:Request, res:Response, next:NextFunction) => {
    try {
        const notifications = await Notification.find().sort({createdAt : -1});
        res.status(200).json({success: true, notifications});
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500))
    }
});


// update status notification -- only for admin
export const updateNotifications = CatchAsyncErrors(async (req:Request, res:Response, next:NextFunction) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if(!notification) {
            return next(new ErrorHandler('Notification not found', 404))
        }else{
            notification.status ? notification.status = 'read' : notification.status;
        }

        await notification.save();

        const notifications = await Notification.find().sort({createdAt: -1})
        res.status(200).json({success: true, notifications});

    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500))
    }
});



// delete last 30 days notification ---- only admin
cron.schedule("0 0 0 * * *", async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await Notification.deleteMany({status: "read", createdAt: {$lt: thirtyDaysAgo}});
    console.log("last 30 days ago read notification delete.")
})