import "./Cart.css";

const Cart = ({ cart }) => {
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const priceStr = item.price ? String(item.price) : "0"; // Ensure it's a string
      const priceNumber = parseInt(priceStr.replace(/[₹,]/g, ""), 10) || 0; // Convert safely
      return total + priceNumber * (item.quantity || 1);
    }, 0);
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <ul className="cart-list">
          {cart.map((item) => {
            const priceStr = item.price ? String(item.price) : "0";
            const priceNumber = parseInt(priceStr.replace(/[₹,]/g, ""), 10) || 0;

            return (
              <li key={item.id} className="cart-item">
                <img src={item.img} alt={item.name} className="cart-image" />
                <div className="cart-details">
                  <h3>{item.name}</h3>
                  <p>
                    ₹{priceNumber} × {item.quantity || 1} = <strong>₹{priceNumber * (item.quantity || 1)}</strong>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <h2 className="cart-total">Total: ₹{calculateTotal()}</h2>
    </div>
  );
};

export default Cart;
