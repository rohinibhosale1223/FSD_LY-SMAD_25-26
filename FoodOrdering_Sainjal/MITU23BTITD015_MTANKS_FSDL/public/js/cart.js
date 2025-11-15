// ===== MTANKS CART SYSTEM =====

// Cart data structure
let cart = JSON.parse(localStorage.getItem('mtanksCart')) || [];
let appliedPromoCode = null;

// Promo codes
const promoCodes = {
    'WELCOME10': { discount: 0.10, description: '10% off your first project' },
    'STARTUP20': { discount: 0.20, description: '20% off for startups' },
    'BULK15': { discount: 0.15, description: '15% off orders over ₹2,00,000' },
    'SAVE50': { discount: 0.50, description: '50% off (limited time)' }
};

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    updateCartBadge();
    loadCartItems();
});

// Add item to cart
function addToCart(id, name, price, type) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`${name} quantity updated in cart`, 'info');
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            type: type,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
        showNotification(`${name} added to cart`, 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('mtanksCart', JSON.stringify(cart));
    
    // Update UI
    updateCartUI();
    updateCartBadge();
    
    // Show cart animation
    animateCartIcon();
}

// Remove item from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('mtanksCart', JSON.stringify(cart));
    updateCartUI();
    updateCartBadge();
    showNotification('Item removed from cart', 'info');
}

// Update item quantity
function updateQuantity(id, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(id);
        return;
    }
    
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('mtanksCart', JSON.stringify(cart));
        updateCartUI();
        updateCartBadge();
    }
}

// Update cart UI
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartDiv = document.getElementById('emptyCart');
    const cartContentDiv = document.getElementById('cartContent');
    
    if (cart.length === 0) {
        emptyCartDiv.style.display = 'block';
        cartContentDiv.style.display = 'none';
        return;
    }
    
    emptyCartDiv.style.display = 'none';
    cartContentDiv.style.display = 'block';
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-aos="fade-up">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <div class="item-info">
                        <h5 class="item-name">${item.name}</h5>
                        <p class="item-type text-muted">${getTypeLabel(item.type)}</p>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="quantity-controls">
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="item-price">
                        <span class="price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                </div>
                <div class="col-md-2">
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateOrderSummary();
}

// Load cart items (for cart page)
function loadCartItems() {
    if (window.location.pathname.includes('cart.html')) {
        updateCartUI();
    }
}

// Update order summary
function updateOrderSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxRate = 0.085; // 8.5% tax
    const tax = subtotal * taxRate;
    
    let discount = 0;
    if (appliedPromoCode) {
        discount = subtotal * appliedPromoCode.discount;
    }
    
    const total = subtotal + tax - discount;
    
    document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    document.getElementById('tax').textContent = `₹${tax.toLocaleString('en-IN')}`;
    document.getElementById('discount').textContent = `-₹${discount.toLocaleString('en-IN')}`;
    document.getElementById('total').textContent = `₹${total.toLocaleString('en-IN')}`;
}

// Apply promo code
function applyPromoCode() {
    const promoCodeInput = document.getElementById('promoCode');
    const promoMessage = document.getElementById('promoMessage');
    const code = promoCodeInput.value.toUpperCase();
    
    if (promoCodes[code]) {
        appliedPromoCode = promoCodes[code];
        promoMessage.innerHTML = `<div class="alert alert-success">✓ ${appliedPromoCode.description}</div>`;
        updateOrderSummary();
        showNotification('Promo code applied successfully', 'success');
    } else {
        appliedPromoCode = null;
        promoMessage.innerHTML = `<div class="alert alert-danger">Invalid promo code</div>`;
        updateOrderSummary();
        showNotification('Invalid promo code', 'error');
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    checkoutModal.show();
}

// Process payment
function processPayment() {
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    
    // Basic form validation
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'cardNumber', 'expiryDate', 'cvv', 'cardName'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Simulate payment processing
    const submitBtn = document.querySelector('#checkoutModal .btn-primary');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Simulate successful payment
        const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
        checkoutModal.hide();
        
        // Clear cart
        cart = [];
        localStorage.removeItem('mtanksCart');
        updateCartUI();
        updateCartBadge();
        
        // Show success modal
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
        
        // Reset form
        form.reset();
        appliedPromoCode = null;
        document.getElementById('promoCode').value = '';
        document.getElementById('promoMessage').innerHTML = '';
        
        showNotification('Payment processed successfully!', 'success');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 3000);
}

// Update cart badge
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

// Animate cart icon
function animateCartIcon() {
    const cartLink = document.getElementById('cartLink');
    if (cartLink) {
        cartLink.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartLink.style.transform = 'scale(1)';
        }, 200);
    }
}

// Get type label
function getTypeLabel(type) {
    const labels = {
        'monthly': 'Monthly Subscription',
        'yearly': 'Yearly Subscription',
        'course': 'Individual Course'
    };
    return labels[type] || type;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

// Cart item template
function createCartItemTemplate(item) {
    return `
        <div class="cart-item">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <div class="item-info">
                        <h5 class="item-name">${item.name}</h5>
                        <p class="item-type text-muted">${getTypeLabel(item.type)}</p>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="quantity-controls">
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="item-price">
                        <span class="price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                </div>
                <div class="col-md-2">
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Export functions for global access
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.applyPromoCode = applyPromoCode;
window.proceedToCheckout = proceedToCheckout;
window.processPayment = processPayment;
