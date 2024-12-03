require("dotenv").config();
import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { EXPIRES_TOKEN_IN_MIN } from "../constants/constant-varible";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// User Interface
export interface IUser extends Document{
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    avatar?: { public_id: string; url: string;},
    role?: string;
    isVerified?: boolean;
    courses: Array<{courseId: string}>;
    comparePassword :(password: string) => Promise<boolean>

    SignAccessToken : () => string;
    SignRefreshToken : () => string;
}

// userSchema
const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {type: String, trim: true, required: [true, 'Please Enter Your Name']},
    email: {type: String, trim: true, required: [true, "Please Enter Your Email"],
        validate: {
            validator: function (value: string) {
                return emailRegexPattern.test(value);
            },
            message: 'Please Enter Valid Email'
        },
        unique: true,
        lowercase : true,
    },
    password : {
        type: String, 
        require:[true, "Please Enter Your Password"],
        minlength: [8, "Password must be at least 8 characters"],
        select: false,
        trim: true
    },
    avatar: {public_id: String, url: String },
    role: {type: String, default: "User"},
    isVerified: {type: Boolean, default:false},
    courses: [
        {courseId : String}
    ],
}, {timestamps: true});


// hashing password before saving in Database
userSchema.pre<IUser>('save', async function(next)  {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


// Sign Access Token
userSchema.methods.SignAccessToken = function() {
    return JWT.sign({id : this._id}, process.env.ACCESS_TOKEN || "", {
        expiresIn : EXPIRES_TOKEN_IN_MIN
    })
}

//sign Refresh Token
userSchema.methods.SignRefreshToken = function() {
    return JWT.sign({id : this._id}, process.env.REFRESH_TOKEN || "" , {
        expiresIn : "2d"
    })
}


// compare user password and database password
userSchema.methods.comparePassword = async function(enterPassword: string) : Promise<boolean>{
    return await bcrypt.compare(enterPassword, this.password);
}


const User = mongoose.model<IUser>('User', userSchema);

export default User;