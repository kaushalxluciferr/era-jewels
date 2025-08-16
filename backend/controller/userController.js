import validator from 'validator';
import userModel from "../model/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exUser = await userModel.findOne({ email });
    if (!exUser) return res.status(404).json({ success: false, message: "Email not found" });

    const match = await bcrypt.compare(password, exUser.password);
    if (!match) return res.status(400).json({ success: false, message: "Invalid password" });

    const token = createToken(exUser._id);
    return res.json({ success: true, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exUser = await userModel.findOne({ email });
    if (exUser) return res.status(400).json({ success: false, message: "User already exists" });

    if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Invalid email" });
    if (password.length < 8) return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();

    const token = createToken(newUser._id);
    return res.json({ success: true, token, user: newUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
