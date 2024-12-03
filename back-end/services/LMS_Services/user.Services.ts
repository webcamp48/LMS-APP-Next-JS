import { Response } from "express";
import { redis } from "../../utils/redis";
import User from "../../models/userModel";


export const getUserById = async (id: string, res: Response) => {
    const userJSON = await redis.get(id);
    if(userJSON){
        const user = JSON.parse(userJSON);
        res.status(201).json({success: true, user});
    }

}

