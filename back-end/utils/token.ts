import JWT from "jsonwebtoken";
import { Secret } from "jsonwebtoken";
import { EXPIRES_TOKEN_IN_MIN } from "../constants/constant-varible";


// now we save user and otp in JWT 

// Create Token Function
export const createToken = (user: any, activationOtp : string) => {
  const token = JWT.sign(
    {user, activationOtp}, process.env.TOKEN_SECRET as Secret,{ expiresIn: EXPIRES_TOKEN_IN_MIN }
  );
  return token ;
};
