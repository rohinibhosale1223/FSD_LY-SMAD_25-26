const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

// Import database
const database = require('./config/database');

// Import middleware
const { globalErrorHandler, notFoundHandler } = require('./config/middleware');

// Import route modules
const homeRoutes = require('./routes/home');
const aboutRoutes = require('./routes/about');
const contactRoutes = require('./routes/contact');
const cartRoutes = require('./routes/cart');
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: 'learning-platform-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Flash messages
app.use(flash());

// Global variables for templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', homeRoutes);
app.use('/about', aboutRoutes);
app.use('/contact', contactRoutes);
app.use('/cart', cartRoutes);
app.use('/auth', authRoutes);
app.use('/courses', coursesRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Online Learning Platform server is running on http://localhost:${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
});