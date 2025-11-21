import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Login function
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
      return true;
    } else {
      alert('Invalid email or password');
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/'); // Redirect to home after successful login
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-content">
          <h2 className="login-title">Welcome Back!</h2>
          <p className="login-subtext">Log in to access your personalized gaming dashboard.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-button">Login</button>
          </form>

          <div className="login-footer">
            Don't have an account?{' '}
            <a href="/signup">Sign up here</a> {/* Link to signup page */}
          </div>
        </div>

        <div className="login-image">
          <img
            src="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/116965796/original/0d1b0d77c52830452fdf3ba75a74fa24e31520a0/do-minimalist-logo-design-for-your-business.jpg"
            alt="Gaming"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
