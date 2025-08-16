import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);