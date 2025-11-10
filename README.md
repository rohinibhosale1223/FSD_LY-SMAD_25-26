# Online Learning Platform

# 🎓 LearnHub - Online Learning Platform

A comprehensive online learning platform built with Node.js, Express.js, and SQLite. This platform provides a complete e-learning solution with user authentication, course management, shopping cart functionality, and more.

## ✨ Features

### 🔐 User Authentication
- User registration and login
- Password hashing with bcrypt
- Session-based authentication
- User profile management
- Role-based access control

### 📚 Course Management
- Browse courses with search and filtering
- Course categories and levels
- Course details with ratings and reviews
- Course enrollment system
- User progress tracking

### 🛒 Shopping Cart
- Add courses to cart
- Remove items from cart
- Checkout process
- Course purchase history

### 👤 User Dashboard
- Personal profile management
- Enrolled courses overview
- Learning progress tracking
- Learning statistics

### 🎨 Modern UI/UX
- Responsive Bootstrap design
- Interactive course cards
- Professional styling
- Mobile-friendly interface

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd online-learning-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Deployment

1. **Set environment variables**
   ```bash
   export NODE_ENV=production
   export PORT=3000
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
online-learning-platform/
├── config/
│   ├── database.js         # SQLite database configuration
│   └── middleware.js       # Custom middleware functions
├── data/
│   └── learning_platform.db # SQLite database file
├── public/
│   ├── css/
│   │   └── style.css       # Custom styles
│   ├── images/             # Course and user images
│   └── js/
│       └── main.js         # Client-side JavaScript
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── cart.js            # Shopping cart routes
│   ├── courses.js         # Course management routes
│   ├── home.js            # Home page routes
│   ├── about.js           # About page routes
│   └── contact.js         # Contact page routes
├── views/
│   ├── partials/
│   │   ├── navbar.ejs     # Navigation bar
│   │   └── footer.ejs     # Footer
│   ├── home.ejs           # Home page
│   ├── courses.ejs        # Course listing
│   ├── course-details.ejs # Individual course page
│   ├── cart.ejs           # Shopping cart
│   ├── login.ejs          # Login form
│   ├── register.ejs       # Registration form
│   ├── profile.ejs        # User profile
│   ├── my-courses.ejs     # User's enrolled courses
│   ├── 404.ejs           # 404 error page
│   └── error.ejs         # General error page
├── package.json           # Project dependencies
├── server.js             # Main application file
└── README.md             # This file
```

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **SQLite3** - Database
- **Express-session** - Session management
- **bcryptjs** - Password hashing
- **Express-validator** - Input validation
- **Connect-flash** - Flash messages

### Frontend
- **EJS** - Template engine
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icons
- **Custom CSS** - Additional styling

### Development Tools
- **Nodemon** - Development server
- **Body-parser** - Request parsing
- **Multer** - File uploads (future use)

## 🗄️ Database Schema

The application uses SQLite with the following tables:

### Users
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (student/admin)
- `avatar` - Profile picture URL
- `created_at` - Registration timestamp
- `updated_at` - Last modification timestamp

### Courses
- `id` - Primary key
- `title` - Course title
- `description` - Course description
- `instructor` - Instructor name
- `category` - Course category
- `price` - Course price
- `rating` - Average rating
- `students` - Number of enrolled students
- `image` - Course thumbnail URL
- `duration` - Course duration
- `level` - Difficulty level
- `created_at` - Creation timestamp
- `updated_at` - Last modification timestamp

### Enrollments
- `id` - Primary key
- `user_id` - Foreign key to users
- `course_id` - Foreign key to courses
- `enrolled_at` - Enrollment timestamp
- `progress` - Course completion percentage

### Cart Items
- `id` - Primary key
- `user_id` - Foreign key to users
- `course_id` - Foreign key to courses
- `added_at` - Addition timestamp

## 🔧 API Endpoints

### Authentication
- `GET /auth/login` - Login page
- `POST /auth/login` - Process login
- `GET /auth/register` - Registration page
- `POST /auth/register` - Process registration
- `GET /auth/logout` - Logout user
- `GET /auth/profile` - User profile page
- `POST /auth/profile` - Update profile

### Courses
- `GET /courses` - List all courses
- `GET /courses/:id` - Course details
- `POST /courses/:id/enroll` - Enroll in course
- `GET /courses/my/enrolled` - User's enrolled courses

### Shopping Cart
- `GET /cart` - View cart
- `POST /cart/add` - Add course to cart
- `POST /cart/remove` - Remove course from cart
- `POST /cart/clear` - Clear entire cart
- `POST /cart/checkout` - Process checkout

### Other Pages
- `GET /` - Home page
- `GET /about` - About page
- `GET /contact` - Contact page

## 🔒 Security Features

- **Password Hashing** - Using bcryptjs with salt rounds
- **Session Security** - Secure session configuration
- **Input Validation** - Server-side validation using express-validator
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Input sanitization
- **CSRF Protection** - Built-in Express protection

## 🎯 Future Enhancements

- [ ] Video streaming capabilities
- [ ] Interactive quizzes and assignments
- [ ] Discussion forums
- [ ] Certificate generation
- [ ] Payment gateway integration
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Social media integration
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Bootstrap team for the amazing CSS framework
- Font Awesome for the beautiful icons
- Express.js community for the excellent documentation
- All contributors who helped improve this project

---

## 🚨 Important Notes

1. **Database**: The SQLite database is automatically created when you first run the application
2. **Sample Data**: Sample courses are automatically inserted on first run
3. **Images**: Place course images in the `public/images/` directory
4. **Environment**: Set `NODE_ENV=production` for production deployment
5. **Security**: Change the session secret in production environments

For any issues or questions, please open an issue on GitHub or contact the maintainer. This platform provides a modern, responsive interface for educational content delivery.

## 🚀 Features

- **Responsive Design**: Built with Bootstrap 5 and custom CSS with media queries
- **Modular Architecture**: Clean, organized Node.js backend with modular routing
- **Modern UI**: Professional design with animations and interactive elements
- **SEO Friendly**: Optimized structure and meta tags
- **Accessibility**: WCAG compliant design elements

## 📋 Pages

- **Home Page**: Featured courses, hero section, and platform statistics ✅
- **About Us Page**: Platform information (placeholder) 📝
- **Contact Us Page**: Contact form and information (placeholder) 📝
- **Cart Page**: Shopping cart for courses (placeholder) 📝
- **Login Page**: User authentication (placeholder) 📝
- **Registration Page**: User registration (placeholder) 📝

## 🛠 Technical Stack

- **Backend**: Node.js with Express.js
- **View Engine**: EJS (Embedded JavaScript)
- **Frontend**: Bootstrap 5, Custom CSS, Font Awesome
- **Architecture**: MVC pattern with modular routing

## 📁 Project Structure

```
online-learning-platform/
├── config/                 # Configuration files
├── public/                 # Static assets
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   └── images/            # Images and media
├── routes/                # Express routes
│   ├── home.js           # Home page routes
│   ├── about.js          # About page routes
│   ├── contact.js        # Contact page routes
│   ├── cart.js           # Cart page routes
│   └── auth.js           # Authentication routes
├── views/                 # EJS templates
│   ├── partials/         # Reusable components
│   │   ├── navbar.ejs    # Navigation bar
│   │   └── footer.ejs    # Footer
│   ├── home.ejs          # Home page template
│   ├── about.ejs         # About page template
│   ├── contact.ejs       # Contact page template
│   ├── cart.ejs          # Cart page template
│   ├── login.ejs         # Login page template
│   └── register.ejs      # Registration page template
├── package.json          # Dependencies and scripts
└── server.js            # Main application file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd online-learning-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   Or for production:
   ```bash
   npm start
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

## 📱 Responsive Design

The platform is fully responsive and optimized for:

- **Desktop** (1200px and above)
- **Tablet** (768px - 1199px)
- **Mobile** (576px - 767px)
- **Small Mobile** (below 576px)

### Media Queries Implementation

Custom CSS includes comprehensive media queries for:
- Navigation adaptations
- Typography scaling
- Layout adjustments
- Touch-friendly interfaces

## 🎨 UI Components

### Home Page Features
- **Hero Section**: Eye-catching introduction with call-to-action
- **Statistics Display**: Platform metrics and achievements
- **Featured Courses**: Course cards with ratings and pricing
- **Features Section**: Platform benefits and capabilities
- **Responsive Navigation**: Mobile-friendly menu system

### Interactive Elements
- Smooth scrolling navigation
- Hover effects on cards and buttons
- Loading states and animations
- Toast notifications system
- Back-to-top functionality

## 🔧 Customization

### Styling
- Edit `/public/css/style.css` for custom styles
- CSS variables available for easy theme customization
- Bootstrap utility classes for rapid development

### Content
- Modify `/routes/home.js` to update course data
- Edit EJS templates in `/views/` for content changes
- Update navigation in `/views/partials/navbar.ejs`

## 📈 Performance Features

- **Lazy Loading**: Images load only when needed
- **Optimized Assets**: Minified CSS and JS
- **Efficient Routing**: Modular route handling
- **Caching Headers**: Static asset optimization

## 🔐 Security Considerations

- Input validation middleware ready
- CSRF protection setup prepared
- Secure headers configuration
- Environment variable support

## 🚧 Development Roadmap

### Phase 1: Core Features (Current)
- [x] Responsive home page
- [x] Navigation and routing
- [x] Basic page templates
- [x] Styling and animations

### Phase 2: Authentication
- [ ] User registration system
- [ ] Login/logout functionality
- [ ] Password recovery
- [ ] Session management

### Phase 3: Course Management
- [ ] Course catalog
- [ ] Shopping cart functionality
- [ ] Payment integration
- [ ] User dashboard

### Phase 4: Advanced Features
- [ ] Course progress tracking
- [ ] Video streaming
- [ ] Quizzes and assessments
- [ ] Certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: info@learnhub.com
- Phone: +1 (555) 123-4567

## 🙏 Acknowledgments

- Bootstrap team for the excellent CSS framework
- Font Awesome for the comprehensive icon library
- Express.js community for the robust web framework