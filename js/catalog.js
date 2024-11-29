let allProducts = [];
let currentFilterType = "Весь ассортимент";
let currentSortOrder = "Без фильтра";

async function loadProducts() {
  try {
    const response = await fetch("../data.json");
    if (!response.ok) {
      throw new Error("Сетевая ошибка: " + response.statusText);
    }
    allProducts = await response.json(); // Сохраняем все продукты в переменную
    displayProducts(allProducts); // Отображаем все продукты
    initializeFilters(); // Инициализация фильтров после загрузки
    initializeSort(); // Инициализация сортировки  после загрузки
    updateButtonStates();
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
  }
}

function updateProductsDisplay() {
  let filteredProducts = filterProductsByType(currentFilterType);
  let sortedProducts = sortProducts(filteredProducts, currentSortOrder);
  displayProducts(sortedProducts);
  updateButtonStates();
}
function updateButtonStates() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.forEach((cartItem) => {
    const button = document.querySelector(
      `.product__button[data-id='${cartItem.id}']`
    );
    if (button) {
      button.innerText = "Товар в корзине"; // Изменяем текст кнопки
      button.disabled = true; // Дизейблим кнопку
    }
  });
}
function displayProducts(products) {
  const productsEl = document.querySelector(".products");
  productsEl.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
    <img class="product__img" src="${product.image}" alt="el1" />
          <div class="product__info">
          <a  class = "product__link"  href="product.html?id=${product.id}">
            <h3 class="product__name" >
              ${product.name}
            </h3>
            </a>
            <p class="product__description">
              ${product.description}
            </p>
            <p class="product__price">${product.price} рублей</p>
            <button class="product__button" data-id="${product.id}">Добавить в корзину</button>

      `;
    productsEl.appendChild(card);
  });
  const buttonEls = document.querySelectorAll(".product__button");
  buttonEls.forEach((e) => {
    e.addEventListener("click", (e) => {
      const productId = e.target.dataset.id;
      const product = products.find((prod) => prod.id == productId); // Находим продукт по ID

      // Добавляем продукт в корзину
      addToCart(product);
      e.target.innerText = "Товар в корзине";
      e.target.disabled = true;
    });
  });
}

function filterProductsByType(type) {
  return allProducts.filter(
    (product) => type === "Весь ассортимент" || product.type === type
  );
}

function addToCart(product) {
  // Получаем текущую корзину из LocalStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Проверяем, есть ли уже товар в корзине
  const existingProduct = cart.find((item) => item.id === product.id);

  // Если товара нет, добавляем новый объект товара
  cart.push({ ...product, quantity: 1 });

  // Сохраняем обновленную корзину в LocalStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}
function sortProducts(products, order) {
  let sortedProducts = [...products];
  if (order === "По увеличению цены") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (order === "По убыванию цены") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }
  return sortedProducts;
}

function initializeFilters() {
  const filterLinks = document.querySelectorAll(".filter__link");

  filterLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      currentFilterType = link.innerText;
      updateProductsDisplay(); // Обновление списка продуктов
    });
  });
}

function initializeSort() {
  const sortLinks = document.querySelectorAll(".sort__link");

  sortLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      currentSortOrder = event.target.innerText;
      updateProductsDisplay(); // Обновление списка продуктов
    });
  });
}

loadProducts();
