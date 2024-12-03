require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import path from "path";
import ejs from "ejs";
import JWT, { JwtPayload } from 'jsonwebtoken';
import cloudinary from 'cloudinary';

import User, { IUser } from "../models/userModel";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import sendMail from "../services/email/sendMail";
import { generateOtp } from "../utils/generateOtp";
import { createToken } from "../utils/token";
import { EXPIRES_TOKEN_IN_MIN, ADMIN_EMAIL, EXPIRE_AFTER_7_DAYS } from "../constants/constant-varible";
import { accessTokenOption, refreshTokenOption, sendToken } from "../utils/Jwt";
import { redis } from "../utils/redis";
import { getUserById } from "../services/LMS_Services/user.Services";


//Registration User Interface
interface userRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}


// Registration User handler
export const registrationUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    // Create new user
    const user : userRegistrationBody = ({
      name,
      email,
      password,
    });

    // Generate OTP (Activation Code)
    const emailOtp = generateOtp();

    // Create Token including activationOtp
    const token = createToken(user, emailOtp);

    // Prepare email ejs data
    const data = { user: { name: user.name }, emailOtp, EXPIRES_TOKEN_IN_MIN, ADMIN_EMAIL };

    // Render email template
    const emailTemplate = await ejs.renderFile(path.join(__dirname, "../services/email/activation-mail.ejs"), data);

    // Send activation email asynchronously (background task)
    sendMail({
        email: user.email,
        subject: "Activate Your Account",
        template: emailTemplate,
        data,
      }).catch((error: any) => {
        return next(new ErrorHandler(error.message, 400));
      });

  
      // Return response without waiting for email to send
      res.status(200).json({
        success: true,
        message: `Activation mail sent to your email ${user.email}`,
        token,
      });
  
    
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});


// =================================================================
// =================================================================

// activate user through OTP and token
interface IActivationRequest {
  activation_otp : string;
  activation_token : string;
}


export const activateUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { activation_otp, activation_token } = req.body as IActivationRequest;

    // Verify JWT to retrieve user and OTP
    const decoded : {user: IUser; activationOtp : string} = JWT.verify(
      activation_token,
      process.env.TOKEN_SECRET as string
    ) as { user: IUser; activationOtp: string };

    // Compare provided OTP with the user token's OTP
    if (decoded.activationOtp !== activation_otp) {
      return next(new ErrorHandler("Invalid activation OTP", 400));
    }

    const { name, email, password } = decoded.user;
    const existUser = await User.findOne({ email });

    if (existUser) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    // now Create and save the user after enter otp
    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(200).json({
      success: true,
      message: `Account Activated Successfully`,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});


// =================================================================
// =================================================================

// login User interface 
interface ILoginRequest {
  email: string;
  password: string;
}

// login User Handler 
export const loginUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {email, password} = req.body as ILoginRequest;
    if(!email || !password){
      return next(new ErrorHandler("Please Enter Email and Password", 400));
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
      return next(new ErrorHandler("Invalid Email or Password", 400));
    }
  
    const isMatchPassword = await user.comparePassword(password);
    if(!isMatchPassword){
      return next(new ErrorHandler("Incorrect Password", 400));
    }
    // send token
    sendToken(user, 200, res);
    
  } catch (error : any) {
    return next(new ErrorHandler(error.message, 400))
  }
})


// =================================================================
// =================================================================

// logout User
export const logoutUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Clear cookies
    res.cookie("access_Token", "", {maxAge: 1});
    res.cookie("refresh_Token", "", {maxAge: 1});

    // res.clearCookie("access_Token");
    // res.clearCookie("refresh_Token");

    const userId = req.user?._id.toString() || "";

    // Delete user session from Redis
    redis.del(userId, (err) => {
      if (err) {
        console.log("Failed to delete session from Redis:", err);
        return res.status(500).json({ success: false, message: "Failed to logout, try again" });
      }
      res.status(200).json({ success: true, message: "Logged out successfully" });
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});


// =================================================================
// =================================================================

// update access token
export const updateAccessToken = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refresh__Token = req.cookies?.refresh_Token as string;
    const decoded = JWT.verify(refresh__Token, process.env.REFRESH_TOKEN as string) as JwtPayload;

    if(!decoded){
      return next(new ErrorHandler("Could not find Refresh Token", 400))
    }
    const session = await redis.get(decoded.id as string);
    if(!session){
      return next(new ErrorHandler("Please login to access this resource", 400));
    }
    const user = JSON.parse(session);

    const accessToken = JWT.sign({id: user._id}, process.env.ACCESS_TOKEN as string, {
      expiresIn: "5m",
    });
    const refreshToken = JWT.sign({id: user._id}, process.env.REFRESH_TOKEN as string, {
      expiresIn: "2d",
    });

    req.user = user;

    res.cookie("access_Token", accessToken, accessTokenOption);
    res.cookie("refresh_Token", refreshToken, refreshTokenOption);

    // IF USER ACTIVE/login then redis update otherwaise redis session logout after 7 days if user not visit website within 7 days
    await redis.set(user._id, JSON.stringify(user), 'EX', EXPIRE_AFTER_7_DAYS) // 7DAYS

    // res.status(200).json({success: true, accessToken});
    next();

  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400))
  }
})


// =================================================================
// =================================================================

// GET User Info
export const getUserInfo = CatchAsyncErrors(async (req: Request, res: Response, next:NextFunction)=>{
  try {
    const userId  = req.user?._id;

    if (typeof userId === "string") {
      getUserById(userId, res);
    } else {
      return next(new ErrorHandler("User ID is not valid", 400));
    }
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
})

// =================================================================
// =================================================================

// User Social Auth Interface
interface ISocialAuthBody {
  name : string,
  email: string,
  avatar : string
}

// User Social Auth
export const socialAuth = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {name, email, avatar} = req.body as ISocialAuthBody;
    const user = await User.findOne({email});
    if (!user) {
      const newUser = await User.create({name, email, avatar});
      sendToken(newUser, 200, res);
    }else{
      sendToken(user, 200, res);
    }

  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400))
  }
});


// =================================================================
// =================================================================

// update User info interface
interface IUpdateUserInfo{
  name ?: string,
}


// update User info Name
export const updateUserInfo = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {name} = req.body as IUpdateUserInfo;
    const userId = req.user?._id;
    const user = await User.findById(userId);

    if(name && user) {
      user.name = name;
    }
    await user?.save();

    if(typeof userId === 'string'){
      await redis.set(userId, JSON.stringify(user));
    }else {
      return next(new ErrorHandler("User ID is not valid", 400));
    }

    res.status(201).json({success: true, message : "Profile Name Updated Successfully!", user});

  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400))
  }
});


// =================================================================
// =================================================================

// update user password Interface
interface IUpdateUserPassword {
  oldPassword: string;
  newPassword: string;
}

// update user password handler
export const updateUserPassword = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction)=> {
  try {
    const {oldPassword, newPassword} = req.body as IUpdateUserPassword;
    const userId = req.user?._id;
    const user = await User.findById(userId).select("+password");

    if(!oldPassword || !newPassword){
      return next(new ErrorHandler("Please provide both old and new password", 400));
    }

    if(user?.password === undefined){
      return next(new ErrorHandler("Password is not set", 400))
    }

    const isPasswordMatch = await user.comparePassword(oldPassword);
    if(!isPasswordMatch){
      return next(new ErrorHandler("Old password is not correct", 400));
    }

    user.password = newPassword;
    await user.save();
    // also set in redis database
    if(typeof userId === 'string'){
      redis.set(userId, JSON.stringify(user));
    }
    res.status(200).json({success: true, message: "Password Successfully Updated!",  user });
  } catch (error : any) {
    return next(new ErrorHandler(error.message, 400));
  }
});


// =================================================================
// =================================================================

// update User Profile Picture Interface
interface IUpdateUserProfilePicture {
  avatar: string;

}
// update User Profile Picture handler
export const updateUserProfilePicture = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{
  try {
    const {avatar} = req.body as IUpdateUserProfilePicture;
    const userId = req.user?._id;
    const user = await User.findById(userId);

    if(avatar && user){
      // if user have one avatar then call this
      if(user?.avatar?.public_id){
        // first delete the old image
        await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(avatar,{
          folder: "avatars",
          width: 150,
          resource_type: "image",
        });
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        }

      }else{
        const myCloud = await cloudinary.v2.uploader.upload(avatar,{
          folder: "avatars",
          width: 150,
          resource_type: "image",
        });
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        }
      }
    }
    await user?.save();
    // also set in redis database
    if(typeof userId === 'string'){
      await redis.set(userId, JSON.stringify(user));
    }
    res.status(200).json({success: true, message: "Profile picture updated successfully", user});
  } catch (error : any) {
    return next(new ErrorHandler(error.message, 400));
  }
});



// get all Users -- only for admin
export const getAllUsers = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction) => {
  try {
    const users = await User.find().sort({createdAt: -1});
    res.status(201).json({success: true, users});
  } catch (error:any) {
    return  next(new ErrorHandler(error.message, 400));
  }
}); 



// update User role -- only for admin
export const updateUserRole = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction) => {
  try {
    const {id, role} = req.body;
    const userExists = await User.findById(id);
    if(!userExists) {
      return next(new ErrorHandler('User not found', 404));
    }
    const user = await User.findByIdAndUpdate(id, {role}, {new: true});
    res.status(200).json({success: true, user, message: `${role} role updated successfully`})
  } catch (error:any) {
    return next(new ErrorHandler(error.message, 500));
  }
});


// delete user  -- only for admin
export const deleteUser = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction) => {
  try {
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user) {
      return next(new ErrorHandler('User not found', 404));
    }
    // delete user from redis and mongoose db
    await user.deleteOne({id});
    await redis.del(id);

    res.status(200).json({success: true, message: 'User deleted successfully'});
  } catch (error:any) {
    return next(new ErrorHandler(error.message, 500))
  }
})