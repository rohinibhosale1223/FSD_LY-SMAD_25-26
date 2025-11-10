const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const database = require('../config/database');
const router = express.Router();

// Middleware to redirect logged-in users
const redirectIfLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
};

// Login page route
router.get('/login', redirectIfLoggedIn, (req, res) => {
    res.render('login', { 
        title: 'Login - LearnHub'
    });
});

// Registration page route
router.get('/register', redirectIfLoggedIn, (req, res) => {
    res.render('register', { 
        title: 'Register - LearnHub'
    });
});

// Handle registration form submission
router.post('/register', [
    // Validation rules
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email address'),
    body('phone')
        .optional()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Please enter a valid phone number'),
    body('dateOfBirth')
        .optional()
        .isISO8601()
        .withMessage('Please enter a valid date'),
    body('gender')
        .optional()
        .isIn(['male', 'female', 'other', 'prefer_not_to_say'])
        .withMessage('Please select a valid gender option'),
    body('address')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Address must not exceed 200 characters'),
    body('city')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('City must not exceed 50 characters'),
    body('country')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Country must not exceed 50 characters'),
    body('profession')
        .optional()
        .isIn(['student', 'software_developer', 'designer', 'marketing_professional', 'data_scientist', 'business_analyst', 'project_manager', 'teacher', 'entrepreneur', 'consultant', 'freelancer', 'other'])
        .withMessage('Please select a valid profession'),
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio must not exceed 500 characters'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
], async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        req.flash('error_msg', errorMessages.join('. '));
        return res.redirect('/auth/register');
    }

    const { 
        name, 
        email, 
        password, 
        phone, 
        dateOfBirth, 
        gender, 
        address, 
        city, 
        country, 
        profession, 
        interests, 
        bio 
    } = req.body;

    // Process interests array if it exists
    const processedInterests = interests ? (Array.isArray(interests) ? interests.join(', ') : interests) : null;

    try {
        // Check if user already exists
        database.getDb().get('SELECT * FROM users WHERE email = ?', [email], async (err, existingUser) => {
            if (err) {
                console.error('Database error:', err);
                req.flash('error_msg', 'Something went wrong. Please try again.');
                return res.redirect('/auth/register');
            }

            if (existingUser) {
                req.flash('error_msg', 'User with this email already exists');
                return res.redirect('/auth/register');
            }

            try {
                // Hash password
                const saltRounds = 12;
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                // Insert new user
                database.getDb().run(
                    `INSERT INTO users (
                        name, email, password, phone, date_of_birth, gender, 
                        address, city, country, profession, interests, bio
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        name, 
                        email, 
                        hashedPassword, 
                        phone || null, 
                        dateOfBirth || null, 
                        gender || null,
                        address || null, 
                        city || null, 
                        country || null, 
                        profession || null, 
                        processedInterests, 
                        bio || null
                    ],
                    function(err) {
                        if (err) {
                            console.error('Error creating user:', err);
                            req.flash('error_msg', 'Error creating account. Please try again.');
                            return res.redirect('/auth/register');
                        }

                        req.flash('success_msg', 'Registration successful! You can now log in.');
                        res.redirect('/auth/login');
                    }
                );
            } catch (hashError) {
                console.error('Error hashing password:', hashError);
                req.flash('error_msg', 'Error creating account. Please try again.');
                res.redirect('/auth/register');
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        req.flash('error_msg', 'Something went wrong. Please try again.');
        res.redirect('/auth/register');
    }
});

// Handle login form submission
router.post('/login', [
    // Validation rules
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
], (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        req.flash('error_msg', errorMessages.join('. '));
        return res.redirect('/auth/login');
    }

    const { email, password } = req.body;

    // Find user by email
    database.getDb().get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            console.error('Database error:', err);
            req.flash('error_msg', 'Something went wrong. Please try again.');
            return res.redirect('/auth/login');
        }

        if (!user) {
            req.flash('error_msg', 'Invalid email or password');
            return res.redirect('/auth/login');
        }

        try {
            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                req.flash('error_msg', 'Invalid email or password');
                return res.redirect('/auth/login');
            }

            // Create session
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            };

            req.flash('success_msg', `Welcome back, ${user.name}!`);
            
            // Redirect to the page they were trying to access or home
            const redirectTo = req.session.returnTo || '/';
            delete req.session.returnTo;
            res.redirect(redirectTo);

        } catch (compareError) {
            console.error('Error comparing password:', compareError);
            req.flash('error_msg', 'Something went wrong. Please try again.');
            res.redirect('/auth/login');
        }
    });
});

// Logout route
router.get('/logout', (req, res) => {
    if (req.session.user) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                req.flash('error_msg', 'Error logging out');
                return res.redirect('/');
            }
            
            res.clearCookie('connect.sid');
            res.redirect('/auth/login');
        });
    } else {
        res.redirect('/');
    }
});

// Profile page
router.get('/profile', (req, res) => {
    if (!req.session.user) {
        req.flash('error_msg', 'Please log in to view your profile');
        return res.redirect('/auth/login');
    }

    database.getDb().get('SELECT * FROM users WHERE id = ?', [req.session.user.id], (err, user) => {
        if (err) {
            console.error('Error fetching user:', err);
            req.flash('error_msg', 'Error loading profile');
            return res.redirect('/');
        }

        res.render('profile', {
            title: 'My Profile - LearnHub',
            user
        });
    });
});

// Update profile
router.post('/profile', [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('phone')
        .optional()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Please enter a valid phone number'),
    body('dateOfBirth')
        .optional()
        .isISO8601()
        .withMessage('Please enter a valid date'),
    body('gender')
        .optional()
        .isIn(['male', 'female', 'other', 'prefer_not_to_say'])
        .withMessage('Please select a valid gender option'),
    body('address')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Address must not exceed 200 characters'),
    body('city')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('City must not exceed 50 characters'),
    body('country')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Country must not exceed 50 characters'),
    body('profession')
        .optional()
        .isIn(['student', 'software_developer', 'designer', 'marketing_professional', 'data_scientist', 'business_analyst', 'project_manager', 'teacher', 'entrepreneur', 'consultant', 'freelancer', 'other'])
        .withMessage('Please select a valid profession'),
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio must not exceed 500 characters')
], (req, res) => {
    if (!req.session.user) {
        req.flash('error_msg', 'Please log in to update your profile');
        return res.redirect('/auth/login');
    }

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        req.flash('error_msg', errorMessages.join('. '));
        return res.redirect('/auth/profile');
    }

    const { 
        name, 
        phone, 
        dateOfBirth, 
        gender, 
        address, 
        city, 
        country, 
        profession, 
        interests, 
        bio 
    } = req.body;
    
    const userId = req.session.user.id;

    // Process interests array if it exists
    const processedInterests = interests ? (Array.isArray(interests) ? interests.join(', ') : interests) : null;

    database.getDb().run(
        `UPDATE users SET 
            name = ?, phone = ?, date_of_birth = ?, gender = ?, 
            address = ?, city = ?, country = ?, profession = ?, 
            interests = ?, bio = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [
            name, 
            phone || null, 
            dateOfBirth || null, 
            gender || null,
            address || null, 
            city || null, 
            country || null, 
            profession || null, 
            processedInterests, 
            bio || null,
            userId
        ],
        function(err) {
            if (err) {
                console.error('Error updating profile:', err);
                req.flash('error_msg', 'Error updating profile');
                return res.redirect('/auth/profile');
            }

            // Update session
            req.session.user.name = name;
            req.flash('success_msg', 'Profile updated successfully!');
            res.redirect('/auth/profile');
        }
    );
});

module.exports = router;