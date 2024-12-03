import { NextFunction, Response } from "express";
import { CatchAsyncErrors } from "../../middleware/catchAsyncErrors";
import Order from "../../models/orderModel";


// create order
export const newOrder = CatchAsyncErrors(async (data: any,res:Response, next:NextFunction) => {
    const order = await Order.create(data);
    res.status(201).json({success: true, order, message: 'Order created successfully'});
})
