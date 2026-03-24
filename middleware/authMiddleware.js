const jwt = require('jsonwebtoken');
const User = require('../models/auth');

exports.authenticateUser = async (req, res, next) => {
    let token = req.header('Authorization') || req.headers.authorization || req.get('Authorization') || req.get('authorization');
    
    // Debug log for troubleshooting (user will see this in console)
    // console.log("Incoming Authorization Header:", token);

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Handle Bearer prefix if present
    if (token.toLowerCase().startsWith('bearer ')) {
        token = token.slice(7).trim();
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ message: 'User not found, authorization denied' });
        }
        next();
    } catch (error) {
        console.error("Token validation error:", error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admin only' });
    }
};
