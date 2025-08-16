import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/mongodb.js";
import { ConnectCloudinary } from "./config/cloudinary.js";

import userRouter from "./route/userRoute.js";
import cartRouter from "./route/cartRoute.js";
import categoryRouter from "./route/categoryRoute.js";
import orderRouter from "./route/orderRoute.js";
import productRouter from "./route/productROute.js";

// app config
const app = express();
connectDB();
ConnectCloudinary();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/category", categoryRouter);
app.use("/api/order", orderRouter);

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// start server
app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));
