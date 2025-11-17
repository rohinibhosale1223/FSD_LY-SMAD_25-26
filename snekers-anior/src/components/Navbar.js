import { Link } from "react-router-dom";
import "./Navbar.css"; // Ensure Navbar.css exists

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/product">Product</Link></li>
        <li><Link to="/Bucket">Cart</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/login">Login</Link></li> {/* Added Login Link */}
      </ul>
    </nav>
  );
};

export default Navbar;
