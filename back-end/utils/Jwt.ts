require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/userModel";
import { redis } from "./redis";

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly?: boolean;
    sameSite: 'lax' | 'strict' | 'none' | undefined;
    secure?: boolean;
}


    // parse envirnment varible to integrate with fallback value
    const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300', 10)
    const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200', 10);



    // options for cookies
    export const accessTokenOption : ITokenOptions = {
        expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
        maxAge: accessTokenExpire * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
    }

   export const refreshTokenOption : ITokenOptions = {
        expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
        maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
    }


export const sendToken = (user:IUser, statusCode: number, res:Response ) => {

    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    // upload session to radis
    redis.set(user?._id.toString(), JSON.stringify(user), (err) => {
        if (err) {
            console.error('Failed to set session in Redis:', err);
        }
    });



    // only set secure to true in producation
    if(process.env.NODE_ENV === 'production'){
        accessTokenOption.secure = true;
        refreshTokenOption.secure = true;
    } 

    res.cookie("access_Token", accessToken, accessTokenOption);
    res.cookie("refresh_Token", refreshToken, refreshTokenOption);

    res.status(statusCode).json({success: true, user, accessToken})

}