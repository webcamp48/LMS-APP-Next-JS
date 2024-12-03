import mongoose from "mongoose";
require("dotenv").config();

const dbURL:string = process.env.DB_URL || "";

export const connectDB = async () => {
    try {
        await mongoose.connect(dbURL).then((data: any) => {
            console.log(`Database Connected with ${data.connection.host}`);
        })
    } catch (error:any) {
        console.log(error.message);
    }
}

