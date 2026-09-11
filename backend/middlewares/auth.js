import jwt from 'jsonwebtoken';
import db from '../db/db.js';

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStructuredResponse(401, 'Access token missing', null);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.sendStructuredResponse(403, 'Invalid or expired token', null);
    }
};

export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.sendStructuredResponse(
                403,
                `Access denied. Required role(s): ${roles.join(', ')}`,
                null
            );
        }
        next();
    };
};
