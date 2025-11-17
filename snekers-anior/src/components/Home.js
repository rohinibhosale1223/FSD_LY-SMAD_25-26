import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import A1 from "../assets/A1.jpg";
import A2 from "../assets/A2.jpg";
import A3 from "../assets/A3.jpg";
import A4 from "../assets/A4.jpg";
import A5 from "../assets/A5.jpg";
import A6 from "../assets/A6.jpg";
import A7 from "../assets/A7.jpg";
import A8 from "../assets/A8.jpg";
import A9 from "../assets/A9.jpg";
import "./Home.css";

const products = [
  { id: 1, img: A1, name: "Sneaker 1", price: 4999 },
  { id: 2, img: A2, name: "Sneaker 2", price: 5499 },
  { id: 3, img: A3, name: "Sneaker 3", price: 6299 },
  { id: 4, img: A4, name: "Sneaker 4", price: 4799 },
  { id: 5, img: A5, name: "Sneaker 5", price: 5999 },
  { id: 6, img: A6, name: "Sneaker 6", price: 6499 },
  { id: 7, img: A7, name: "Sneaker 7", price: 10899 },
  { id: 8, img: A8, name: "Sneaker 8", price: 9999 },
  { id: 9, img: A9, name: "Sneaker 9", price: 8799 },
];

const Home = ({ setCart }) => {
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    const quantity = selectedQuantities[product.id] || 1;
    setCart((prevCart) => [...prevCart, { ...product, quantity }]);
    setMessage(`${product.name} (x${quantity}) added to cart!`);
    setTimeout(() => setMessage(""), 2000);
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  return (
    <div className="home-container">
      <h1 className="title">Welcome to our site!</h1>
      <h1 className="brand-name">ANIOR</h1>
      <p className="subtitle">Explore our latest sneaker collection.</p>

      {message && <p className="cart-message">{message}</p>}

      <div className="product-grid">
        {products.map((product) => (
          <div className="product-box" key={product.id}>
            <img src={product.img} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>

            <select
              className="quantity-selector"
              onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value, 10))}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <div className="button-container">
              <button className="add-to-cart" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
              <button className="go-to-cart" onClick={() => navigate("/cart")}>
                Go to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
