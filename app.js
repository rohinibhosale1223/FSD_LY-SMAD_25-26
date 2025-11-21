const express = require('express');
const path = require('path');
const app = express();

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like images, css)
app.use(express.static('public'));

// Home route
app.get('/', (req, res) => {
  res.render('home');
});

// Login route
app.get('/login', (req, res) => {
  res.render('login');
});

// Movies route with genres data
app.get('/movies', (req, res) => {
  const genres = {
    Action: [
      { title: 'Extraction', image: '/Images/action1.jpeg', desc: 'A black-market mercenary embarks on a deadly rescue mission.' },
      { title: 'John Wick', image: '/Images/action2.jpeg', desc: 'A retired hitman seeks vengeance.' },
      { title: 'Mad Max: Fury Road', image: '/Images/action3.jpeg', desc: 'A woman rebels against a tyrannical ruler.' },
      { title: 'Gladiator', image: '/Images/action4.jpeg', desc: 'A Roman general seeks revenge for his family.' }
    ],
    Comedy: [
      { title: 'The Mask', image: '/Images/comedy1.jpeg', desc: 'A man discovers a magical mask that changes his life.' },
      { title: 'Jumanji', image: '/Images/comedy2.jpeg', desc: 'Friends get trapped inside a video game jungle.' },
      { title: 'Home Alone', image: '/Images/comedy3.jpeg', desc: 'A kid defends his house from burglars.' },
      { title: 'The Dictator', image: '/Images/comedy4.jpeg', desc: 'A dictator tries to prevent democracy in his country.' }
    ],
    Drama: [
      { title: 'The Shawshank Redemption', image: '/Images/romance1.jpeg', desc: 'Hope can set you free.' },
      { title: 'Forrest Gump', image: '/Images/romance2.jpg', desc: 'Life is like a box of chocolates.' },
      { title: 'The Pursuit of Happyness', image: '/Images/romance3.jpeg', desc: 'A man’s struggle to build a better life.' },
      { title: 'A Beautiful Mind', image: '/Images/romance4.jpeg', desc: 'The life of a brilliant mathematician.' }
    ],
    Horror: [
      { title: 'The Conjuring', image: '/Images/horror1.jpeg', desc: 'Paranormal investigators help a family terrorized by dark forces.' },
      { title: 'Insidious', image: '/Images/horror2.jpg', desc: 'A family confronts a terrifying spirit world.' },
      { title: 'It', image: '/Images/horror3.jpeg', desc: 'A clown terrorizes children in a small town.' },
      { title: 'Annabelle', image: '/Images/horror4.jpeg', desc: 'A haunted doll brings horror to a family.' }
    ]
  };

  res.render('movies', { genres });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
