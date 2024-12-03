import express from 'express';
import { activateUser, deleteUser, getAllUsers, loginUser, logoutUser, registrationUser, socialAuth, updateAccessToken, updateUserPassword, updateUserProfilePicture, updateUserRole, getUserInfo, updateUserInfo } from '../controllers/userController';
import { isAutheticated, isAuthorizedRole } from '../middleware/auth';

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activateUser", activateUser);
userRouter.post("/login", loginUser)
userRouter.get("/logout", isAutheticated, isAuthorizedRole("User"),  logoutUser);

userRouter.get("/refreshtoken", updateAccessToken);
userRouter.get("/getuserInfo", updateAccessToken, isAutheticated, getUserInfo);
userRouter.post("/socialAuth", socialAuth)

userRouter.put("/updateUserInfo",updateAccessToken, isAutheticated ,updateUserInfo);
userRouter.put("/updateUserPassword", updateAccessToken ,isAutheticated ,updateUserPassword);
userRouter.put("/updateUserAvatar",updateAccessToken,  isAutheticated ,updateUserProfilePicture);

userRouter.get("/getAllUser",updateAccessToken, isAutheticated, isAuthorizedRole("Admin"),  getAllUsers);
userRouter.put("/updateUserRole",updateAccessToken, isAutheticated, isAuthorizedRole("Admin"), updateUserRole);

userRouter.delete("/deleteUser/:id",updateAccessToken, isAutheticated, isAuthorizedRole("Admin"), deleteUser);





export default userRouter;

