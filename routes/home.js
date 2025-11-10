const express = require('express');
const database = require('../config/database');
const router = express.Router();

// Home page route
router.get('/', (req, res) => {
    // Get featured courses from database (top rated courses)
    database.getDb().all(
        'SELECT * FROM courses ORDER BY rating DESC, students DESC LIMIT 6',
        [],
        (err, featuredCourses) => {
            if (err) {
                console.error('Error fetching featured courses:', err);
                featuredCourses = [];
            }

            // Get total stats
            database.getDb().get(
                'SELECT COUNT(*) as totalCourses, SUM(students) as totalStudents FROM courses',
                [],
                (err, stats) => {
                    if (err) {
                        console.error('Error fetching stats:', err);
                        stats = { totalCourses: 0, totalStudents: 0 };
                    }

                    const statsData = {
                        totalStudents: stats.totalStudents || 0,
                        totalCourses: stats.totalCourses || 0,
                        totalInstructors: 50,
                        successRate: 95
                    };

                    res.render('home', { 
                        title: 'LearnHub - Your Gateway to Knowledge',
                        featuredCourses: featuredCourses || [],
                        stats: statsData
                    });
                }
            );
        }
    );
});

module.exports = router;