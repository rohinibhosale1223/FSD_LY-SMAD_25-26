const express = require('express');
const router = express.Router();

// About page route
router.get('/', (req, res) => {
    res.render('about', { 
        title: 'About Us - LearnHub'
    });
});

module.exports = router;