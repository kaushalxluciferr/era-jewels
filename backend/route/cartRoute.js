import express from "express";
import { addtoCart, getUser, updateCart } from "../controller/cartController.js";
import { userAuth } from "../middleware/userAUth.js";

const cartRouter = express.Router();

cartRouter.post("/add", userAuth, addtoCart);
cartRouter.post("/get", userAuth, getUser);
cartRouter.post("/update", userAuth, updateCart);

export default cartRouter;
