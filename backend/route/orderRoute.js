import express from "express";
import { placeOrderCOD, allAdminOrder, allUserOrder, updateStatus } from "../controller/orderController.js";
import { userAuth } from "../middleware/userAUth.js";
import {adminAuth} from "../middleware/adminAuth.js";

const orderRouter = express.Router();

// Admin routes
orderRouter.post("/list", adminAuth, allAdminOrder);
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.post("/details", adminAuth, getOrderDetails);
// User routes (COD only)
orderRouter.post("/place", userAuth, placeOrderCOD);
orderRouter.post("/userorders", userAuth, allUserOrder);

export default orderRouter;
