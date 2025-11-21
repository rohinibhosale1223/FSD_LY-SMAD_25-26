import React, { useState } from 'react';
import './Checkout.css';

function Checkout() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      {submitted ? (
        <div className="confirmation">
          <h2>Payment Successful!</h2>
          <p>Thank you for your purchase.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="checkout-form">
          <label>
            Cardholder Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Card Number
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </label>

          <div className="row">
            <label>
              Expiry
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
              />
            </label>
            <label>
              CVV
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
              />
            </label>
          </div>

          <button type="submit">Pay Now</button>
        </form>
      )}
    </div>
  );
}

export default Checkout;
