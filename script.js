// Created By: Mohan Nukala

const apiEndpoint = 'https://dummyjson.com/products';
let products = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 10;

const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('filters');
const priceFilter = document.getElementById('price');
const productList = document.getElementById('product-list');
const loadMoreBtn = document.getElementById('load-more');
const loadingIndicator = document.getElementById('loading');
const errorIndicator = document.getElementById('error');
const hamburgerIcon = document.getElementById('hamburger-icon');
const hamburgerMenu = document.getElementById('hamburger-menu');
const closeMenuBtn = document.getElementById('close-menu');
const resultCountOverlay = document.getElementById('result-count-overlay');

function toPascalCase(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

async function fetchProducts() {
  try {
    showLoading();
    const response = await fetch(apiEndpoint);
    if (!response.ok) throw new Error('Failed to fetch products.');
    const data = await response.json();
    products = data.products;
    filteredProducts = products;
    renderProducts();
    populateFilters();
  } catch (error) {
    showError();
  } finally {
    hideLoading();
  }
}

function renderProducts() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = currentPage * itemsPerPage;
  const productsToRender = filteredProducts.slice(start, end);

  productList.innerHTML = '';
  productsToRender.forEach(product => {
    const productItem = document.createElement('div');
    productItem.classList.add('product-item');
    productItem.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}">
      <h2>${product.title}</h2>
      <p class="price">$${product.price.toFixed(2)}</p>
      <p>${product.description.substring(0, 60)}...</p>
    `;
    productList.appendChild(productItem);
  });

  const totalResults = document.getElementById('total-results');
  totalResults.textContent = `${Math.min(end, filteredProducts.length)} results`;

  if (filteredProducts.length <= end) {
    loadMoreBtn.classList.add('hidden');
  } else {
    loadMoreBtn.classList.remove('hidden');
  }
}

function populateFilters() {
  const categories = [...new Set(products.map(product => product.category))];
  
  categories.forEach(category => {
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="checkbox" value="${category}">
      ${toPascalCase(category)}<span></span>
    `;
    categoryFilter.appendChild(label);
  });
  
  categories.forEach(category => {
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="checkbox" value="${category}">
      ${toPascalCase(category)}<span></span>
    `;
    resultCountOverlay.appendChild(label);
  });
}

function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategories = Array.from(categoryFilter.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
  const selectedPrice = priceFilter.value;

  filteredProducts = products.filter(product => {
    return (
      product.title.toLowerCase().includes(searchTerm) &&
      (selectedCategories.length === 0 || selectedCategories.includes(product.category))
    );
  });

  if (selectedPrice === 'low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedPrice === 'high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  renderProducts();
}

function loadMoreProducts() {
  currentPage++;
  renderProducts();
}

function showLoading() {
  loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
  loadingIndicator.classList.add('hidden');
}

function showError() {
  errorIndicator.classList.remove('hidden');
}

function toggleHamburgerMenu() {
  hamburgerMenu.classList.toggle('show');
}

function closeHamburgerMenu() {
  hamburgerMenu.classList.remove('show');
}

searchInput.addEventListener('input', applyFilters);
categoryFilter.addEventListener('change', applyFilters);
priceFilter.addEventListener('change', applyFilters);
loadMoreBtn.addEventListener('click', loadMoreProducts);
hamburgerIcon.addEventListener('click', toggleHamburgerMenu);
closeMenuBtn.addEventListener('click', closeHamburgerMenu);

fetchProducts();

// Created By: Mohan Nukala