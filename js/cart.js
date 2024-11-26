let cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayProducts(products) {
  const cart__productsEl = document.querySelector(".cart__products");
  cart__productsEl.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "cart__product";
    card.innerHTML = `
      <img class="cart__product_img" src="${product.image}" alt="el1" />
      <div class="cart__product_info">
       <a  class = "product__link"  href="product.html?id=${product.id}">
        <h3 class="cart__product_name">
          ${product.name}
        </h3>
        </a>
        <p class="cart__product_description">
          ${product.description}
        </p>
        <p class="cart__product_price">${product.price} рублей</p>
        <button class="cart__product_button" data-id="${product.id}">Удалить из корзины</button>
      </div>
    `;
    cart__productsEl.appendChild(card);
  });

  updatePrice();
  addDeleteListeners();
}

function updatePrice() {
  const totalPrice = cart.reduce((accumulator, item) => {
    return accumulator + item.price;
  }, 0);
  const cart__pay_priceEl = document.querySelector(".cart__pay_price");
  cart__pay_priceEl.innerText = totalPrice;
}

function deleteProduct(item) {
  cart = cart.filter((cartItem) => cartItem.id !== item);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayProducts(cart);
}

function addDeleteListeners() {
  const deleteEls = document.querySelectorAll(".cart__product_button");
  deleteEls.forEach((product) => {
    product.addEventListener("click", function (e) {
      deleteProduct(Number(e.target.getAttribute("data-id")));
    });
  });
}

displayProducts(cart);
