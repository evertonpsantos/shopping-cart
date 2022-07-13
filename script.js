// const { fetchProducts } = require('./helpers/fetchProducts');

// const saveCartItems = require("./helpers/saveCartItems");

// const getSavedCartItems = require("./helpers/getSavedCartItems");

// const saveCartItems = require("./helpers/saveCartItems");

// const { fetchItem } = require("./helpers/fetchItem");

const itemsSection = document.querySelector('.items');
// const cartSection = document.querySelector('.cart');
const cartItemSection = document.querySelector('.cart__items');
const priceSection = document.querySelector('.total-price');
const emptyCartButton = document.querySelector('.empty-cart');

const getPrices = async () => {
  let sum = 0;
  const cartItems = JSON.parse(getSavedCartItems('cartItems'));
  if (cartItems.length === 0 || !cartItems) {
    const totalPhrase = `Preço Total: ${sum}`;
    priceSection.innerText = totalPhrase;
  }
  cartItems.forEach(async (item) => {
    const { price } = await fetchItem(item);
    sum += price;
    const totalPhrase = `Preço Total: ${Math.round(sum)}`;
    priceSection.innerText = totalPhrase;
  });
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const createItems = async () => {
  const products = await fetchProducts('computador');
  products.results.forEach(({ id, title, thumbnail }) => {
    itemsSection.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = async (event) => {
  const product = event.target;
  const cartItems = JSON.parse(getSavedCartItems('cartItems'));
  const filtered = cartItems.filter((item) => !product.innerText.includes(item));
  await saveCartItems(filtered);
  getPrices();
  product.remove();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const createCartItem = async (sku) => {
  const product = await fetchItem(sku);
  const { id, title, price } = product;
  cartItemSection.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
};

const addingListeners = () => {
  const addButtons = document.getElementsByClassName('item__add');
  const items = [];
  [...addButtons].forEach((element) => {
    element.addEventListener('click', async (e) => {
      const clicked = e.target.parentElement;
      const sku = getSkuFromProductItem(clicked);
      items.push(sku);
      await saveCartItems(items);
      createCartItem(sku);
      getPrices();
    });
  }); 
};

const emptyCart = () => {
  emptyCartButton.addEventListener('click', () => {
    const cartItems = document.getElementsByClassName('cart__item');
    [...cartItems].forEach((item) => item.remove());
    localStorage.removeItem('cartItems');
    priceSection.innerHTML = '';
  });
};

window.onload = async () => { 
  await createItems(); 
  addingListeners(); 
  if (localStorage.cartItems) {
    const cartItems = JSON.parse(getSavedCartItems('cartItems'));
    cartItems.forEach(async (cartItem) => {
      await createCartItem(cartItem);
      getPrices();
    });
  }
  emptyCart();
};