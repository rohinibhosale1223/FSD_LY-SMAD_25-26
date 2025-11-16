# MTANKS Learning Platform

A responsive learning platform web application built with modern web technologies, featuring a comprehensive landing page for MTANKS technology company.

## 🚀 Features

### Responsive Design
- **Mobile-first approach** with Bootstrap 5
- **Custom CSS** with advanced media queries
- **Smooth animations** and transitions
- **Cross-browser compatibility**

### Rich Animations & Interactions
- **AOS (Animate On Scroll)** library integration
- **Custom CSS animations** and keyframes
- **Hover effects** and micro-interactions
- **Parallax scrolling** effects
- **Floating particle** animations

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Bootstrap 5.3.0
- **Backend**: Node.js with Express.js
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Poppins)
- **Animations**: AOS (Animate On Scroll)

### Pages & Sections
1. **Home Page** (`index.html`)
   - Hero section with floating cards
   - About section with statistics
   - Services showcase
   - Learning platform features
   - Contact form

2. **About Page** (`about.html`)
   - Company mission & vision
   - Team members showcase
   - Core values
   - Company statistics

3. **Services Page** (`services.html`)
   - Detailed service descriptions
   - Technology stack tags
   - Service highlights
   - Learning platform services

4. **Contact Page** (`contact.html`)
   - Contact information cards
   - Comprehensive contact form
   - FAQ section
   - Social media links

## 🎨 Design Features

### Color Scheme
- **Primary**: #6366f1 (Indigo)
- **Secondary**: #f59e0b (Amber)
- **Accent**: #10b981 (Emerald)
- **Gradients**: Linear gradients throughout

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Responsive typography** with fluid scaling

### Layout
- **CSS Grid** and **Flexbox** for layouts
- **Bootstrap Grid System** for responsiveness
- **Custom CSS variables** for consistency
- **Mobile-first** responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone or download** the project files
2. **Navigate** to the project directory:
   ```bash
   cd /path/to/mtanks-learning-platform
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

5. **Open your browser** and visit:
   ```
   http://localhost:3000
   ```

### Development Mode
For development with auto-restart:
```bash
npm run dev
```

## 📱 Responsive Breakpoints

- **Extra Small**: < 576px (Mobile Portrait)
- **Small**: 576px - 767px (Mobile Landscape)
- **Medium**: 768px - 991px (Tablets)
- **Large**: 992px - 1199px (Desktop)
- **Extra Large**: ≥ 1200px (Large Desktop)

## 🎯 Key Features

### Performance Optimizations
- **Lazy loading** for images
- **Throttled scroll events** for better performance
- **Optimized animations** with reduced motion support
- **Minified assets** for production

### Accessibility
- **Semantic HTML** structure
- **ARIA labels** and roles
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Reduced motion** preferences

### SEO Optimization
- **Meta tags** and descriptions
- **Structured data** markup
- **Semantic HTML** elements
- **Fast loading** times

## 🛠️ Customization

### CSS Variables
The project uses CSS custom properties for easy theming:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #f59e0b;
    --accent-color: #10b981;
    /* ... more variables */
}
```

### Adding New Pages
1. Create HTML file in `public/` directory
2. Add route in `server.js`
3. Include navigation links
4. Apply consistent styling

### Modifying Animations
- **AOS animations**: Modify `data-aos` attributes
- **CSS animations**: Update keyframes in `style.css`
- **JavaScript animations**: Modify `script.js`

## 📦 Project Structure

```
mtanks-learning-platform/
├── public/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   ├── js/
│   │   └── script.js          # JavaScript functionality
│   ├── images/                # Image assets
│   ├── index.html             # Home page
│   ├── about.html             # About page
│   ├── services.html          # Services page
│   └── contact.html           # Contact page
├── server.js                  # Express server
├── package.json               # Dependencies
└── README.md                  # Documentation
```

## 🌟 Highlights

### Modern Web Standards
- **ES6+ JavaScript** features
- **CSS Grid** and **Flexbox**
- **CSS Custom Properties**
- **Modern CSS** selectors

### Interactive Elements
- **Smooth scrolling** navigation
- **Form validation** and submission
- **Dynamic content** loading
- **Real-time animations**

### Professional Design
- **Clean, modern** aesthetic
- **Consistent branding** throughout
- **Professional color** scheme
- **High-quality** typography

## 🔧 Browser Support

- **Chrome** 60+
- **Firefox** 60+
- **Safari** 12+
- **Edge** 79+

## 📄 License

This project is licensed under the MIT License - see the package.json file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support and questions:
- **Email**: info@mtanks.com
- **Phone**: +1 (555) 123-4567
- **Website**: [MTANKS Learning Platform](http://localhost:3000)

---

**MTANKS** - Transforming businesses through innovative technology solutions and comprehensive learning platforms.
