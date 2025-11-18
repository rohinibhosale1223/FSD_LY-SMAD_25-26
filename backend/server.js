const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sneakers_db'  // make sure this DB exists
});

db.connect(err => {
  if (err) {
    console.log('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL Database');
  }
});

// ✅ Default route
app.get('/', (req, res) => {
  res.send('Backend running for Sneakers Shop!');
});

// ✅ Contact form API
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  const sql = 'INSERT INTO contact_tbl (name, email, message) VALUES (?, ?, ?)';
  db.query(sql, [name, email, message], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error saving contact');
    } else {
      res.send('Contact saved!');
    }
  });
});

// ✅ Login API
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  });
});

// ✅ Start server
app.listen(5000, () => {
  console.log('🚀 Server running on port 5000');
});
