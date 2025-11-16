const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const connection = require('./db'); // Ensure db.js exports a MySQL/MariaDB connection
const app = express();

// =====================
// ⚙️ VIEW & STATIC SETUP
// =====================
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// =====================
// 🌐 MAIN ROUTES
// =====================
app.get('/', (req, res) => res.render('index', { pageTitle: 'Home | GameZone' }));
app.get('/about', (req, res) => res.render('about', { pageTitle: 'About | GameZone' }));
app.get('/contact', (req, res) => res.render('contact', { pageTitle: 'Contact | GameZone' }));
app.get('/cart', (req, res) => res.render('cart', { pageTitle: 'Cart | GameZone' }));
app.get('/shop', (req, res) => res.render('shop', { pageTitle: 'Shop | GameZone' }));
app.get('/login', (req, res) => res.render('login', { pageTitle: 'Login | GameZone' }));
app.get('/register', (req, res) => res.render('register', { pageTitle: 'Register | GameZone' }));

// =====================
// 🧩 REGISTER ROUTE
// =====================
app.post('/register', (req, res) => {
  const { username, email, phone, dob, genre, password } = req.body;

  if (!username || !email || !phone || !dob || !genre || !password) {
    return res.status(400).json({ message: '⚠️ All fields are required.' });
  }

  const sql = 'INSERT INTO users (username, email, phone, dob, genre, password) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(sql, [username, email, phone, dob, genre, password], (err, result) => {
    if (err) {
      console.error('❌ Error inserting data:', err);
      return res.status(500).json({ message: 'Database error. Please try again.' });
    }

    console.log('✅ User registered successfully:', result.insertId);
    res.json({ message: 'User registered successfully!' });
  });
});

// =====================
// 🔑 LOGIN ROUTE
// =====================
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '⚠️ Email and password are required.' });
  }

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('❌ Error checking login:', err);
      return res.status(500).json({ message: 'Server error. Please try again.' });
    }

    if (results.length > 0) {
      console.log(`✅ ${email} logged in successfully!`);
      res.json({ message: 'Login successful!' });
    } else {
      res.json({ message: '❌ Invalid email or password!' });
    }
  });
});

// =====================
// 🚀 START SERVER
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ GameZone server running at http://localhost:${PORT}`));
