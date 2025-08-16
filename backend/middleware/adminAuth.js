import jwt from 'jsonwebtoken';

export const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Here you could add additional admin verification if needed
    // For example, check if the user has admin role
    
    req.user = decoded;
    next();

  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource'
    });
  }
};