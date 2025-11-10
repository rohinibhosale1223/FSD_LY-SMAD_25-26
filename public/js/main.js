document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize cart count
    updateCartCount();

    // Handle add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const photoId = this.dataset.id;
            addToCart(photoId);
        });
    });

    // Handle remove from cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-from-cart')) {
            e.preventDefault();
            const photoId = e.target.dataset.id;
            removeFromCart(photoId);
        }
    });

    // Handle filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;
                filterPhotos(filter);
                
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitContactForm(this);
        });
    }
});

// Add to cart function
async function addToCart(photoId) {
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photoId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            updateCartCount(data.cartCount);
            showToast('Photo added to cart!', 'success');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Failed to add to cart', 'error');
    }
}

// Remove from cart function
async function removeFromCart(photoId) {
    try {
        const response = await fetch('/api/cart/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photoId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            updateCartCount(data.cartCount);
            // Remove the cart item from the UI
            const cartItem = document.querySelector(`.cart-item[data-id="${photoId}"]`);
            if (cartItem) {
                cartItem.style.opacity = '0';
                setTimeout(() => {
                    cartItem.remove();
                    // Reload the page if no items left in cart
                    if (document.querySelectorAll('.cart-item').length === 0) {
                        window.location.reload();
                    }
                }, 300);
            }
            showToast('Photo removed from cart', 'success');
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        showToast('Failed to remove from cart', 'error');
    }
}

// Update cart count in the UI
function updateCartCount(count) {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = count || '0';
        // Add bounce animation
        cartCount.classList.add('bg-danger');
        setTimeout(() => {
            cartCount.classList.remove('bg-danger');
        }, 300);
    }
}

// Filter photos in the gallery
function filterPhotos(filter) {
    const photos = document.querySelectorAll('.photo-item');
    
    photos.forEach(photo => {
        const categories = photo.dataset.categories.split(' ');
        
        if (filter === 'all' || categories.includes(filter)) {
            photo.style.display = 'block';
            // Add animation
            photo.style.animation = 'fadeIn 0.5s ease-in-out';
        } else {
            photo.style.display = 'none';
        }
    });
}

// Submit contact form
async function submitContactForm(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const submitButtonText = submitButton.innerHTML;
    
    try {
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
        
        const response = await fetch('/api/contact', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(data.message || 'Message sent successfully!', 'success');
            form.reset();
        } else {
            throw new Error(data.message || 'Failed to send message');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showToast(error.message || 'Failed to send message. Please try again.', 'error');
    } finally {
        // Re-enable button and restore text
        submitButton.disabled = false;
        submitButton.innerHTML = submitButtonText;
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast show ${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <div class="toast-message">${message}</div>
        <button type="button" class="btn-close ms-3" data-bs-dismiss="toast" aria-label="Close"></button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
    
    // Close button functionality
    const closeButton = toast.querySelector('.btn-close');
    closeButton.addEventListener('click', () => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
});
