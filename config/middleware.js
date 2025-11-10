// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.session.returnTo = req.originalUrl;
        req.flash('error_msg', 'Please log in to access this page');
        res.redirect('/auth/login');
    }
};

// Redirect if already logged in
const redirectIfLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        req.flash('error_msg', 'Access denied. Admin privileges required.');
        res.redirect('/');
    }
};

// Sanitize user input
const sanitizeInput = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Format date
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Generate random ID
const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};

// Validate email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate password strength
const isStrongPassword = (password) => {
    // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
};

// Error handler for async routes
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Global error handler
const globalErrorHandler = (err, req, res, next) => {
    console.error('Global error:', err);
    
    // Database errors
    if (err.code === 'SQLITE_CONSTRAINT') {
        req.flash('error_msg', 'Data constraint violation. Please check your input.');
        return res.redirect('back');
    }
    
    // Validation errors
    if (err.name === 'ValidationError') {
        req.flash('error_msg', 'Please correct the validation errors and try again.');
        return res.redirect('back');
    }
    
    // Default error
    if (req.xhr) {
        res.status(500).json({ error: 'Internal server error' });
    } else {
        res.status(500).render('error', {
            title: '500 - Server Error',
            message: 'Something went wrong on our end.'
        });
    }
};

// 404 handler
const notFoundHandler = (req, res) => {
    res.status(404).render('404', {
        title: '404 - Page Not Found',
        message: 'The page you are looking for does not exist.'
    });
};

module.exports = {
    requireAuth,
    redirectIfLoggedIn,
    requireAdmin,
    sanitizeInput,
    formatCurrency,
    formatDate,
    generateId,
    isValidEmail,
    isStrongPassword,
    asyncHandler,
    globalErrorHandler,
    notFoundHandler
};