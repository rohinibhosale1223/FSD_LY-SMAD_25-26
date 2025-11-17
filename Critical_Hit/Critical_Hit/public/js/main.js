// Critical Hit - Main JavaScript File
// Contains interactive features and animations

// Initialize AOS animations
document.addEventListener('DOMContentLoaded', function() {
  // Set up mouse glow effect
  setupMouseGlow();
  
  // Add any additional initialization here
  console.log('Critical Hit Portal initialized');
});

// Mouse Glow Effect
function setupMouseGlow() {
  const glow = document.getElementById('mouse-glow');
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let speed = 0.1;
  let opacity = 0;
  let velocity = 0;
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;
  
  // Track mouse movement
  document.addEventListener('mousemove', function(e) {
    targetX = e.clientX;
    targetY = e.clientY;
    
    // Calculate velocity
    const currentTime = Date.now();
    if (lastTime) {
      const deltaTime = currentTime - lastTime;
      const distance = Math.sqrt(
        Math.pow(targetX - lastX, 2) + 
        Math.pow(targetY - lastY, 2)
      );
      velocity = distance / deltaTime;
    }
    
    lastX = targetX;
    lastY = targetY;
    lastTime = currentTime;
    
    // Show glow when mouse moves
    opacity = Math.min(1, opacity + 0.1);
    glow.style.opacity = opacity;
  });
  
  // Animation loop for smooth movement
  function animateGlow() {
    // Smoothly move glow towards target position
    mouseX += (targetX - mouseX) * speed;
    mouseY += (targetY - mouseY) * speed;
    
    // Update glow position
    glow.style.left = mouseX + 'px';
    glow.style.top = mouseY + 'px';
    
    // Gradually decrease opacity when mouse stops
    if (velocity < 0.1) {
      opacity = Math.max(0, opacity - 0.02);
      glow.style.opacity = opacity;
    } else {
      // Adjust opacity based on velocity (dim when moving fast)
      const maxVelocity = 2;
      const newOpacity = 1 - Math.min(1, velocity / maxVelocity);
      opacity = Math.max(0.3, newOpacity); // Minimum opacity of 0.3
      glow.style.opacity = opacity;
    }
    
    // Reset velocity tracking periodically
    velocity *= 0.95; // Gradually reduce velocity
    
    requestAnimationFrame(animateGlow);
  }
  
  // Start animation loop
  animateGlow();
}

// Form validation for login
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.querySelector('.login-form form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      // Simple validation
      if (!username || !password) {
        e.preventDefault();
        alert('Please fill in all fields');
        return;
      }
      
      // If validation passes, let the form submit normally to the server
      // The server-side code will handle the actual login
    });
  }
  
  // Form validation for register
  const registerForm = document.querySelector('.register-form form');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      // Simple validation
      if (!username || !email || !password || !confirmPassword) {
        e.preventDefault();
        alert('Please fill in all fields');
        return;
      }
      
      if (password !== confirmPassword) {
        e.preventDefault();
        alert('Passwords do not match');
        return;
      }
      
      // If validation passes, let the form submit normally to the server
      // The server-side code will handle the actual registration
    });
  }
  
  // Form validation for contact
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      // Simple validation
      if (!name || !email || !message) {
        alert('Please fill in all required fields');
        return;
      }
      
      // In a real application, this would send to a server
      alert('Message sent! We will get back to you soon.');
      contactForm.reset();
    });
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Add glow effect to interactive elements on hover
document.addEventListener('DOMContentLoaded', function() {
  const interactiveElements = document.querySelectorAll('.neon-button, .neon-input, .neon-hover');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      this.classList.add('glow');
    });
    
    element.addEventListener('mouseleave', function() {
      this.classList.remove('glow');
    });
  });
});

// Game Store and Cart Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the store page
  if (document.querySelector('.store-container')) {
    initializeStore();
  }
  
  // Initialize cart functionality on all pages (for cart icon)
  initializeCart();
});

// AAA game data (first 6 sample games removed; these are the active store items)
const games = [
  {
    id: 1,
    title: "God of War Ragnarök",
    price: 70,
    image: "/images/games/godofwar.jpg"
  },
  {
    id: 2,
    title: "The Last of Us Part II",
    price: 60,
    image: "/images/games/lastofus2.jpg"
  },
  {
    id: 3,
    title: "Elden Ring",
    price: 70,
    image: "/images/games/eldenring.jpg"
  },
  {
    id: 4,
    title: "Grand Theft Auto V",
    price: 30,
    image: "/images/games/gtav.jpg"
  },
  {
    id: 5,
    title: "Red Dead Redemption 2",
    price: 60,
    image: "/images/games/rdr2.jpg"
  },
  {
    id: 6,
    title: "Cyberpunk 2077",
    price: 50,
    image: "/images/games/cyberpunk.jpg"
  }
];

// Currency conversion: USD to INR
// Update this rate as needed. This keeps prices stored in USD but displays in INR.
const USD_TO_INR = 100; // example rate: 1 USD = 100 INR

function formatPriceInINR(amountUSD) {
  const inr = amountUSD * USD_TO_INR;
  return `₹${inr.toFixed(2)}`;
}

// Cart functionality
let cart = [];

// Initialize the store page
function initializeStore() {
  renderGames();
  loadCart();
  setupCartModal();
  
  // Add fade-in effect for the store container
  const storeContainer = document.querySelector('.store-container');
  if (storeContainer) {
    setTimeout(() => {
      storeContainer.style.opacity = '1';
    }, 100);
  }
}

// Render game cards
function renderGames() {
  const gamesGrid = document.querySelector('.games-grid');
  if (!gamesGrid) return;
  
  // Only render games if the grid is empty to prevent re-rendering
  if (gamesGrid.children.length === 0) {
    games.forEach(game => {
      const gameCard = document.createElement('div');
      gameCard.className = 'game-card';
      gameCard.innerHTML = `
        <img src="${game.image}" alt="${game.title}" class="game-image" onerror="this.src='/images/placeholder.jpg'">
        <h3 class="game-title">${game.title}</h3>
          <div class="game-price">${formatPriceInINR(game.price)}</div>
        <button class="add-to-cart-btn" data-game-id="${game.id}">Add to Cart</button>
      `;
      gamesGrid.appendChild(gameCard);
    });
    
    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.addEventListener('click', function() {
        const gameId = parseInt(this.getAttribute('data-game-id'));
        addToCart(gameId);
      });
    });
  }
}

// Add game to cart
function addToCart(gameId) {
  const game = games.find(g => g.id === gameId);
  if (!game) return;
  
  // Check if game is already in cart
  const existingItem = cart.find(item => item.id === gameId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: game.id,
      title: game.title,
      price: game.price,
      image: game.image,
      quantity: 1
    });
  }
  
  saveCart();
  updateCartIcon();
  
  // Show visual feedback without re-rendering
  const button = document.querySelector(`.add-to-cart-btn[data-game-id="${gameId}"]`);
  if (button) {
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.disabled = true;
    
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 1500);
  }
}

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('gameStoreCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  updateCartIcon();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('gameStoreCart', JSON.stringify(cart));
}

// Update cart icon with item count
function updateCartIcon() {
  const cartCount = document.querySelector('.cart-count');
  if (!cartCount) return;
  
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Only update if the count has changed to prevent unnecessary reflows
  if (parseInt(cartCount.textContent) !== totalCount) {
    cartCount.textContent = totalCount;
    cartCount.style.display = totalCount > 0 ? 'flex' : 'none';
    
    // Add animation effect
    cartCount.style.transform = 'scale(1.2)';
    setTimeout(() => {
      cartCount.style.transform = 'scale(1)';
    }, 300);
  }
}

// Initialize cart functionality
function initializeCart() {
  // Add cart icon to navbar if not already present
  const navbar = document.querySelector('.navbar-nav.ms-auto');
  if (navbar && !document.querySelector('.cart-icon-container')) {
    const cartIconContainer = document.createElement('li');
    cartIconContainer.className = 'nav-item cart-icon-container';
    cartIconContainer.innerHTML = `
      <a class="nav-link neon-hover cart-icon" id="cartIcon">
        🛒
        <span class="cart-count" style="display: none;">0</span>
      </a>
    `;
    navbar.insertBefore(cartIconContainer, navbar.firstChild);
    
    // Add event listener to cart icon
    document.getElementById('cartIcon').addEventListener('click', function(e) {
      e.preventDefault();
      if (window.location.pathname !== '/store') {
        window.location.href = '/store';
      } else {
        openCartModal();
      }
    });
  }
  
  loadCart();
}

// Setup cart modal functionality
function setupCartModal() {
  const cartModal = document.getElementById('cartModal');
  const closeCart = document.getElementById('closeCart');
  const cartIcon = document.getElementById('cartIcon');
  
  if (cartIcon) {
    cartIcon.addEventListener('click', openCartModal);
  }
  
  if (closeCart) {
    closeCart.addEventListener('click', closeCartModal);
  }
  
  // Close modal when clicking outside
  if (cartModal) {
    cartModal.addEventListener('click', function(e) {
      if (e.target === cartModal) {
        closeCartModal();
      }
    });
  }
  
  // Checkout button
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      alert('Thank you for your purchase!');
      cart = [];
      saveCart();
      updateCartIcon();
      renderCartItems();
      closeCartModal();
    });
  }

  // Event delegation for cart item controls (increase, decrease, remove)
  const cartItemsContainer = document.getElementById('cartItems');
  if (cartItemsContainer && !cartItemsContainer.dataset.delegate) {
    cartItemsContainer.addEventListener('click', function(e) {
      const incBtn = e.target.closest('.increase-qty');
      if (incBtn) {
        const itemId = parseInt(incBtn.getAttribute('data-item-id'));
        updateQuantity(itemId, 1);
        return;
      }

      const decBtn = e.target.closest('.decrease-qty');
      if (decBtn) {
        const itemId = parseInt(decBtn.getAttribute('data-item-id'));
        updateQuantity(itemId, -1);
        return;
      }

      const remBtn = e.target.closest('.remove-btn');
      if (remBtn) {
        const itemId = parseInt(remBtn.getAttribute('data-item-id'));
        removeFromCart(itemId);
        return;
      }
    });
    cartItemsContainer.dataset.delegate = '1';
  }
}

// Open cart modal
function openCartModal() {
  const cartModal = document.getElementById('cartModal');
  if (cartModal) {
    cartModal.style.display = 'flex';
    renderCartItems();
  }
}

// Close cart modal
function closeCartModal() {
  const cartModal = document.getElementById('cartModal');
  if (cartModal) {
    cartModal.style.display = 'none';
  }
}

// Render cart items
function renderCartItems() {
  const cartItemsContainer = document.getElementById('cartItems');
  const emptyCartMessage = document.getElementById('emptyCartMessage');
  const totalPriceElement = document.getElementById('totalPrice');
  
  if (!cartItemsContainer || !emptyCartMessage || !totalPriceElement) return;
  
  if (cart.length === 0) {
    emptyCartMessage.style.display = 'block';
    cartItemsContainer.innerHTML = '';
    cartItemsContainer.appendChild(emptyCartMessage);
    totalPriceElement.textContent = formatPriceInINR(0);
    return;
  }
  
  emptyCartMessage.style.display = 'none';
  
  // Create a document fragment to minimize DOM reflows
  const fragment = document.createDocumentFragment();
  let totalPrice = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="cart-item-image" onerror="this.src='/images/placeholder.jpg'">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-price">${formatPriceInINR(item.price)}</div>
        <div class="cart-item-subtotal">${formatPriceInINR(item.price * item.quantity)}</div>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-control">
          <button class="quantity-btn decrease-qty" data-item-id="${item.id}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn increase-qty" data-item-id="${item.id}">+</button>
        </div>
        <button class="remove-btn" data-item-id="${item.id}">Remove</button>
      </div>
    `;
    
    fragment.appendChild(cartItem);
  });
  
  // Only update the container if content has changed
  cartItemsContainer.innerHTML = '';
  cartItemsContainer.appendChild(fragment);
  
  // Update total price with transition (displayed in INR)
  totalPriceElement.textContent = formatPriceInINR(totalPrice);
  totalPriceElement.style.opacity = '0.5';
  setTimeout(() => {
    totalPriceElement.style.opacity = '1';
  }, 100);
  
  // Note: event delegation handles quantity and remove button clicks (see setupCartModal)
}

// Update item quantity
function updateQuantity(itemId, change) {
  const item = cart.find(item => item.id === itemId);
  if (!item) return;
  
  item.quantity += change;
  
  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== itemId);
  }
  
  saveCart();
  updateCartIcon();
  
  // Only update the specific cart item instead of re-rendering everything
  updateCartItemDisplay(itemId);
}

// Update the display of a specific cart item
function updateCartItemDisplay(itemId) {
  const item = cart.find(item => item.id === itemId);
  const totalPriceElement = document.getElementById('totalPrice');
  
  if (!item) {
    // If item was removed, re-render the cart
    renderCartItems();
    return;
  }
  
  // Find the specific cart item element and update its quantity
  const cartItemElements = document.querySelectorAll('.cart-item');
  cartItemElements.forEach(element => {
    const btn = element.querySelector('.increase-qty');
    if (btn && parseInt(btn.getAttribute('data-item-id')) === itemId) {
      const quantityElement = element.querySelector('.quantity');
      if (quantityElement) {
        quantityElement.textContent = item.quantity;
        // Update per-item subtotal display
        const subtotalEl = element.querySelector('.cart-item-subtotal');
        if (subtotalEl) {
          subtotalEl.textContent = formatPriceInINR(item.price * item.quantity);
        }
      }
    }
  });
  
  // Update total price (display in INR)
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalPriceElement.textContent = formatPriceInINR(totalPrice);
  totalPriceElement.style.opacity = '0.5';
  setTimeout(() => {
    totalPriceElement.style.opacity = '1';
  }, 100);
}

// Remove item from cart
function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  saveCart();
  updateCartIcon();
  renderCartItems();
}

// Future Implementation Placeholders
/*
TODO: Implement database integration for persistent storage
TODO: Add JWT authentication for secure user sessions
TODO: Implement user avatar upload functionality
TODO: Add leaderboard functionality for top reviewers
TODO: Implement advanced search and filtering for reviews
TODO: Add game recommendation engine based on user preferences
*/

console.log('Main JavaScript loaded');