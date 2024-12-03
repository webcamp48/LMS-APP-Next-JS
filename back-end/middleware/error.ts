import { NextFunction,Request, Response } from 'express';
import ErrorHandler from '../utils/ErrorHandler';

export const ErrorMiddleware = (error : any, req: Request, res: Response, next:NextFunction) => {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || 'Server Error';
    
    // wrong mongodb error
    if (error.name === 'CastError') {
        const message = `Resource not found. Invalid ${error.path}`;
        error = new ErrorHandler(message, 400);
    }

    // duplicate key error
    if(error.code === 1100){
        const message = `Duplicate ${Object.keys(error.keyValue)}  entered`;
        error = new ErrorHandler(message, 400);
    }

    // wrong jwt token error
    if (error.name === 'JsonWebTokenError') {
        const message = 'Json Web Token is Invalid, Try Again';
        error = new ErrorHandler(message, 401);
    }

    // wrong jwt token expire error
    if (error.name === 'TokenExpiredError') {
        const message = 'Json Web Token is Expired, Try Again';
        error = new ErrorHandler(message, 401);
    }


    res.status(error.statusCode).json({
        success: false,
        message: error.message,
    })


}