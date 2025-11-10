const express = require('express');
const router = express.Router();
const database = require('../config/database');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.flash('error_msg', 'Please log in to access this page');
        res.redirect('/auth/login');
    }
};

// All courses page
router.get('/', (req, res) => {
    const { category, search, sort } = req.query;
    let query = 'SELECT * FROM courses WHERE 1=1';
    const params = [];

    // Filter by category
    if (category && category !== 'all') {
        query += ' AND category = ?';
        params.push(category);
    }

    // Search functionality
    if (search) {
        query += ' AND (title LIKE ? OR description LIKE ? OR instructor LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Sorting
    switch (sort) {
        case 'price_low':
            query += ' ORDER BY price ASC';
            break;
        case 'price_high':
            query += ' ORDER BY price DESC';
            break;
        case 'rating':
            query += ' ORDER BY rating DESC';
            break;
        case 'students':
            query += ' ORDER BY students DESC';
            break;
        default:
            query += ' ORDER BY created_at DESC';
    }

    database.getDb().all(query, params, (err, courses) => {
        if (err) {
            console.error('Error fetching courses:', err);
            req.flash('error_msg', 'Error loading courses');
            return res.redirect('/');
        }

        // Get all categories for filter
        database.getDb().all('SELECT DISTINCT category FROM courses ORDER BY category', (err, categories) => {
            if (err) {
                console.error('Error fetching categories:', err);
                categories = [];
            }

            res.render('courses', {
                title: 'All Courses - LearnHub',
                courses,
                categories,
                currentCategory: category || 'all',
                currentSearch: search || '',
                currentSort: sort || 'newest'
            });
        });
    });
});

// Single course details page
router.get('/:id', (req, res) => {
    const courseId = req.params.id;

    database.getDb().get('SELECT * FROM courses WHERE id = ?', [courseId], (err, course) => {
        if (err) {
            console.error('Error fetching course:', err);
            req.flash('error_msg', 'Error loading course details');
            return res.redirect('/courses');
        }

        if (!course) {
            req.flash('error_msg', 'Course not found');
            return res.redirect('/courses');
        }

        // Check if user is enrolled (if logged in)
        let isEnrolled = false;
        let isInCart = false;

        if (req.session.user) {
            // Check enrollment
            database.getDb().get(
                'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
                [req.session.user.id, courseId],
                (err, enrollment) => {
                    if (enrollment) {
                        isEnrolled = true;
                    }

                    // Check if in cart
                    database.getDb().get(
                        'SELECT * FROM cart_items WHERE user_id = ? AND course_id = ?',
                        [req.session.user.id, courseId],
                        (err, cartItem) => {
                            if (cartItem) {
                                isInCart = true;
                            }

                            res.render('course-details', {
                                title: `${course.title} - LearnHub`,
                                course,
                                isEnrolled,
                                isInCart
                            });
                        }
                    );
                }
            );
        } else {
            res.render('course-details', {
                title: `${course.title} - LearnHub`,
                course,
                isEnrolled,
                isInCart
            });
        }
    });
});

// Enroll in course
router.post('/:id/enroll', requireAuth, (req, res) => {
    const courseId = req.params.id;
    const userId = req.session.user.id;

    // Check if already enrolled
    database.getDb().get(
        'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
        [userId, courseId],
        (err, enrollment) => {
            if (err) {
                console.error('Error checking enrollment:', err);
                req.flash('error_msg', 'Error processing enrollment');
                return res.redirect(`/courses/${courseId}`);
            }

            if (enrollment) {
                req.flash('error_msg', 'You are already enrolled in this course');
                return res.redirect(`/courses/${courseId}`);
            }

            // Enroll the user
            database.getDb().run(
                'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)',
                [userId, courseId],
                function(err) {
                    if (err) {
                        console.error('Error enrolling user:', err);
                        req.flash('error_msg', 'Error enrolling in course');
                        return res.redirect(`/courses/${courseId}`);
                    }

                    // Remove from cart if exists
                    database.getDb().run(
                        'DELETE FROM cart_items WHERE user_id = ? AND course_id = ?',
                        [userId, courseId]
                    );

                    // Update course student count
                    database.getDb().run(
                        'UPDATE courses SET students = students + 1 WHERE id = ?',
                        [courseId]
                    );

                    req.flash('success_msg', 'Successfully enrolled in the course!');
                    res.redirect(`/courses/${courseId}`);
                }
            );
        }
    );
});

// My courses page (enrolled courses)
router.get('/my/enrolled', requireAuth, (req, res) => {
    const userId = req.session.user.id;

    database.getDb().all(`
        SELECT c.*, e.enrolled_at, e.progress 
        FROM courses c 
        JOIN enrollments e ON c.id = e.course_id 
        WHERE e.user_id = ? 
        ORDER BY e.enrolled_at DESC
    `, [userId], (err, courses) => {
        if (err) {
            console.error('Error fetching enrolled courses:', err);
            req.flash('error_msg', 'Error loading your courses');
            return res.redirect('/');
        }

        res.render('my-courses', {
            title: 'My Courses - LearnHub',
            courses
        });
    });
});

module.exports = router;