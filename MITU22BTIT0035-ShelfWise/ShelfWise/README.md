# ShelfWise - Book Review and Buying Platform

A complete full-stack web application built with Node.js, Express.js, EJS, and MySQL that provides a book review and buying platform with responsive design and comprehensive CRUD operations.

## 🎨 Color Scheme
- Primary Brown: `#9e7c5f`
- Dark Brown: `#6f5840` 
- Sage Green: `#658c5e`
- Light Sage: `#91a287`
- Cream: `#fff0d6`

## 🚀 Features

### Core Functionality
- **Responsive Design**: Bootstrap-based responsive layout with custom CSS
- **User Authentication**: Registration and Login with password hashing
- **Book Catalog**: Browse and search through book collections
- **Shopping Cart**: Full CRUD operations (Create, Read, Update, Delete)
- **Contact Form**: Submit inquiries stored in database
- **Session Management**: Secure user sessions with Express Session

### Technical Features
- **Full-Stack Architecture**: Node.js backend, EJS templating, MySQL database
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling with flash messages
- **Security**: Password hashing with bcrypt, session security

## 📋 Requirements Met

✅ **EJS Templates**: Dynamic server-side rendering  
✅ **Express.js**: RESTful routing and middleware  
✅ **MySQL Database**: Complete database integration  
✅ **Body Parser**: Form data parsing (Express built-in)  
✅ **CRUD Operations**: Full Create, Read, Update, Delete  
✅ **Registration**: User account creation with validation  
✅ **Login**: User authentication with sessions  
✅ **Cart Management**: Shopping cart with full CRUD  
✅ **Responsive Design**: Bootstrap + Media Queries  
✅ **Contact Form**: Database storage of inquiries  

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Quick Setup (No Database Required)

This project has been simplified to work without external database setup. All data is stored in memory for easy demonstration.

1. **Install Dependencies**
   ```bash
   cd ShelfWise
   npm install
   ```

2. **Start the Application**
   ```bash
   npm start
   ```
   
   Or for development:
   ```bash
   npm run dev
   ```

3. **Access the Application**
   
   Open browser and go to: `http://localhost:3000`

### ✨ Features Ready to Use:
- ✅ **Books Catalog**: Pre-loaded with sample books
- ✅ **User Registration**: Create accounts (stored in memory)
- ✅ **User Login**: Secure authentication with password hashing
- ✅ **Shopping Cart**: Full CRUD operations
- ✅ **Contact Form**: Submit inquiries
- ✅ **Responsive Design**: Works on all devices

## 🗄️ Data Structure

### In-Memory Data Storage

The application uses JavaScript arrays to simulate database tables for easy setup:

1. **users[]** - User accounts
   - `id`, `name`, `email`, `password_hash`, `created_at`

2. **books[]** - Book catalog (pre-loaded)
   - `id`, `title`, `author`, `description`
   - `price`, `rating`, `genre`, `image_url`, `stock_quantity`

3. **carts[]** - Shopping cart items
   - `id`, `user_id`, `book_id`, `quantity`, `created_at`

4. **contacts[]** - Contact form submissions
   - `id`, `name`, `email`, `message`, `created_at`

**Note**: Data resets when server restarts (perfect for development/demo)

## 🎯 API Endpoints

### Authentication Routes
- `GET /register` - Registration form
- `POST /register` - Create new user (CRUD: CREATE)
- `GET /login` - Login form  
- `POST /login` - Authenticate user (CRUD: READ)
- `GET /logout` - Destroy session

### Core Routes
- `GET /` - Home page with featured books
- `GET /books` - All books listing (CRUD: READ)
- `GET /about` - About page
- `GET /contact` - Contact form
- `POST /contact` - Submit inquiry (CRUD: CREATE)

### Cart Management Routes
- `GET /cart` - View cart items (CRUD: READ)
- `POST /cart/add` - Add book to cart (CRUD: CREATE)
- `POST /cart/update` - Update item quantity (CRUD: UPDATE)
- `POST /cart/delete` - Remove item from cart (CRUD: DELETE)

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first approach** using Bootstrap 5
- **Custom CSS** with media queries
- **Flexible grid system** for all screen sizes
- **Touch-friendly** buttons and forms
- **Optimized images** and content layout

## 🔐 Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **Session Management**: Express Session with secure configuration
- **Input Validation**: Both client and server-side validation
- **SQL Injection Protection**: Prepared statements with mysql2
- **XSS Protection**: EJS automatic HTML escaping

## 🧪 Testing

### Manual Testing Checklist

**Registration & Authentication:**
- [ ] Register new user account
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout functionality

**Book Operations:**
- [ ] View home page with featured books
- [ ] Browse all books page
- [ ] View book details with ratings and genres

**Cart Operations (CRUD):**
- [ ] Add books to cart (CREATE)
- [ ] View cart contents (READ) 
- [ ] Update item quantities (UPDATE)
- [ ] Remove items from cart (DELETE)

**Contact Form:**
- [ ] Submit contact inquiry
- [ ] Verify form validation

**Responsive Design:**
- [ ] Test on mobile devices
- [ ] Test on tablet devices
- [ ] Test on desktop

## 📁 Project Structure

```
ShelfWise/
├── app.js                 # Main application server
├── package.json           # Dependencies and scripts
├── database.sql          # Database schema and sample data
├── .env                  # Environment configuration
├── config/
│   └── database.js       # Database connection
├── public/
│   └── css/
│       └── style.css     # Custom styles with color scheme
└── views/
    ├── index.ejs         # Home page
    ├── books.ejs         # Books listing
    ├── cart.ejs          # Shopping cart
    ├── login.ejs         # Login form
    ├── register.ejs      # Registration form
    ├── contact.ejs       # Contact form
    ├── about.ejs         # About page
    └── 404.ejs           # Error page
```

## 🎓 Academic Requirements Fulfilled

This project demonstrates a **complete full-stack web development experience** including:

1. **Frontend Technologies:**
   - HTML5, CSS3, Bootstrap 5
   - Responsive design with media queries
   - EJS templating engine
   - Interactive JavaScript

2. **Backend Technologies:**
   - Node.js runtime environment
   - Express.js web framework
   - RESTful API design
   - Session management

3. **Database Integration:**
   - MySQL database design
   - CRUD operations implementation
   - Foreign key relationships
   - Data validation and integrity

4. **Development Practices:**
   - MVC architecture pattern
   - Error handling and logging
   - Security best practices
   - Environment configuration

## 🚀 Production Deployment

For production deployment, consider:

1. **Environment Variables**: Use production database credentials
2. **HTTPS**: Enable SSL/TLS certificates  
3. **Process Management**: Use PM2 or similar
4. **Database**: Use production MySQL server
5. **Static Assets**: Implement CDN for better performance

## 📝 License

This project is created for educational purposes as part of a Full Stack Development course.

## 👥 Contributors

- **ShelfWise Development Team**
- Built as a semester project demonstrating full-stack web development skills

---

**© 2024 ShelfWise. All rights reserved.**  
*Built with Node.js, Express.js, EJS & MySQL*