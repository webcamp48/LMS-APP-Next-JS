import express from 'express';
import { isAutheticated, isAuthorizedRole } from '../middleware/auth';
import { createLayout, editLayout, getLayoutByType } from '../controllers/layoutController';
import { updateAccessToken } from '../controllers/userController';
const layoutRouter = express.Router();

layoutRouter.post("/create-layout",updateAccessToken,  isAutheticated, isAuthorizedRole("Admin"),createLayout);
layoutRouter.put("/edit-layout",updateAccessToken, isAutheticated, isAuthorizedRole("Admin"), editLayout);
layoutRouter.get("/get-layout/:type", getLayoutByType);


 
export default layoutRouter;