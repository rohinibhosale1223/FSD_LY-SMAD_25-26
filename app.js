const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

const MONGO_URI = 'mongodb://127.0.0.1:27017/wheelworks';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- 2. USER MODEL (SCHEMA) ---
// This defines what a 'User' looks like in our database
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // No two users can have the same email
    },
    password: {
        type: String,
        required: true
    }
});
const User = mongoose.model('User', userSchema);


// --- 3. MIDDLEWARE SETUP ---
// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Body parser: This is new! It lets us read data from forms (req.body)
app.use(express.urlencoded({ extended: true }));

// Session setup: This is also new!
app.use(session({
    secret: 'a-very-secret-key-for-wheelworks', // Change this to a random string
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI })
}));

// This is custom middleware. It makes the 'userId' available in ALL EJS files.
// This is how we'll know if a user is logged in or not in the navbar.
app.use((req, res, next) => {
    res.locals.userId = req.session.userId;
    next();
});


// --- 4. SAMPLE PRODUCT DATA (Unchanged) ---
const featuredAccessories = [
    { name: 'Aero-Dynamic Helmet', description: 'Stay safe and stylish with our top-rated, ventilated helmet.', image: '/images/helmet.png' },
    { name: 'Titanium U-Lock', description: 'Ultimate security for your bike with this lightweight titanium lock.', image: '/images/lock.png' },
    { name: 'BrightBeam LED Lights', description: 'See and be seen with these ultra-bright, rechargeable LED lights.', image: '/images/light.png' },
    { name: 'Pro-Grip Gloves', description: 'Enhance your comfort and grip with these durable, padded gloves.', image: '/images/gloves.png' }
];

// --- 5. GET ROUTES (Pages) ---
// These are mostly the same, but now they automatically get the 'userId'
app.get('/', (req, res) => {
    res.render('home', {
        title: 'WheelWorks - Your Bike Accessory Store',
        products: featuredAccessories
    });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us - WheelWorks' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us - WheelWorks' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login - WheelWorks' });
});

app.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign Up - WheelWorks' });
});

app.get('/cart', (req, res) => {
    res.render('cart', {
        title: 'Your Cart - WheelWorks',
        cartItems: []
    });
});

// --- 6. POST ROUTES (Form Handling) ---

// SIGN UP (REGISTER) ROUTE
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            // We should add an error message here later
            return res.redirect('/signup');
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        });
        await newUser.save();

        // **This is the auto-login!**
        // We set the session ID to the new user's ID
        req.session.userId = newUser._id;

        // Redirect to the home page as a logged-in user
        res.redirect('/');

    } catch (err) {
        console.log(err);
        res.redirect('/signup');
    }
});

// LOGIN ROUTE
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by their email
        const user = await User.findOne({ email: email });
        if (!user) {
            // User not found
            return res.redirect('/login');
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Password incorrect
            return res.redirect('/login');
        }

        // Login successful: Store user ID in session
        req.session.userId = user._id;
        res.redirect('/');

    } catch (err) {
        console.log(err);
        res.redirect('/login');
    }
});

// LOGOUT ROUTE
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid'); // Clears the session cookie
        res.redirect('/');
    });
});


// --- 7. START THE SERVER (Unchanged) ---
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});