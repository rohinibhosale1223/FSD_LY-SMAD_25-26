const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();

// get the client
var mysql = require("mysql2");

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "vikrant01",
  password: "vicky@123",
  database: "test_db",
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "turbotalks-secret",
    resave: false,
    saveUninitialized: false,
  })
);

function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  return res.redirect("/login");
}

app.get("/login", (req, res) => {
  if (req.session.user) return res.redirect("/");
  res.render("pages/login", { error: null });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render("pages/login", {
      error: "Please enter both email and password.",
    });
  }
  const sql = `SELECT * FROM logindb WHERE email = ?`;
  connection.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Database Fetch Error:", err);
      return res.render("pages/login", {
        error: "Database error. Please try again later.",
      });
    }
    if (results.length === 0) {
      return res.render("pages/login", {
        error: "No user found with this email.",
      });
    }
    const user = results[0];
    if (user.password === password) {
      console.log("Login successful:", user.email);
      req.session.user = user.email;
      return res.redirect("/");
    } else {
      console.log("Invalid password for:", user.email);
      return res.render("pages/login", {
        error: "Invalid password. Please try again.",
      });
    }
  });
});

app.get("/register", (req, res) => {
  if (req.session.user) return res.redirect("/");
  res.render("pages/register", { error: null });
});

app.post("/register", (req, res) => {
  const { fullname, email, password, confirmpassword, phone, state } = req.body;
  if (
    !fullname ||
    !email ||
    !password ||
    !confirmpassword ||
    !phone ||
    !state
  ) {
    return res.render("pages/register", { error: "All fields are required" });
  }
  if (password !== confirmpassword) {
    return res.render("pages/register", { error: "Passwords do not match" });
  }
  const sql = `INSERT INTO registerdb (fullname, email, password, confirmpassword, phone, state)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [fullname, email, password, confirmpassword, phone, state];
  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error("Database Insert Error:", err);
      return res.render("pages/register", {
        error: "Database error, please try again.",
      });
    }
    console.log("Registration successful!", results);
    req.session.user = email;
    res.redirect("/");
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

app.get("/", isAuthenticated, (req, res) => {
  res.render("pages/index");
});

app.get("/news", isAuthenticated, (req, res) => {
  const newsList = [
    {
      date: "Mar 25, 2025",
      image: "/assets/news1.jpg",
      title: "Automotive advertising - fact or fiction?",
      description:
        "It’s high time the automobile industry tightens up its advertising claim",
    },
    {
      date: "Mar 18, 2025",
      image: "/assets/news2.jpg",
      title: "India's new EV policy offers a level playing field",
      description:
        "New and existing players will be able to benefit from this policy and schemes",
    },
    {
      date: "Oct 28, 2025",
      image: "/assets/news3.webp",
      title: "Honda 0 Series SUV to launch in India in 2026",
      description:
        "The all-electric SUV will be imported to India as a completely built unit (CBU).",
    },
    {
      date: "Oct 24, 2025",
      image: "/assets/news4.avif",
      title: "Yamaha to showcase radical EV",
      description: "Hybrid two-wheeler concepts at Tokyo Motor Show",
    },
    {
      date: "Oct 15, 2025",
      image: "/assets/news5.avif",
      title: "Nitin Kohli on demand for premium Volkswagens",
      description:
        "TIn conversation with Autocar India, Volkswagen India's new Brand Director Nitin Kohli talks of his focus areas, developing VW's image, GST impact on sales and more.",
    },
    {
      date: "Sept 05, 2025",
      image: "/assets/news6.webp",
      title: "2026 Porsche 911 Turbo S video review",
      description:
        "The Porsche 911 Turbo S has got an overhaul and is now a whole different beast. What's changed, and how does it all come together",
    },
    {
      date: "Aug 20, 2025",
      image: "/assets/news7.avif",
      title:
        "Maruti Baleno turns 10: evolution of India's most successful premium hatchback",
      description:
        "Ten years on, Baleno still defines success in India’s hatchback market.",
    },
    {
      date: "Sept 07, 2025",
      image: "/assets/news8.avif",
      title: "Italian GT Sprint: Mahaveer Raghunathan wins at Monza",
      description:
        "TRaghunathan and co-driver Ferrari also finish runners up in the GT3 Pro-Am class of the championship.",
    },
    {
      date: "Sept 10, 2025",
      image: "/assets/news9.avif",
      title: "2025 Tata Sierra to launch on November 25",
      description:
        "The new Sierra will slot above the Curvv and compete with the Hyundai Creta, Maruti Grand Vitara and other midsize SUVs.",
    },
  ];
  res.render("pages/news", { newsList });
});

app.get("/reviews", isAuthenticated, (req, res) => {
  const reviewsList = [
    {
      title: "Toyota Innova HyCross – Petrol GX Variant | Auto Expo 2023",
      video: "https://www.youtube.com/embed/QQ-zS7RprDw",
      desc: "Muscular SUV stance with powerful performance.",
    },
    {
      title: "Fortuner Ka Big Daddy | Auto Expo 2023",
      video: "https://www.youtube.com/embed/Afim_iA3038",
      desc: "Refined 6-speed diesel AT with premium SUV aura.",
    },
    {
      title: "Lexus LX500d – ₹3.8 Crore Luxury Beast",
      video: "https://www.youtube.com/embed/cJlNpZUAe9M",
      desc: "Twin-turbo V6 powerhouse with ultimate comfort.",
    },
  ];

  const compareList = [
    {
      title: "Nexon vs Sonet vs Brezza vs Venue – MAHA COMPARISON",
      video: "https://www.youtube.com/embed/XUEMRPppTF0",
      desc: "Ultimate compact SUV showdown across real-world tests.",
    },
    {
      title: "Baleno vs Altroz vs i20 – Which one wins?",
      video: "https://www.youtube.com/embed/w5qDwXK472I",
      desc: "Performance, space, safety — deep dive review.",
    },
    {
      title: "Verna vs City vs Slavia vs Virtus",
      video: "https://www.youtube.com/embed/CT0WS2868CI",
      desc: "Leading sedans face off with detailed analysis.",
    },
  ];

  res.render("pages/reviews", { reviewsList, compareList });
});

app.get("/gallery", isAuthenticated, (req, res) => res.render("pages/gallery"));
app.get("/products", isAuthenticated, (req, res) =>
  res.render("pages/products")
);
app.get("/cart", isAuthenticated, (req, res) => res.render("pages/cart"));
app.get("/about", isAuthenticated, (req, res) => res.render("pages/about"));
app.get("/contact", isAuthenticated, (req, res) => res.render("pages/contact"));

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`TurboTalks running at http://localhost:${PORT}`)
);
