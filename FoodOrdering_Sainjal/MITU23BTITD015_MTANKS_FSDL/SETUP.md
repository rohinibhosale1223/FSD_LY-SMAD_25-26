# MTANKS Authentication System Setup Guide

This guide will help you set up the complete authentication system with SQL database for your MTANKS project.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup

#### Option A: Using MySQL (Recommended)
1. **Install MySQL Server**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP/MAMP for easy setup

2. **Create Database**
   ```sql
   CREATE DATABASE mtanks_db;
   ```

3. **Update Database Configuration** (if needed)
   Edit `database.js` and update the connection details:
   ```javascript
   const dbConfig = {
       host: 'localhost',
       user: 'root',
       password: 'your_password',
       database: 'mtanks_db',
       port: 3306
   };
   ```

#### Option B: Using XAMPP (Easiest)
1. Download and install XAMPP
2. Start Apache and MySQL services
3. Open phpMyAdmin (http://localhost/phpmyadmin)
4. Create a new database named `mtanks_db`
5. The default configuration should work

### 3. Start the Server
```bash
npm start
```

The server will automatically:
- Test database connection
- Create required tables
- Start on http://localhost:3000

## 📁 Project Structure

```
MTANKS/
├── public/
│   ├── index.html          # Main homepage with auth navigation
│   ├── login.html          # Login page
│   ├── register.html       # Registration page
│   ├── dashboard.html      # User dashboard
│   └── css/
│       └── style.css          # Custom styles
├── routes/
│   └── auth.js             # Authentication API routes
├── middleware/
│   └── auth.js             # Authentication middleware
├── database.js             # Database connection and setup
├── server.js               # Main server file
└── package.json            # Dependencies
```

## 🔐 Authentication Features

### ✅ Implemented Features
- **User Registration** with form validation
- **User Login** with session management
- **Password Hashing** using bcryptjs
- **Session Management** with express-session
- **User Dashboard** with profile information
- **Logout Functionality**
- **Navigation Updates** based on auth status
- **Form Validation** on both client and server
- **Error Handling** with user-friendly messages

### 🗄️ Database Schema

The system automatically creates these tables:

#### `users` table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password` (Hashed)
- `first_name`
- `last_name`
- `phone`
- `created_at`
- `updated_at`
- `is_active`

#### `user_profiles` table
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `bio`
- `company`
- `job_title`
- `website`
- `location`
- `avatar_url`

#### `user_sessions` table
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `session_token`
- `expires_at`

## 🌐 API Endpoints

### Authentication Routes (`/api/auth/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | User registration |
| POST | `/login` | User login |
| POST | `/logout` | User logout |
| GET | `/check` | Check auth status |
| GET | `/profile` | Get user profile |
| PUT | `/profile` | Update user profile |
| PUT | `/change-password` | Change password |

## 🎨 Pages

### Public Pages
- **Homepage** (`/`) - Main landing page with dynamic navigation
- **Login** (`/login`) - User login form
- **Register** (`/register`) - User registration form

### Protected Pages
- **Dashboard** (`/dashboard`) - User dashboard (requires authentication)

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file in the root directory:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mtanks_db
DB_PORT=3306
SESSION_SECRET=your-super-secret-session-key
PORT=3000
```

### Session Configuration
Sessions are configured with:
- 24-hour expiration by default
- 30-day expiration with "Remember Me"
- Secure cookies (set to true in production)

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with 12 salt rounds
- **Session Security**: Express sessions with secure cookies
- **Input Validation**: Both client and server-side validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Restricted origins
- **XSS Protection**: Input sanitization

## 🚨 Troubleshooting

### Database Connection Issues
1. Ensure MySQL is running
2. Check database credentials in `database.js`
3. Verify database `mtanks_db` exists
4. Check MySQL port (default: 3306)

### Session Issues
1. Clear browser cookies
2. Check session secret configuration
3. Ensure cookies are enabled

### Common Errors
- **"Database connection failed"**: Check MySQL server status
- **"User already exists"**: Email/username already registered
- **"Invalid credentials"**: Check email/password combination

## 📱 Usage

### For Users
1. Visit http://localhost:3000
2. Click "Register" to create an account
3. Fill out the registration form
4. Login with your credentials
5. Access your dashboard

### For Developers
1. All authentication logic is in `routes/auth.js`
2. Middleware functions are in `middleware/auth.js`
3. Database operations are in `database.js`
4. Frontend authentication handling is in the HTML files

## 🔄 Next Steps

### Potential Enhancements
- Email verification system
- Password reset functionality
- Two-factor authentication
- Admin panel
- User roles and permissions
- Social login integration
- Profile picture upload

### Production Deployment
1. Set secure session cookies
2. Use environment variables for secrets
3. Set up SSL/HTTPS
4. Configure proper CORS origins
5. Use a production database
6. Set up monitoring and logging

## 📞 Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify database connection
3. Ensure all dependencies are installed
4. Check that MySQL is running

## 🎉 Success!

Once everything is set up, you'll have:
- ✅ Complete user registration system
- ✅ Secure login/logout functionality
- ✅ User dashboard with profile management
- ✅ Dynamic navigation based on auth status
- ✅ Full SQL database integration
- ✅ Professional UI/UX design

Your MTANKS authentication system is now ready to use! 🚀






