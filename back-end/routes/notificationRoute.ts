import express from 'express';
import { isAutheticated, isAuthorizedRole } from '../middleware/auth';
import { getAllNotifications, updateNotifications } from '../controllers/notificationController';
import { updateAccessToken } from '../controllers/userController';
const notificationRouter = express.Router();

notificationRouter.get("/get-all-notification",updateAccessToken, isAutheticated, isAuthorizedRole("Admin") ,getAllNotifications);
notificationRouter.put("/update-status-notification/:id",updateAccessToken, isAutheticated, isAuthorizedRole("Admin") ,updateNotifications);

export default notificationRouter;