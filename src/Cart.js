import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import { useCart } from './CartContext';

function Cart() {
  const { cart, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = (game) => {
    navigate('/checkout', { state: { game } });
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button className="continue-btn" onClick={handleContinueShopping}>
            Browse Games
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((game) => (
              <div className="cart-item" key={game.id}>
                <img src={game.image} alt={game.title} className="cart-image" />

                <div className="cart-info">
                  <h3>{game.title}</h3>
                  <p className="cart-desc">{game.description}</p>
                  <p className="cart-price">₹{game.price}</p>

                  <div className="cart-buttons">
                    <button className="buy-btn" onClick={() => handleCheckout(game)}>
                      Buy Now
                    </button>

                    <button className="remove-btn" onClick={() => removeFromCart(game.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2>Total: ₹{totalPrice}</h2>

            <div className="cart-summary-buttons">
              <button className="continue-btn" onClick={handleContinueShopping}>
                🛍️ Continue Shopping
              </button>

              <button
                className="checkout-btn"
                onClick={() => navigate('/checkout', { state: { total: totalPrice, cart } })}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
