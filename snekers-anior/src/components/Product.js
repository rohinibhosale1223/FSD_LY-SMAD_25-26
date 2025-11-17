import React from "react";
import "./Product.css"; // Make sure you have a Product.css file

const Product = ({ products, addToCart }) => {
  return (
    <div className="product-container">
      <h1>Our Products</h1>
      <p>Explore our latest sneakers collection!</p>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-box" key={product.id}>
            <img src={product.img} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
            <button className="add-to-cart" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
