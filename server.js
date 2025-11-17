// server.js
const express = require("express");
const session = require("express-session");
const path = require("path");
const mysql = require("mysql2");

const app = express();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));


app.use(
  session({
    secret: "revvedRiderSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 2 },
  })
);


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "revved_riders",
});

db.connect((err) => {
  if (err) console.error("MySQL connection failed:", err);
  else console.log("Connected to MySQL (revved)");
});

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.cart = req.session.cart || [];
  res.locals.cartCount = req.session.cart ? req.session.cart.length : 0;
  next();
});


function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.cartCount = req.session.cart ? req.session.cart.length : 0;
  next();
});



app.get("/login", (req, res) => {
  if (req.session.user) return res.redirect("/");
  res.render("pages/login", { title: "Login", error: null });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (err) {
        console.error("Login error:", err);
        return res.render("pages/login", { title: "Login", error: "Database error" });
      }
      if (results.length > 0) {
        const user = results[0];
        req.session.user = { name: user.name, email: user.email };
        if (!req.session.cart) req.session.cart = [];
        console.log("Login success:", user.email);
        return res.redirect("/");
      }
      res.render("pages/login", { title: "Login", error: "Invalid credentials" });
    }
  );
});

app.get("/register", (req, res) => {
  if (req.session.user) return res.redirect("/");
  res.render("pages/register", { title: "Register", error: null });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.render("pages/register", { title: "Register", error: "Fill all fields" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Register error:", err);
      return res.render("pages/register", { title: "Register", error: "Database error" });
    }

    if (results.length > 0) {
      return res.render("pages/register", { title: "Register", error: "User already exists" });
    }

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password],
      (err) => {
        if (err) {
          console.error("Insert error:", err);
          return res.render("pages/register", { title: "Register", error: "Database error" });
        }
        console.log("Registered new user:", email);
        res.redirect("/login");
      }
    );
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error("Session destroy error:", err);
    res.redirect("/login");
  });
});


app.get("/", (req, res) => res.render("pages/index", { title: "Home" }));
app.get("/bikes", (req, res) => res.render("pages/bikes", { title: "Bikes" }));
app.get("/products", (req, res) => res.render("pages/products", { title: "Products" }));
app.get("/contact", (req, res) => res.render("pages/contact", { title: "Contact" }));
app.get("/about", (req, res) => res.render("pages/about", { title: "About" }));


app.get("/cart", requireLogin, (req, res) => {
  const cart = req.session.cart || [];
  res.render("pages/cart", { title: "Your Cart", cart, message: null });
});

app.post("/add-to-cart", requireLogin, (req, res) => {
  const { name, price, image } = req.body;
  if (!req.session.cart) req.session.cart = [];
  req.session.cart.push({ name, price: parseFloat(price), image });
  console.log("Added to cart:", name);
  res.redirect("/products");
});

app.post("/remove-item", requireLogin, (req, res) => {
  const { index } = req.body;
  if (req.session.cart && req.session.cart.length > index) {
    req.session.cart.splice(index, 1);
  }
  res.redirect("/cart");
});

app.post("/checkout", requireLogin, (req, res) => {
  req.session.cart = [];
  res.render("pages/cart", {
    title: "Your Cart",
    cart: [],
    message: "Checkout successful! Thank you.",
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
