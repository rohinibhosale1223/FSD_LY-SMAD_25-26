const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'localapp',
  password: 'Admin@123',
  database: 'testapp'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');

  // Set the views directory
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  // Middleware
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(expressLayouts);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'change_this_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

  // Make user and cartCount available to all views
  app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.cartCount = req.session.cart ? req.session.cart.length : 0;
    next();
  });

  // Static photos data
  const staticPhotos = [
    { id: 1, title: 'Mountain View', category: 'Nature', price: 29.99, filename: 'mountain.jpg' },
    { id: 2, title: 'Ocean Waves', category: 'Nature', price: 34.99, filename: 'ocean.jpg' },
    { id: 3, title: 'City Lights', category: 'Urban', price: 39.99, filename: 'city.jpg' },
    { id: 4, title: 'Wildlife', category: 'Animals', price: 44.99, filename: 'wildlife.jpg' },
    { id: 5, title: 'Portrait', category: 'People', price: 49.99, filename: 'portrait.jpg' },
    { id: 6, title: 'Abstract', category: 'Art', price: 54.99, filename: 'abstract.jpg' },
  ];

  // Routes
  app.get('/', (req, res) => {
    res.render('index', { 
      title: 'Home',
      user: req.session.user || null,
      cartCount: req.session.cart ? req.session.cart.length : 0,
      photos: staticPhotos
    });
  });

  app.get('/gallery', (req, res) => {
    res.render('gallery', { 
      title: 'Gallery',
      user: req.session.user || null,
      cartCount: req.session.cart ? req.session.cart.length : 0
    });
  });

  app.get('/about', (req, res) => {
    res.render('about', { 
      title: 'About Us',
      user: req.session.user || null,
      cartCount: req.session.cart ? req.session.cart.length : 0
    });
  });

  app.get('/contact', (req, res) => {
    res.render('contact', { 
      title: 'Contact Us',
      user: req.session.user || null,
      cartCount: req.session.cart ? req.session.cart.length : 0
    });
  });

  app.get('/register', (req, res) => {
    res.render('register', { 
      title: 'Register',
      message: null
    });
  });

  app.post('/register', (req, res) => {
    const { first, last, username, pass } = req.body;
    
    if (!first || !last || !username || !pass) {
      return res.render('register', { 
        title: 'Register',
        message: 'All fields are required' 
      });
    }
    
    // Password validation can be added here if needed

    connection.query(
      'INSERT INTO user_tl (firstname, lastname, email, password) VALUES (?, ?, ?, ?)',
      [first, last, username, pass],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.render('register', { 
            title: 'Register',
            message: 'Database error occurred.' 
          });
        }
        
        // Store user in session
        req.session.user = {
          id: results.insertId,
          email: username,
          firstname: first,
          lastname: last
        };
        
        return res.redirect('/');
      }
    );
  });

  app.get('/login', (req, res) => {
    res.render('login', { 
      title: 'Login',
      message: null
    });
  });

  app.post('/login', (req, res) => {
    const { username, pass } = req.body;
    
    if (!username || !pass) {
      return res.render('login', { 
        title: 'Login',
        message: 'Please enter both email and password.' 
      });
    }
    
    connection.query(
      'SELECT * FROM user_tl WHERE email = ? AND password = ?',
      [username, pass],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.render('login', { 
            title: 'Login',
            message: 'Database error occurred.' 
          });
        }

        if (results.length > 0) {
          // Store user in session
          req.session.user = {
            id: results[0].id,
            email: results[0].email,
            firstname: results[0].firstname,
            lastname: results[0].lastname
          };
          
          return res.redirect('/');
        } else {
          return res.render('login', { 
            title: 'Login',
            message: 'Invalid email or password' 
          });
        }
      }
    );
  });

  // Start the server only after database connection is established
  app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on http://localhost:3000');
  }).on('error', (err) => {
    console.error('Server Error:', err);
    process.exit(1);
  });
});

app.get('/cart', (req, res) => {
  const cartItems = cart.map(item => {
    const photo = photos.find(p => p.id === item.photoId);
    return { ...photo, quantity: item.quantity };
  });
  
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  res.render('cart', { 
    title: 'Shopping Cart',
    cartItems,
    total: total.toFixed(2)
  });
});

// API Routes
app.post('/api/cart/add', (req, res) => {
  const { photoId } = req.body;
  const existingItem = cart.find(item => item.photoId === parseInt(photoId));
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ photoId: parseInt(photoId), quantity: 1 });
  }
  
  res.json({ success: true, cartCount: getCartCount() });
});

app.post('/api/cart/remove', (req, res) => {
  const { photoId } = req.body;
  cart = cart.filter(item => item.photoId !== parseInt(photoId));
  
  res.json({ success: true, cartCount: getCartCount() });
});

app.post('/api/contact', (req, res) => {
  // In a real app, you would save this to a database
  console.log('Contact form submitted:', req.body);
  res.json({ success: true, message: 'Thank you for your message! We will get back to you soon.' });
});

// Helper function
function getCartCount() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// Server startup is now handled after database connection
