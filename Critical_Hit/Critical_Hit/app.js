const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(session({
  secret: 'critical_hit_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// DB connection and models
const { connectDB, sequelize } = require('./db');
const Review = require('./models/Review');
const User = require('./models/User');

// Routes

// Home - redirect to login or home depending on session
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/home');
  } else {
    res.render('login', { error: null });
  }
});

// Login page
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Login handler
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt with:', { username, password });
  try {
    const user = await User.findOne({ where: { username } });
    console.log('Found user in DB:', user ? user.toJSON() : 'None');
    if (!user) {
      return res.render('login', { error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid password' });
    }
    req.session.userId = user.id;
    req.session.username = user.username;
    res.redirect('/home');
  } catch (err) {
    console.error('Login error:', err);
    res.render('login', { error: 'Login failed' });
  }
});

// Register page
app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// Register handler
app.post('/register', async (req, res) => {
  console.log('Received registration request with body:', req.body);
  const { username, email, password, confirmPassword } = req.body;
  try {
    if (!username || !password) {
      console.log('Missing username or password');
      return res.render('register', { error: 'Username and password required' });
    }
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return res.render('register', { error: 'Passwords do not match' });
    }
    const existing = await User.findOne({ where: { username } });
    if (existing) {
      console.log('Username already exists');
      return res.render('register', { error: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Creating user with:', { username, email, hashedPassword });
    const newUser = await User.create({
      username,
      email: email || null,
      password: hashedPassword
    });
    console.log('Created user:', newUser.toJSON());
    req.session.userId = newUser.id;
    req.session.username = newUser.username;
    res.redirect('/home');
  } catch (err) {
    console.error('Registration error:', err);
    res.render('register', { error: 'Registration failed' });
  }
});

// Home page (optional login - supports guest)
app.get('/home', (req, res) => {
  const username = req.session.username || 'Guest';
  res.render('home', { username });
});

// Reviews page
app.get('/reviews', async (req, res) => {
  try {
    const rows = await Review.findAll({ order: [['createdAt', 'DESC']], limit: 100 });
    const reviews = rows.map(r => ({
      username: r.username,
      gameTitle: r.gameTitle,
      rating: r.rating,
      text: r.text,
      date: new Date(r.createdAt).toLocaleDateString()
    }));
    const username = req.session.username || 'Guest';
    res.render('reviews', { reviews, username });
  } catch (err) {
    console.error('Failed to fetch reviews:', err);
    res.status(500).send('Failed to load reviews');
  }
});

// About page
app.get('/about', (req, res) => {
  const username = req.session.username || 'Guest';
  res.render('about', { username });
});

// Contact page
app.get('/contact', (req, res) => {
  const username = req.session.username || 'Guest';
  res.render('contact', { username });
});

// Store page
app.get('/store', (req, res) => {
  const username = req.session.username || 'Guest';
  res.render('store', { username });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Logout error:', err);
    res.redirect('/');
  });
});

// Submit review (supports guest username)
app.post('/submit-review', async (req, res) => {
  const { username, gameTitle, rating, text } = req.body;
  try {
    await Review.create({
      username: username || req.session.username || 'Guest',
      gameTitle,
      rating: parseInt(rating) || 0,
      text
    });
    res.redirect('/reviews');
  } catch (err) {
    console.error('Failed to create review:', err);
    res.status(500).send('Failed to submit review');
  }
});

// Start server after DB connection and sync
async function start() {
  await connectDB();
  // ensure models are synced (safe default for development)
  console.log('Syncing database models...');
  await sequelize.sync();
  console.log('Database models synced successfully');
  const server = app.listen(PORT, '0.0.0.0', () => {
    const addr = server.address();
    console.log(`Critical Hit Server running on http://localhost:${addr.port}`);
  });
}

start().catch(err => {
  console.error('Failed to start application:', err);
  process.exit(1);
});