require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import  JWT, { JwtPayload }  from 'jsonwebtoken';
import { redis } from "../utils/redis";

//  Autheticated user
export const isAutheticated = CatchAsyncErrors(async (req: Request, res:Response, next:NextFunction) => {
    try {
        const access_token = req.cookies?.access_Token as string || "";
        if (!access_token) {
            return next(new ErrorHandler("Please login to access this resource", 400));
        }

        // Verify JWT token
        const decoded = JWT.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;
        if (!decoded) {
            return next(new ErrorHandler("Access token is invalid", 400));
        }

        // Fetch user from Redis using decoded ID
        const user = await redis.get(decoded.id);
        if (!user) {
            return next(new ErrorHandler("Please login to access this resource", 400));
        }

        req.user = JSON.parse(user);

        next();
    } catch (error: any) {
        // Handle JWT verification errors or other issues
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return next(new ErrorHandler("Invalid or expired access token", 401));
        }
        return next(new ErrorHandler(error.message, 500));
    }
})



// validate user role
export const isAuthorizedRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role || '')) {
            return next(new ErrorHandler("You do not have permission to perform this action", 403));
        }
        next();
    }
}