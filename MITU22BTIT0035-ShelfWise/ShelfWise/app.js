const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory data storage (simulating database)
let users = [];
let books = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A timeless tale of decadence, idealism, and impossible love set in the glittering Jazz Age.',
    price: 299.00,
    rating: 4.5,
    genre: 'Classic Fiction',
    image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg',
    stock_quantity: 25
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
    price: 349.00,
    rating: 4.8,
    genre: 'Classic Fiction',
    image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg',
    stock_quantity: 30
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian masterpiece about totalitarian control and the power of truth.',
    price: 399.00,
    rating: 4.6,
    genre: 'Dystopian Fiction',
    image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg',
    stock_quantity: 40
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A witty and romantic tale of love, marriage, and social expectations in 19th century England.',
    price: 279.00,
    rating: 4.7,
    genre: 'Romance',
    image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg',
    stock_quantity: 20
  },
  {
    id: 5,
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    description: 'The magical adventure that started it all - follow Harry on his journey to Hogwarts.',
    price: 499.00,
    rating: 4.9,
    genre: 'Fantasy',
    image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg',
    stock_quantity: 50
  },
  {
    id: 6,
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    description: 'An epic fantasy adventure through Middle-earth in the ultimate battle between good and evil.',
    price: 899.00,
    rating: 4.8,
    genre: 'Fantasy',
    image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1566425108i/33.jpg',
    stock_quantity: 35
  },
  {
    id: 7,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    description: 'A controversial coming-of-age story that captures the alienation of modern youth.',
    price: 329.00,
    rating: 4.2,
    genre: 'Coming of Age',
    image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg',
    stock_quantity: 18
  },
  {
    id: 8,
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'A science fiction epic of politics, religion, and survival on the desert planet Arrakis.',
    price: 599.00,
    rating: 4.4,
    genre: 'Science Fiction',
    image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg',
    stock_quantity: 28
  },
  {
    id: 9,
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description: 'Between life and death sits a library where every book offers a different version of your life.',
    price: 379.00,
    rating: 4.3,
    genre: 'Speculative Fiction',
    image_url: 'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg',
    stock_quantity: 27
  },
  {
    id: 10,
    title: 'Educated',
    author: 'Tara Westover',
    description: 'A memoir of a young woman who, kept out of school, leaves her survivalist family and goes on to earn a PhD.',
    price: 359.00,
    rating: 4.7,
    genre: 'Memoir',
    image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1506026635i/35133922.jpg',
    stock_quantity: 26
  },
  {
    id: 11,
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'An easy and proven way to build good habits and break bad ones through small incremental changes.',
    price: 499.00,
    rating: 4.8,
    genre: 'Self-Help',
    image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1535115320i/40121378.jpg',
    stock_quantity: 45
  },
  {
    id: 12,
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    description: 'A sweeping exploration of humanity’s creation, evolution, and impact on the world.',
    price: 599.00,
    rating: 4.7,
    genre: 'History',
    image_url: 'https://covers.openlibrary.org/b/isbn/9780099590088-L.jpg',
    stock_quantity: 30
  }
];
let contacts = [];
let carts = [];
let userIdCounter = 1;
let contactIdCounter = 1;
let cartIdCounter = 1;

// MySQL Connection Pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'gurneet',
  password: '1234567890',
  database: 'shelfwise',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

// Verify database connectivity at startup (logs only)
(async () => {
  try {
    await db.execute('SELECT 1');
    console.log('✅ MySQL connection OK');
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
  }
})();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing middleware (replacing body-parser)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: 'shelfwise-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Flash message middleware
app.use((req, res, next) => {
  res.locals.success = req.session.success || null;
  res.locals.error = req.session.error || null;
  res.locals.user = req.session.user || null;
  delete req.session.success;
  delete req.session.error;
  next();
});

// Helper functions
function setSuccess(req, msg) {
  req.session.success = msg;
}

function setError(req, msg) {
  req.session.error = msg;
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    setError(req, 'Please login to continue.');
    return res.redirect('/login');
  }
  next();
}

// Routes
// Home page - displays featured books
app.get('/', (req, res) => {
  try {
    const userPreferences = Array.isArray(req.session.user?.preferred_genres)
      ? req.session.user.preferred_genres
      : [];

    const sortedBooks = [...books];

    if (userPreferences.length > 0) {
      sortedBooks.sort((a, b) => {
        const prefIndexA = userPreferences.indexOf(a.genre);
        const prefIndexB = userPreferences.indexOf(b.genre);
        const scoreA = prefIndexA === -1 ? userPreferences.length : prefIndexA;
        const scoreB = prefIndexB === -1 ? userPreferences.length : prefIndexB;
        if (scoreA !== scoreB) {
          return scoreA - scoreB;
        }
        return b.rating - a.rating;
      });
    } else {
      sortedBooks.sort((a, b) => b.rating - a.rating);
    }

    const featuredBooks = sortedBooks.slice(0, 6);

    res.render('index', { title: 'ShelfWise | Home', books: featuredBooks, currentPage: 'home' });
  } catch (err) {
    console.error(err);
    setError(req, 'Failed to load home page.');
    res.render('index', { title: 'ShelfWise | Home', books: [], currentPage: 'home' });
  }
});

// About page
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us | ShelfWise', currentPage: 'about' });
});

// Contact page
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us | ShelfWise', currentPage: 'contact' });
});

// Contact form submission (CRUD - Create)
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    setError(req, 'All fields are required.');
    return res.redirect('/contact');
  }
  
  try {
    // Add contact to in-memory storage
    contacts.push({
      id: contactIdCounter++,
      name,
      email,
      message,
      created_at: new Date()
    });
    setSuccess(req, 'Your inquiry has been submitted successfully!');
  } catch (err) {
    console.error(err);
    setError(req, 'Failed to submit your inquiry. Please try again.');
  }
  
  res.redirect('/contact');
});

// Books listing page
app.get('/books', (req, res) => {
  try {
    const genres = [...new Set(books.map(book => book.genre).filter(Boolean))].sort((a, b) => a.localeCompare(b));

    const requestedGenreRaw = req.query.genre;
    let requestedGenre = undefined;

    if (typeof requestedGenreRaw === 'string') {
      requestedGenre = requestedGenreRaw.trim();
    } else if (Array.isArray(requestedGenreRaw) && requestedGenreRaw.length > 0) {
      requestedGenre = (requestedGenreRaw[0] || '').trim();
    }

    const normalizedGenreMap = new Map(genres.map(genre => [genre.toLowerCase(), genre]));
    const matchedGenre = requestedGenre ? normalizedGenreMap.get(requestedGenre.toLowerCase()) : undefined;
    const selectedGenre = matchedGenre || 'all';

    const userPreferences = Array.isArray(req.session.user?.preferred_genres)
      ? req.session.user.preferred_genres
      : [];

    const filteredBooks = selectedGenre === 'all'
      ? [...books]
      : books.filter(book => book.genre === selectedGenre);

    const sortedBooks = [...filteredBooks];

    if (userPreferences.length > 0) {
      sortedBooks.sort((a, b) => {
        const prefIndexA = userPreferences.indexOf(a.genre);
        const prefIndexB = userPreferences.indexOf(b.genre);
        const scoreA = prefIndexA === -1 ? userPreferences.length : prefIndexA;
        const scoreB = prefIndexB === -1 ? userPreferences.length : prefIndexB;
        if (scoreA !== scoreB) {
          return scoreA - scoreB;
        }
        return a.title.localeCompare(b.title);
      });
    } else {
      sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
    }

    res.render('books', {
      title: 'All Books | ShelfWise',
      books: sortedBooks,
      currentPage: 'books',
      genres,
      selectedGenre
    });
  } catch (err) {
    console.error(err);
    setError(req, 'Failed to load books.');
    res.render('books', {
      title: 'All Books | ShelfWise',
      books: [],
      currentPage: 'books',
      genres: [],
      selectedGenre: 'all'
    });
  }
});

// User Registration
app.get('/register', (req, res) => {
  const genres = [...new Set(books.map(book => book.genre))].sort((a, b) => a.localeCompare(b));
  res.render('register', {
    title: 'Register | ShelfWise',
    currentPage: 'register',
    genres
  });
});

// Registration form submission (CRUD - Create)
app.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword, favoriteAuthor, readingFrequency } = req.body;
  let preferredGenres = req.body.preferredGenres || [];
  
  if (!name || !email || !password || !confirmPassword) {
    setError(req, 'All fields are required.');
    return res.redirect('/register');
  }
  if (!preferredGenres || (Array.isArray(preferredGenres) && preferredGenres.length === 0)) {
    setError(req, 'Please select at least one preferred genre.');
    return res.redirect('/register');
  }
  if (password !== confirmPassword) {
    setError(req, 'Passwords do not match.');
    return res.redirect('/register');
  }
  if (password.length < 6) {
    setError(req, 'Password must be at least 6 characters long.');
    return res.redirect('/register');
  }

  try {
    if (!Array.isArray(preferredGenres)) preferredGenres = [preferredGenres];
    preferredGenres = preferredGenres.map(genre => (genre || '').toString().trim()).filter(Boolean);
    const uniquePreferredGenres = [...new Set(preferredGenres)].slice(0, 3);
    if (uniquePreferredGenres.length === 0) {
      setError(req, 'Please select at least one preferred genre.');
      return res.redirect('/register');
    }

    // Check for existing user
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      setError(req, 'Email already registered.');
      return res.redirect('/register');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await db.execute(
  `INSERT INTO users (name, email, password_hash, favorite_author, reading_frequency, preferred_genres, created_at)
   VALUES (?, ?, ?, ?, ?, ?, NOW())`,
  [name.trim(), email.trim(), hash, (favoriteAuthor || '').trim(), (readingFrequency || '').trim(), JSON.stringify(uniquePreferredGenres)]
);


    setSuccess(req, 'Registration successful! Please login.');
    res.redirect('/login');
  } catch (err) {
    console.error('Registration failed:', err);
    setError(req, 'Registration failed. Please try again.');
    res.redirect('/register');
  }
});



// User Login
app.get('/login', (req, res) => {
  res.render('login', { title: 'Login | ShelfWise', currentPage: 'login' });
});

// Login form submission (CRUD - Read)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    setError(req, 'Email and password are required.');
    return res.redirect('/login');
  }
  
  try {
    const [rows] = await db.execute(
      'SELECT id, name, email, password_hash, favorite_author, reading_frequency, preferred_genres FROM users WHERE email = ?',
      [email.trim()]
    );

    if (rows.length === 0) {
      setError(req, 'Invalid credentials.');
      return res.redirect('/login');
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      setError(req, 'Invalid credentials.');
      return res.redirect('/login');
    }

    let preferredGenres = [];
    try {
      preferredGenres = user.preferred_genres ? JSON.parse(user.preferred_genres) : [];
    } catch (parseErr) {
      console.warn('Failed to parse preferred genres for user', user.email, parseErr);
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      preferred_genres: Array.isArray(preferredGenres) ? preferredGenres : [],
      favorite_author: user.favorite_author || '',
      reading_frequency: user.reading_frequency || ''
    };
    
    setSuccess(req, `Welcome back, ${user.name}!`);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    setError(req, 'Login failed. Please try again.');
    res.redirect('/login');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});

// Cart Management
// View cart (CRUD - Read)
app.get('/cart', (req, res) => {
  try {
    let items = [];
    
    if (req.session.user) {
      // For logged in users, get from database
      const userId = req.session.user.id;
      const userCartItems = carts.filter(c => c.user_id === userId);
      
      items = userCartItems.map(cartItem => {
        const book = books.find(b => b.id === cartItem.book_id);
        return {
          ...cartItem,
          title: book.title,
          author: book.author,
          price: book.price,
          image_url: book.image_url
        };
      }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
      // For non-logged users, get from session
      if (req.session.cart && req.session.cart.length > 0) {
        items = req.session.cart.map(cartItem => {
          const book = books.find(b => b.id === cartItem.book_id);
          return {
            book_id: cartItem.book_id,
            quantity: cartItem.quantity,
            title: book.title,
            author: book.author,
            price: book.price,
            image_url: book.image_url
          };
        });
      }
    }
    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.render('cart', { title: 'Your Cart | ShelfWise', items, total, currentPage: 'cart' });
  } catch (err) {
    console.error(err);
    setError(req, 'Failed to load cart.');
    res.render('cart', { title: 'Your Cart | ShelfWise', items: [], total: 0, currentPage: 'cart' });
  }
});

// Add to cart (CRUD - Create)
app.post('/cart/add', (req, res) => {
  const { book_id, quantity } = req.body;
  const qty = Math.max(1, parseInt(quantity || '1', 10));

  let redirectPath = '/';
  try {
    if (req.get('referer')) {
      const url = new URL(req.get('referer'));
      redirectPath = url.pathname || '/';
    }
  } catch (err) {
    console.error('Failed to parse referer for redirect:', err);
  }

  // If user not logged in, store in session cart
  if (!req.session.user) {
    if (!req.session.cart) {
      req.session.cart = [];
    }
    
    try {
      const book = books.find(b => b.id === parseInt(book_id));
      if (!book) {
        setError(req, 'Book not found.');
        return res.redirect('/');
      }
      
      if (book.stock_quantity < qty) {
        setError(req, 'Not enough stock available.');
        return res.redirect('/');
      }
      
      // Check if item already exists in session cart
      const existingItem = req.session.cart.find(item => item.book_id === parseInt(book_id));
      
      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        req.session.cart.push({
          book_id: parseInt(book_id),
          quantity: qty
        });
      }
      
      setSuccess(req, `"${book.title}" added to cart!`);
    } catch (err) {
      console.error(err);
      setError(req, 'Failed to add book to cart.');
    }

    return res.redirect(redirectPath);
  }
  
  // For logged in users
  const userId = req.session.user.id;
  
  try {
    // Check if book exists and has stock
    const book = books.find(b => b.id === parseInt(book_id));
    if (!book) {
      setError(req, 'Book not found.');
      return res.redirect('/books');
    }
    
    if (book.stock_quantity < qty) {
      setError(req, 'Not enough stock available.');
      return res.redirect('/books');
    }
    
    // Check if item already exists in cart
    const existingCartItem = carts.find(c => c.user_id === userId && c.book_id === parseInt(book_id));
    
    if (existingCartItem) {
      // Update quantity
      existingCartItem.quantity += qty;
    } else {
      // Add new item to cart
      carts.push({
        id: cartIdCounter++,
        user_id: userId,
        book_id: parseInt(book_id),
        quantity: qty,
        created_at: new Date()
      });
    }
    
    setSuccess(req, `"${book.title}" added to cart!`);
  } catch (err) {
    console.error(err);
    setError(req, 'Failed to add book to cart.');
  }

  res.redirect(redirectPath);
});

// Update cart item (CRUD - Update)
app.post('/cart/update', (req, res) => {
  const { book_id, quantity } = req.body;
  const qty = parseInt(quantity, 10);
  
  try {
    if (req.session.user) {
      // For logged-in users
      const userId = req.session.user.id;
      const cartItemIndex = carts.findIndex(c => c.user_id === userId && c.book_id === parseInt(book_id));
      
      if (cartItemIndex !== -1) {
        if (!qty || qty <= 0) {
          // Remove item if quantity is 0 or invalid
          carts.splice(cartItemIndex, 1);
          setSuccess(req, 'Item removed from cart.');
        } else {
          // Update quantity
          carts[cartItemIndex].quantity = qty;
          setSuccess(req, 'Cart updated successfully.');
        }
      } else {
        setError(req, 'Item not found in cart.');
      }
    } else {
      // For non-logged users (session cart)
      if (req.session.cart && req.session.cart.length > 0) {
        const cartItemIndex = req.session.cart.findIndex(item => item.book_id === parseInt(book_id));
        
        if (cartItemIndex !== -1) {
          if (!qty || qty <= 0) {
            // Remove item if quantity is 0 or invalid
            req.session.cart.splice(cartItemIndex, 1);
            setSuccess(req, 'Item removed from cart.');
          } else {
            // Update quantity
            req.session.cart[cartItemIndex].quantity = qty;
            setSuccess(req, 'Cart updated successfully.');
          }
        } else {
          setError(req, 'Item not found in cart.');
        }
      } else {
        setError(req, 'Cart is empty.');
      }
    }
  } catch (err) {
    console.error(err);
    setError(req, 'Failed to update cart.');
  }
  
  res.redirect('/cart');
});

// Remove from cart (CRUD - Delete)
app.post('/cart/delete', (req, res) => {
  const { book_id } = req.body;
  
  try {
    if (req.session.user) {
      // For logged-in users
      const userId = req.session.user.id;
      const cartItemIndex = carts.findIndex(c => c.user_id === userId && c.book_id === parseInt(book_id));
      
      if (cartItemIndex !== -1) {
        carts.splice(cartItemIndex, 1);
        setSuccess(req, 'Item removed from cart.');
      } else {
        setError(req, 'Item not found in cart.');
      }
    } else {
      // For non-logged users (session cart)
      if (req.session.cart && req.session.cart.length > 0) {
        const cartItemIndex = req.session.cart.findIndex(item => item.book_id === parseInt(book_id));
        
        if (cartItemIndex !== -1) {
          req.session.cart.splice(cartItemIndex, 1);
          setSuccess(req, 'Item removed from cart.');
        } else {
          setError(req, 'Item not found in cart.');
        }
      } else {
        setError(req, 'Cart is empty.');
      }
    }
  } catch (err) {
    console.error(err);
    setError(req, 'Failed to remove item from cart.');
  }
  
  res.redirect('/cart');
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found | ShelfWise', currentPage: '404' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('404', { 
    title: 'Server Error | ShelfWise',
    message: 'Something went wrong!' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ShelfWise server running on http://localhost:${PORT}`);
});
