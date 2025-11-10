const express = require('express');
const database = require('../config/database');
const router = express.Router();

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.session.returnTo = req.originalUrl;
        req.flash('error_msg', 'Please log in to access your cart');
        res.redirect('/auth/login');
    }
};

// Cart page route
router.get('/', requireAuth, (req, res) => {
    const userId = req.session.user.id;

    // Get cart items with course details
    database.getDb().all(`
        SELECT c.*, ci.id as cart_item_id, ci.added_at
        FROM cart_items ci
        JOIN courses c ON ci.course_id = c.id
        WHERE ci.user_id = ?
        ORDER BY ci.added_at DESC
    `, [userId], (err, cartItems) => {
        if (err) {
            console.error('Error fetching cart items:', err);
            req.flash('error_msg', 'Error loading cart');
            return res.redirect('/');
        }

        // Calculate total
        const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

        res.render('cart', { 
            title: 'Shopping Cart - LearnHub',
            cartItems,
            total: total.toFixed(2)
        });
    });
});

// Add item to cart
router.post('/add', requireAuth, (req, res) => {
    const { courseId } = req.body;
    const userId = req.session.user.id;

    if (!courseId) {
        req.flash('error_msg', 'Invalid course');
        return res.redirect('/courses');
    }

    // Check if course exists
    database.getDb().get('SELECT * FROM courses WHERE id = ?', [courseId], (err, course) => {
        if (err) {
            console.error('Error checking course:', err);
            req.flash('error_msg', 'Error adding to cart');
            return res.redirect('/courses');
        }

        if (!course) {
            req.flash('error_msg', 'Course not found');
            return res.redirect('/courses');
        }

        // Check if user is already enrolled
        database.getDb().get(
            'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
            [userId, courseId],
            (err, enrollment) => {
                if (err) {
                    console.error('Error checking enrollment:', err);
                    req.flash('error_msg', 'Error adding to cart');
                    return res.redirect('/courses');
                }

                if (enrollment) {
                    req.flash('error_msg', 'You are already enrolled in this course');
                    return res.redirect(`/courses/${courseId}`);
                }

                // Check if already in cart
                database.getDb().get(
                    'SELECT * FROM cart_items WHERE user_id = ? AND course_id = ?',
                    [userId, courseId],
                    (err, cartItem) => {
                        if (err) {
                            console.error('Error checking cart:', err);
                            req.flash('error_msg', 'Error adding to cart');
                            return res.redirect('/courses');
                        }

                        if (cartItem) {
                            req.flash('error_msg', 'Course is already in your cart');
                            return res.redirect('/cart');
                        }

                        // Add to cart
                        database.getDb().run(
                            'INSERT INTO cart_items (user_id, course_id) VALUES (?, ?)',
                            [userId, courseId],
                            function(err) {
                                if (err) {
                                    console.error('Error adding to cart:', err);
                                    req.flash('error_msg', 'Error adding course to cart');
                                    return res.redirect('/courses');
                                }

                                req.flash('success_msg', 'Course added to cart successfully!');
                                res.redirect('/cart');
                            }
                        );
                    }
                );
            }
        );
    });
});

// Remove item from cart
router.post('/remove', requireAuth, (req, res) => {
    const { courseId } = req.body;
    const userId = req.session.user.id;

    if (!courseId) {
        req.flash('error_msg', 'Invalid course');
        return res.redirect('/cart');
    }

    database.getDb().run(
        'DELETE FROM cart_items WHERE user_id = ? AND course_id = ?',
        [userId, courseId],
        function(err) {
            if (err) {
                console.error('Error removing from cart:', err);
                req.flash('error_msg', 'Error removing course from cart');
                return res.redirect('/cart');
            }

            if (this.changes === 0) {
                req.flash('error_msg', 'Course not found in cart');
            } else {
                req.flash('success_msg', 'Course removed from cart');
            }

            res.redirect('/cart');
        }
    );
});

// Clear entire cart
router.post('/clear', requireAuth, (req, res) => {
    const userId = req.session.user.id;

    database.getDb().run(
        'DELETE FROM cart_items WHERE user_id = ?',
        [userId],
        function(err) {
            if (err) {
                console.error('Error clearing cart:', err);
                req.flash('error_msg', 'Error clearing cart');
                return res.redirect('/cart');
            }

            req.flash('success_msg', 'Cart cleared successfully');
            res.redirect('/cart');
        }
    );
});

// Checkout (enroll in all cart items)
router.post('/checkout', requireAuth, (req, res) => {
    const userId = req.session.user.id;

    // Get all cart items
    database.getDb().all(
        'SELECT course_id FROM cart_items WHERE user_id = ?',
        [userId],
        (err, cartItems) => {
            if (err) {
                console.error('Error fetching cart items:', err);
                req.flash('error_msg', 'Error processing checkout');
                return res.redirect('/cart');
            }

            if (cartItems.length === 0) {
                req.flash('error_msg', 'Your cart is empty');
                return res.redirect('/cart');
            }

            // Start transaction-like process
            let processedItems = 0;
            let errors = [];

            cartItems.forEach(item => {
                // Check if already enrolled
                database.getDb().get(
                    'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
                    [userId, item.course_id],
                    (err, enrollment) => {
                        if (err) {
                            errors.push(`Error checking enrollment for course ${item.course_id}`);
                        } else if (enrollment) {
                            errors.push(`Already enrolled in course ${item.course_id}`);
                        } else {
                            // Enroll user
                            database.getDb().run(
                                'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)',
                                [userId, item.course_id],
                                function(enrollError) {
                                    if (enrollError) {
                                        errors.push(`Error enrolling in course ${item.course_id}`);
                                    } else {
                                        // Update course student count
                                        database.getDb().run(
                                            'UPDATE courses SET students = students + 1 WHERE id = ?',
                                            [item.course_id]
                                        );
                                    }
                                }
                            );
                        }

                        processedItems++;
                        
                        // When all items are processed
                        if (processedItems === cartItems.length) {
                            if (errors.length === 0) {
                                // Clear cart on successful checkout
                                database.getDb().run(
                                    'DELETE FROM cart_items WHERE user_id = ?',
                                    [userId],
                                    (clearErr) => {
                                        if (clearErr) {
                                            console.error('Error clearing cart after checkout:', clearErr);
                                        }
                                        
                                        req.flash('success_msg', 'Checkout successful! You are now enrolled in all courses.');
                                        res.redirect('/courses/my/enrolled');
                                    }
                                );
                            } else {
                                req.flash('error_msg', `Checkout completed with some errors: ${errors.join(', ')}`);
                                res.redirect('/cart');
                            }
                        }
                    }
                );
            });
        }
    );
});

module.exports = router;