// script.js

// ----------------- GLOBAL CART -----------------
let cart = [];

// ----------------- CART FUNCTIONS -----------------
function addToCart(courseName, price) {
  const item = { name: courseName, price: parseFloat(price) };
  cart.push(item);
  updateCart();
  alert(`${courseName} added to cart!`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById("cart-items");
  const totalPrice = document.getElementById("total-price");

  if (!cartList || !totalPrice) return; // Only run if cart page

  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      ${item.name} - $${item.price.toFixed(2)}
      <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button>
    `;
    cartList.appendChild(li);
    total += item.price;
  });

  totalPrice.textContent = `$${total.toFixed(2)}`;
}

// ----------------- FORM VALIDATION -----------------
function validateLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }
  alert("Login successful!");
}

function validateRegister(event) {
  event.preventDefault();
  const username = document.getElementById("register-username").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  if (!username || !email || !password) {
    alert("All fields are required.");
    return;
  }
  alert("Registration successful!");
}

// ----------------- CONTACT FORM -----------------
function validateContact(event) {
  event.preventDefault();
  const name = document.getElementById("contact-name").value;
  const email = document.getElementById("contact-email").value;
  const message = document.getElementById("contact-message").value;

  if (!name || !email || !message) {
    alert("All fields are required.");
    return;
  }
  alert("Thank you for contacting us!");
}
