import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Login from "./components/Login";

function App() {
  const [cart, setCart] = useState([]); 
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home setCart={setCart} />} />
        <Route path="/cart" element={isAuthenticated ? <Cart cart={cart} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      </Routes>
    </Router>
  );
}

export default App;
