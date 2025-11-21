const User = require('../models/User');

// Authentication middleware
const requireAuth = async (req, res, next) => {
    try {
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        // Verify user still exists and is active
        const user = await User.findById(req.session.userId).lean();
        if (!user || user.isActive === false) {
            req.session.destroy();
            return res.status(401).json({ 
                success: false, 
                message: 'User not found or inactive' 
            });
        }

        // Add user info to request object
        req.user = {
            id: String(user._id),
            username: user.username,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            is_active: user.isActive
        };
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Authentication error' 
        });
    }
};

// Optional authentication middleware (doesn't fail if not authenticated)
const optionalAuth = async (req, res, next) => {
    try {
        if (req.session && req.session.userId) {
            const user = await User.findById(req.session.userId).lean();
            if (user && user.isActive !== false) {
                req.user = {
                    id: String(user._id),
                    username: user.username,
                    email: user.email,
                    first_name: user.firstName,
                    last_name: user.lastName
                };
            }
        }
        next();
    } catch (error) {
        console.error('Optional auth middleware error:', error);
        next(); // Continue even if there's an error
    }
};

// Check if user is authenticated (for API endpoints)
const checkAuth = async (req, res, next) => {
    try {
        if (!req.session || !req.session.userId) {
            return res.json({ 
                success: false, 
                loggedIn: false,
                message: 'Not authenticated' 
            });
        }

        const user = await User.findById(req.session.userId).lean();
        if (!user || user.isActive === false) {
            req.session.destroy();
            return res.json({ 
                success: false, 
                loggedIn: false,
                message: 'User not found' 
            });
        }

        res.json({ 
            success: true, 
            loggedIn: true,
            user: {
                id: String(user._id),
                username: user.username,
                email: user.email,
                first_name: user.firstName,
                last_name: user.lastName
            }
        });
    } catch (error) {
        console.error('Check auth error:', error);
        res.status(500).json({ 
            success: false, 
            loggedIn: false,
            message: 'Authentication check failed' 
        });
    }
};

// Admin authentication middleware
const requireAdmin = async (req, res, next) => {
    try {
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        const user = await User.findById(req.session.userId).lean();
        if (!user || user.isActive === false) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ 
                success: false, 
                message: 'Admin access required' 
            });
        }

        req.user = {
            id: String(user._id),
            username: user.username,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            is_admin: user.isAdmin
        };
        next();
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Authentication error' 
        });
    }
};

module.exports = {
    requireAuth,
    optionalAuth,
    checkAuth,
    requireAdmin
};


