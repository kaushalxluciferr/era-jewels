import { v2 as cloudinary } from 'cloudinary';
import productModel from '../model/productModel.js';

// Add a new product (single image)
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, bestseller } = req.body;

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Image is required" 
      });
    }

    // Cloudinary already uploaded the file, we just get the URL
    const imageUrl = req.file.path;

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      bestseller: bestseller === 'true',
      image: [imageUrl], // Using Cloudinary URL directly
    };

    const product = new productModel(productData);
    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product
    });
  } catch (error) {
    console.error('Add product error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// List all products
export const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    return res.json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Remove product
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Product ID is required" 
      });
    }

    const product = await productModel.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    // Delete image from Cloudinary if needed
    if (product.image && product.image.length > 0) {
      const publicId = product.image[0].split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    return res.status(200).json({ 
      success: true, 
      message: "Product deleted successfully" 
    });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to delete product' 
    });
  }
};
// Single product
export const singleProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await productModel.findById(id);
    return res.json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
