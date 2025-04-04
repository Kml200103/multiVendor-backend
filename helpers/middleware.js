// File: middlewares/adminAuth.js
module.exports = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        console.log('req.user',req.user)
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};
