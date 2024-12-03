import express from "express";
import { isAutheticated, isAuthorizedRole } from "../middleware/auth";
import { getCourseAnalytics, getUserAnalytics } from "../controllers/analyticsController";
import { getOrderAnalytics } from './../controllers/analyticsController';
import { updateAccessToken } from "../controllers/userController";
const analyticsRouter = express.Router();

analyticsRouter.get('/get-users-analytics',updateAccessToken,  isAutheticated, isAuthorizedRole('Admin'), getUserAnalytics);

analyticsRouter.get('/get-courses-analytics',updateAccessToken , isAutheticated, isAuthorizedRole('Admin'), getCourseAnalytics);

analyticsRouter.get('/get-orders-analytics', updateAccessToken,  isAutheticated, isAuthorizedRole('Admin'), getOrderAnalytics);

export default analyticsRouter;