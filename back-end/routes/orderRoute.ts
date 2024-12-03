import express from 'express';
import { isAutheticated, isAuthorizedRole } from '../middleware/auth';
import { createOrder, getAllOrders } from '../controllers/orderController';
import { updateAccessToken } from './../controllers/userController';
const orderRouter = express.Router();

orderRouter.post("/createOrder" , isAutheticated, createOrder);
orderRouter.get("/getAllOrder", updateAccessToken, isAutheticated, isAuthorizedRole("Admin"), getAllOrders);


export default orderRouter;
