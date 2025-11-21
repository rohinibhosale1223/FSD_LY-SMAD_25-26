const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { requireAuth, checkAuth } = require('../middleware/auth');

const router = express.Router();

// Input validation helpers
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password.length >= 8;
};

const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
};

// Registration endpoint
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, confirmPassword, phone, terms, company, jobTitle, website, location } = req.body;

        // Validation
        if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        if (!terms) {
            return res.status(400).json({
                success: false,
                message: 'You must accept the terms and conditions'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        if (!validateUsername(username)) {
            return res.status(400).json({
                success: false,
                message: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores'
            });
        }

        // Check if user already exists
        const existing = await User.findOne({ $or: [{ email }, { username }] }).lean();
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user document
        const user = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            phone: phone || null,
            profile: {
                company: company || null,
                jobTitle: jobTitle || null,
                website: website || null,
                location: location || null
            }
        });
        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: user._id
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Find user by email
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Create session
        req.session.userId = String(user._id);
        req.session.username = user.username;
        req.session.email = user.email;

        // Set session expiration
        if (rememberMe) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        } else {
            req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 24 hours
        }

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            redirect: '/dashboard.html'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
        });
    }
});

// Logout endpoint
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({
                success: false,
                message: 'Logout failed'
            });
        }
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    });
});

// Check authentication status
router.get('/check', checkAuth);

// Get user profile
router.get('/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).lean();
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User profile not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                first_name: user.firstName,
                last_name: user.lastName,
                phone: user.phone,
                created_at: user.created_at,
                bio: user.profile?.bio || null,
                company: user.profile?.company || null,
                job_title: user.profile?.jobTitle || null,
                website: user.profile?.website || null,
                location: user.profile?.location || null,
                avatar_url: user.profile?.avatarUrl || null
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve profile'
        });
    }
});

// Update user profile
router.put('/profile', requireAuth, async (req, res) => {
    try {
        const { firstName, lastName, phone, bio, company, jobTitle, website, location } = req.body;

        await User.updateOne(
            { _id: req.user.id },
            {
                $set: {
                    firstName,
                    lastName,
                    phone,
                    'profile.bio': bio,
                    'profile.company': company,
                    'profile.jobTitle': jobTitle,
                    'profile.website': website,
                    'profile.location': location
                }
            }
        );

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
});

// Change password
router.put('/change-password', requireAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All password fields are required'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'New passwords do not match'
            });
        }

        if (!validatePassword(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 8 characters long'
            });
        }

        // Get current password hash
        const user = await User.findById(req.user.id).exec();
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const saltRounds = 12;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await User.updateOne({ _id: req.user.id }, { $set: { password: hashedNewPassword } });

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password'
        });
    }
});

module.exports = router;


