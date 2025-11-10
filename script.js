// Products array to store all products
let products = [];
let editingProductId = null;

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

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    displayProducts();
    
    // Event listeners
    addProductBtn.addEventListener('click', openAddModal);
    closeModal.addEventListener('click', closeProductModal);
    cancelBtn.addEventListener('click', closeProductModal);
    productForm.addEventListener('submit', handleSubmit);
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeProductModal();
        }
    });
});

// CRUD Operations

// CREATE - Add new product
function addProduct(product) {
    product.id = Date.now().toString();
    product.createdAt = new Date().toISOString();
    products.push(product);
    saveProducts();
}

// READ - Load products from localStorage
function loadProducts() {
    const storedProducts = localStorage.getItem('marketplex_products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        // Add sample products for demonstration

   products = [
    {
        id: '1',
        name: 'Organic Plant Seeds',
        price: 120,
        category: 'seeds',
        description: 'Grow your garden with high-quality organic plant seeds.',
        image: 'product1.jpg', // <- local file
        seller: 'GreenThumb',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Washing Machine 7kg',
        price: 21000,
        category: 'washing-machines',
        description: 'Efficient 7kg washing machine with digital controls.',
        image: 'product1.webp', // <- local file
        seller: 'HomeCare',
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        name: 'Running Shoes',
        price: 3450,
        category: 'sports',
        description: 'Comfortable running shoes for all terrains.',
        image: 'product5.webp', // <- local file
        seller: 'TechStore',
        createdAt: new Date().toISOString()
    },
    {
        id:'4',
        name: 'Fair & Lovely',
        price: 445,
        category: 'other',
        description: 'High quality fairness lotion for gentle and smooth skin.',
        image: 'product.jpg',
        seller: 'Krimy',
        createdAt: new Date().toISOString()
    },
    {
        id: '5',
        name: 'Wireless Headphones',
        price: 4000,
        category: 'electronics',
        description: 'High-quality wireless headphones with noise cancellation.',
        image: '52b329e0dbba570fe65a198e9952dda6.jpg', // <- local file
        seller: 'TechStore',
        createdAt: new Date().toISOString()
    }

    // add more products for each category...
];


        saveProducts();
    }
}

// UPDATE - Update existing product
function updateProduct(id, updatedProduct) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        saveProducts();
    }
}

// DELETE - Remove product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        displayProducts();
    }
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('marketplex_products', JSON.stringify(products));
}

// Display products
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

// Create product card HTML
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const imageContent = product.image 
        ? `<img src="${product.image}" alt="${product.name}">`
        : `<div class="product-image">🛍️</div>`;
    
    card.innerHTML = `
        ${product.image ? `<div class="product-image">${imageContent}</div>` : imageContent}
        <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-price">NPR ${parseFloat(product.price).toFixed(2)}</div>
            <span class="product-category">${product.category}</span>
            <div class="product-description">${product.description}</div>
            <div class="product-seller">👤 Sold by: ${product.seller}</div>
            <div class="product-actions">
                <button class="btn-edit" onclick="editProduct('${product.id}')">✏️ Edit</button>
                <button class="btn-delete" onclick="deleteProduct('${product.id}')">🗑️ Delete</button>
            </div>
        </div>
    `;
    
    return card;
}

// Modal functions
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

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        openEditModal(product);
    }
}

// Handle form submission
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
        // Update existing product
        updateProduct(editingProductId, productData);
    } else {
        // Add new product
        addProduct(productData);
    }
    
    displayProducts();
    closeProductModal();
}

// Filter products
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    
    let filtered = products;
    
    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.seller.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
        filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    displayProducts(filtered);
}

function navbarFilterProducts() {
    const searchTerm = navbarSearchInput.value.toLowerCase();
    const selectedCategory = navbarCategoryFilter.value;
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
