// Products array to store all products
let products = [];
let editingProductId = null;
let cart = [];
let isAdmin = false;


// DOM Elements
const addProductBtn = document.getElementById('addProductBtn');
const productModal = document.getElementById('productModal');
const closeModal = document.querySelector('.close');
const productForm = document.getElementById('productForm');
const cancelBtn = document.getElementById('cancelBtn');
const productsGrid = document.getElementById('productsGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const modalTitle = document.getElementById('modalTitle');
const navbarCategoryFilter = document.getElementById('navbarCategoryFilter');
// Checkout
const checkoutSection = document.getElementById('checkoutSection');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutCart = document.getElementById('checkoutCart');
const checkoutSummary = document.getElementById('checkoutSummary');
const orderConfirmation = document.getElementById('orderConfirmation');
// Payment Modal
const paymentModal = document.getElementById('paymentModal');
const closePaymentModal = document.getElementById('closePaymentModal');
const fakePayBtn = document.getElementById('fakePayBtn');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    displayProducts();

    // Event listeners
    addProductBtn.addEventListener('click', openAddModal);
    closeModal.addEventListener('click', closeProductModal);
    cancelBtn.addEventListener('click', closeProductModal);
    productForm.addEventListener('submit', handleSubmit);

    if (searchInput && categoryFilter) {
        searchInput.addEventListener('input', filterProducts);
        categoryFilter.addEventListener('change', filterProducts);
    }
    if (navbarCategoryFilter) {
        navbarCategoryFilter.addEventListener('change', navbarFilterProducts);
    }

    // Close modal when clicking outside modal content
    window.addEventListener('click', (e) => {
        if (e.target === productModal) closeProductModal();
        if (e.target === paymentModal) paymentModal.style.display = 'none';
    });

    // Cart in navbar
    document.querySelectorAll('.navbar-cart').forEach(cartBtn => {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showCheckout();
        });
    });
    // Payment modal modal close
    closePaymentModal.onclick = function() {
        paymentModal.style.display = 'none';
    };
    // Payment: fake pay button
    fakePayBtn.onclick = function() {
        paymentModal.style.display = 'none';
        orderConfirmation.style.display = 'block';
        orderConfirmation.textContent =
            `Thank you, ${document.getElementById('buyerName').value}! Your payment and order for ${cart.length} item(s) has been received.`;
        cart = [];
        updateCartCount();
        renderCheckoutCart();
        renderCheckoutSummary();
        setTimeout(() => {
            orderConfirmation.style.display = 'none';
            checkoutSection.style.display = 'none';
        }, 3600);
    };
    // Checkout submit intercept → show payment modal
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (cart.length === 0) return;
        paymentModal.style.display = 'block';
    });
});

// CRUD Operations

function addProduct(product) {
    product.id = Date.now().toString();
    product.createdAt = new Date().toISOString();
    products.push(product);
    saveProducts();
}

function loadProducts() {
    const storedProducts = localStorage.getItem('marketplex_products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        products = [
            {
                id: '1',
                name: 'Organic Plant Seeds',
                price: 120,
                category: 'seeds',
                description: 'Grow your garden with high-quality organic plant seeds.',
                image: 'product1.jpg',
                seller: 'GreenThumb',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Washing Machine 7kg',
                price: 21000,
                category: 'washing-machines',
                description: 'Efficient 7kg washing machine with digital controls.',
                image: 'product1.webp',
                seller: 'HomeCare',
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                name: 'Running Shoes',
                price: 3450,
                category: 'sports',
                description: 'Comfortable running shoes for all terrains.',
                image: 'product5.webp',
                seller: 'TechStore',
                createdAt: new Date().toISOString()
            },
            {
                id: '4',
                name: 'Sunscreen',
                price: 845,
                category: 'other',
                description: 'High quality sunscreen for gentle and smooth skin.',
                image: 'product.webp',
                seller: 'Krimy',
                createdAt: new Date().toISOString()
            },
            {
                id: '5',
                name: 'Wireless Headphones',
                price: 4000,
                category: 'electronics',
                description: 'High-quality wireless headphones with noise cancellation.',
                image: '52b329e0dbba570fe65a198e9952dda6.jpg',
                seller: 'TechStore',
                createdAt: new Date().toISOString()
            },
            {
                id: '6',
                name: 'Coconut Seed',
                price: 800,
                category: 'seeds',
                description: 'High quality seed of Coconut for amazing tree.',
                image: 'product-coco.jpg',
                seller: 'Krimy',
                createdAt: new Date().toISOString()
            }
        ];
        saveProducts();
    }
}

function updateProduct(id, updatedProduct) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        saveProducts();
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        displayProducts();
    }
}

function saveProducts() {
    localStorage.setItem('marketplex_products', JSON.stringify(products));
}

function displayProducts(productsToShow = products) {
    productsGrid.innerHTML = '';
    if (productsToShow.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Cart management
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (!cart.find(item => item.id === productId)) {
        cart.push(product);
    }
    updateCartCount();
    showCheckout();
};

function updateCartCount() {
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = cart.length);
}

// Checkout and payment modal logic
function showCheckout() {
    checkoutSection.style.display = 'block';
    renderCheckoutCart();
    renderCheckoutSummary();
}

function renderCheckoutCart() {
    checkoutCart.innerHTML = cart.length
        ? cart.map(product => `
            <div class="checkout-product">
                <img src="${product.image}" alt="${product.name}">
                <div class="checkout-product-details">
                    <div class="checkout-product-title">${product.name}</div>
                    <div class="checkout-product-price">NPR ${product.price}</div>
                </div>
                <button class="checkout-remove-btn" onclick="removeFromCart('${product.id}')">Remove</button>
            </div>
        `).join('')
        : '<p>Your cart is empty.</p>';
}

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCheckoutCart();
    renderCheckoutSummary();
};

function renderCheckoutSummary() {
    const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
    checkoutSummary.textContent = cart.length
        ? `Total items: ${cart.length} | Grand Total: NPR ${total.toFixed(2)}`
        : '';
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    const imageContent = product.image
        ? `<img src="${product.image}" alt="${product.name}" />`
        : `<div class="product-image">🛍️</div>`;
    
    let crudButtons = "";
    if (isAdmin) {
        crudButtons = `
            <button class="btn-edit" onclick="editProduct('${product.id}')">✏️ Edit</button>
            <button class="btn-delete" onclick="deleteProduct('${product.id}')">🗑️ Delete</button>
        `;
    }
    card.innerHTML = `
        <div class="product-image">${imageContent}</div>
        <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-price">NPR ${parseFloat(product.price).toFixed(2)}</div>
            <span class="product-category">${product.category}</span>
            <div class="product-description">${product.description}</div>
            <div class="product-seller">👤 Sold by: ${product.seller}</div>
            <div class="product-actions">
                ${crudButtons}
                <button class="btn-primary" onclick="addToCart('${product.id}')">Add to Cart</button>
            </div>
        </div>
    `;
    return card;
}


// Product Add/Edit Modal
function openAddModal() {
    editingProductId = null;
    modalTitle.textContent = 'Add New Product';
    productForm.reset();
    productModal.style.display = 'block';
}
function openEditModal(product) {
    editingProductId = product.id;
    modalTitle.textContent = 'Edit Product';
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productImage').value = product.image || '';
    document.getElementById('sellerName').value = product.seller;
    productModal.style.display = 'block';
}
function closeProductModal() {
    productModal.style.display = 'none';
    productForm.reset();
    editingProductId = null;
}
window.editProduct = function(id) {
    const product = products.find(p => p.id === id);
    if (product) openEditModal(product);
};
function handleSubmit(e) {
    e.preventDefault();
    const productData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value,
        seller: document.getElementById('sellerName').value
    };
    if (editingProductId) {
        updateProduct(editingProductId, productData);
    } else {
        addProduct(productData);
    }
    displayProducts();
    closeProductModal();
}

// Filtering and navigation
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    let filtered = products;
    if (searchTerm) {
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.seller.toLowerCase().includes(searchTerm)
        );
    }
    if (selectedCategory !== 'all') {
        filtered = filtered.filter(product => product.category === selectedCategory);
    }
    displayProducts(filtered);
}

function navbarFilterProducts() {
    if (!navbarCategoryFilter) return;
    const selectedCategory = navbarCategoryFilter.value;
    let filtered = products;
    if (selectedCategory !== 'all') {
        filtered = filtered.filter(product => product.category === selectedCategory);
    }
    displayProducts(filtered);
}
// Login Modal Logic
const loginModal = document.getElementById('loginModal');
const loginNavBtn = document.getElementById('loginNavBtn');
const closeLoginModal = document.getElementById('closeLoginModal');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const loginStatus = document.getElementById('loginStatus');

loginNavBtn.onclick = function(e) {
    e.preventDefault();
    loginModal.style.display = 'block';
    loginStatus.textContent = "";
}
closeLoginModal.onclick = function() { loginModal.style.display = 'none'; }

// Simple hardcoded check (use better security if you want real auth!)
loginSubmitBtn.onclick = function() {
    const user = document.getElementById('loginUsername').value.trim();
    const pass = document.getElementById('loginPassword').value;

    if (user === "admin" && pass === "admin123") {
        isAdmin = true;
        loginModal.style.display = 'none';
        loginStatus.textContent = "";
        renderSiteByRole();
    } else {
        loginStatus.textContent = "Invalid username or password!";
    }
};
function renderSiteByRole() {
    // Show/hide Add Product button
    addProductBtn.style.display = isAdmin ? "inline-block" : "none";

    // Refresh product grid so CRUD buttons show/hide
    displayProducts();
}

// If you ever add a logout:
function logout() {
    isAdmin = false;
    renderSiteByRole();
}
