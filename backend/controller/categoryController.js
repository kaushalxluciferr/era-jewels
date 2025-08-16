import Category from "../model/category.js";

export const addCategory = async (req, res) => {
  try {
    const { category } = req.body;
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }

    const existingCate = await Category.findOne({ category });
    if (existingCate) {
      return res.status(400).json({
        success: false,
        message: "Category already exists"
      });
    }

    const newCategory = new Category({ category });
    await newCategory.save();

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory
    });

  } catch (error) {
    console.error('Add category error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });

  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};