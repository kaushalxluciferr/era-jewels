import express from "express";
import { 
  addCategory,
  getCategories,
  deleteCategory
} from "../controller/categoryController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const categoryRouter = express.Router();

categoryRouter.post("/add", adminAuth, addCategory);
categoryRouter.get("/", getCategories);
categoryRouter.delete("/:id", adminAuth, deleteCategory);

export default categoryRouter;