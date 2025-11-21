const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const { connectMongo } = require('./mongo');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'change-this-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/plans', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'plans.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

// Map friendly routes without .html extension
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

connectMongo().then(() => {
    app.listen(PORT, () => {
        console.log(`MTANKS Technology Solutions server running on http://localhost:${PORT}`);
    });
}).catch(() => {
    process.exit(1);
});

