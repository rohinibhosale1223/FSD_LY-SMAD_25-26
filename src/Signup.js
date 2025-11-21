import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gameType, setGameType] = useState(''); // NEW FIELD

  const navigate = useNavigate();

  const signup = (newUser) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const emailExists = users.some((u) => u.email === newUser.email);
    const usernameExists = users.some((u) => u.username === newUser.username);

    if (emailExists) {
      alert('Email already exists');
      return false;
    }

    if (usernameExists) {
      alert('Username already taken');
      return false;
    }

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('authUser', JSON.stringify(newUser));
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    const newUser = {
      fullName,
      username,
      email,
      phone,
      password,
      gameType,   // SAVE THIS TOO
    };

    if (signup(newUser)) {
      navigate('/');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-content">
          <h2 className="signup-title">Create Your Account</h2>
          <p className="signup-subtext">Join the platform to explore the world of gaming!</p>

          <form onSubmit={handleSubmit} className="signup-form">

            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <label>Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* NEW GAME TYPE FIELD */}
            <label>Which type of games do you play?</label>
            <select
              value={gameType}
              onChange={(e) => setGameType(e.target.value)}
              required
            >
              <option value="">Select game type</option>
              <option value="Action">Action</option>
              <option value="FPS">FPS (Valorant, CS:GO, etc.)</option>
              <option value="Battle Royale">Battle Royale (BGMI, Free Fire)</option>
              <option value="Racing">Racing</option>
              <option value="Sports">Sports (FIFA, Cricket)</option>
              <option value="Strategy">Strategy (Clash of Clans, Chess)</option>
              <option value="RPG">RPG / Adventure</option>
            </select>

            <button type="submit" className="signup-button">Sign Up</button>
          </form>

          <div className="signup-footer">
            Already have an account? <a href="/login">Login here</a>
          </div>
        </div>

        <div className="signup-image">
          <img
            src="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto/q_auto,f_auto/gigs/116965796/original/0d1b0d77c52830452fdf3ba75a74fa24e31520a0/do-minimalist-logo-design-for-your-business.jpg"
            alt="Join Gaming"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
