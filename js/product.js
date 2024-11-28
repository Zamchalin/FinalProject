async function loadProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    console.error("ID товара не найден в URL");
    return;
  }

  try {
    const response = await fetch("../data.json");
    if (!response.ok) {
      throw new Error("Сетевая ошибка: " + response.statusText);
    }
    const allProducts = await response.json();

    const product = allProducts.find((prod) => prod.id === Number(productId));
    console.log(product);

    if (!product) {
      console.error("Товар не найден");
      return;
    }

    displayProductDetails(product);
  } catch (error) {
    console.error("Ошибка при загрузке данных о товаре:", error);
  }
}

function displayProductDetails(product) {
  const productDetailsEl = document.querySelector(".product-page");

  productDetailsEl.innerHTML = `
       <img src="${product.image}" alt="photo" class="product-page__img" />
          <div class="product-page__info">
            <h2 class="product-page__title">${product.name}</h2>
            <p class="product-page__description">
            ${product.description}
            </p>
            <p class="product-page__price">${product.price} рублей</p>
            <button class="product-page__button" data-id="${product.id}">Добавить в корзину</button>
          </div>
      `;

  const button = productDetailsEl.querySelector(".product-page__button");

  // Проверка состояния товара в корзине
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    button.innerText = "Товар в корзине";
    button.disabled = true; // Заблокировать кнопку, если товар в корзине
  }

  button.addEventListener("click", (e) => {
    addToCart(product);
    e.target.innerText = "Товар в корзине";
    e.target.disabled = true; // Заменить текст кнопки и отключить её
  });
}

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1; // Увеличение количества
  } else {
    cart.push({ ...product, quantity: 1 }); // Добавление нового товара
  }

  localStorage.setItem("cart", JSON.stringify(cart)); // Сохранение обновленной корзины
}

loadProductDetails();
