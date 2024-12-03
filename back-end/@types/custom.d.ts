import { IUser } from "../models/userModel";
import { Request } from 'express';

export global{
    namespace Express{
        interface Request{
            user? : IUser;
        }
    }
}