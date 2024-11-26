async function loadProducts() {
  try {
    const response = await fetch("../data.json");
    if (!response.ok) {
      throw new Error("Сетевая ошибка: " + response.statusText);
    }
    allProducts = await response.json(); // Сохраняем все продукты в переменную
    displayProducts(allProducts); // Отображаем все продукты
    initializeFilters(); // Инициализация фильтров после загрузки
    initializeSort();
    updateButtonStates();
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
  }
}
function updateButtonStates() {
  // Получаем корзину из localStorage
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

// Функция фильтрации продуктов
function filterProductsByType(type) {
  return allProducts.filter(
    (product) => type === "Весь ассортимент" || product.type === type
  );
}

// Инициализация фильтров
function initializeFilters() {
  const filterLinks = document.querySelectorAll(".filter__link");

  filterLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Предотвращаем переход по ссылке
      const selectedType = link.innerText;

      const filteredProducts = filterProductsByType(selectedType);
      displayProducts(filteredProducts);
      updateButtonStates();
    });
  });
}
function addToCart(product) {
  // Получаем текущую корзину из LocalStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Проверяем, есть ли уже товар в корзине
  const existingProduct = cart.find((item) => item.id === product.id);
  if (existingProduct) {
    // Если товар уже есть, увеличиваем его количество
    existingProduct.quantity += 1;
  } else {
    // Если товара нет, добавляем новый объект товара
    cart.push({ ...product, quantity: 1 });
  }

  // Сохраняем обновленную корзину в LocalStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

function sortProductPlus(products) {
  return products.slice().sort((a, b) => a.price - b.price); // Возвращаем отсортированный массив по возрастанию
}

function sortProductMinus(products) {
  return products.slice().sort((a, b) => b.price - a.price); // Возвращаем отсортированный массив по убыванию
}

function initializeSort() {
  const sortLinks = document.querySelectorAll(".sort__link");

  sortLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Предотвращаем переход по ссылке
      let sortedProducts = [];

      if (event.target.innerText === "По убыванию цены") {
        sortedProducts = sortProductMinus([...allProducts]); // Клонируем массив, чтобы не изменять оригинал
        displayProducts(sortedProducts);
      } else if (event.target.innerText === "По увеличению цены") {
        sortedProducts = sortProductPlus([...allProducts]);
        displayProducts(sortedProducts); // Клонируем массив
      } else if (event.target.innerText === "Без фильтра") {
        displayProducts(allProducts);
      }

      // Показываем отсортированные продукты
      updateButtonStates();
    });
  });
}

// Вызов функции для загрузки продуктов
loadProducts();
