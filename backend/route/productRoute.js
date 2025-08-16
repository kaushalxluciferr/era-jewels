import express from "express";
import { upload } from "../middleware/multer.js"; // use your shared multer config
import {addProduct,
  listProduct,
  removeProduct,
  singleProduct,
} from "../controller/productController.js";

const productRouter = express.Router();

// Routes
productRouter.post("/add", upload.single("image"), addProduct);
productRouter.get("/list", listProduct);
productRouter.post("/remove", removeProduct);
productRouter.post("/single", singleProduct);

export default productRouter
