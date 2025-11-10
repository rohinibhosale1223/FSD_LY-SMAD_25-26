# PhotoStore - Photography Gallery and Marketplace

A modern, responsive web application for showcasing and selling photography. This project is built with Node.js, Express, EJS, and Bootstrap 5.

## Features

- **Responsive Design**: Looks great on all devices
- **Interactive Gallery**: Filter photos by category
- **Shopping Cart**: Add/remove items and adjust quantities
- **User Authentication**: Login and registration system (frontend only)
- **Contact Form**: With client and server-side validation
- **Animations**: Smooth transitions and hover effects
- **No Database**: Uses in-memory storage for simplicity

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd PhotoStore
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node app.js
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Project Structure

```
PhotoStore/
├── public/               # Static files
│   ├── css/              # Stylesheets
│   ├── js/               # Client-side JavaScript
│   └── images/           # Image assets
├── views/                # EJS templates
│   ├── layouts/          # Layout templates
│   └── *.ejs             # Page templates
├── app.js                # Main application file
└── package.json          # Project configuration
```

## Available Routes

- `GET /` - Home page with featured photos
- `GET /gallery` - Browse all photos with filters
- `GET /about` - About us page
- `GET /contact` - Contact form
- `GET /login` - User login/registration
- `GET /cart` - Shopping cart

## API Endpoints

- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `POST /api/contact` - Submit contact form

## Customization

- Update the `public/css/style.css` file for custom styles
- Add your own images to the `public/images` directory
- Modify the EJS templates in the `views` directory

## License

This project is open source and available under the [MIT License](LICENSE).
