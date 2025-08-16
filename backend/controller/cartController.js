import userModel from "../model/user.js";

// Add to cart
export const addtoCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData;

    cartData[itemId] = (cartData[itemId] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });
    return res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get user cart
export const getUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    return res.json({ success: true, cartData: user.cartData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update cart item
export const updateCart = async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData;

    cartData[itemId] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });
    return res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
