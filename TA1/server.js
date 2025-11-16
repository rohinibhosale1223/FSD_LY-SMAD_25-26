const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const { initializeDatabase, testConnection } = require('./database');
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

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/services', (req, res) => {
    res.render('services');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/plans', (req, res) => {
    res.render('plans');
});

app.get('/cart', (req, res) => {
    res.render('cart');
});

// Map friendly routes without .html extension
app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

// Dashboard routes
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

app.get('/dashboard.html', (req, res) => {
    res.render('dashboard');
});

// Initialize DB then start server
initializeDatabase()
  .then(testConnection)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`MTANKS Technology Solutions server running on http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    process.exit(1);
  });

