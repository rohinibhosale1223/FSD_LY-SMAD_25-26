const express = require('express');
const router = express.Router();

// Contact page route
router.get('/', (req, res) => {
    res.render('contact', { 
        title: 'Contact Us - LearnHub'
    });
});

// Handle contact form submission
router.post('/', (req, res) => {
    // TODO: Implement contact form handling
    const { name, email, message } = req.body;
    
    // For now, just redirect back with a success message
    res.redirect('/contact?success=true');
});

module.exports = router;