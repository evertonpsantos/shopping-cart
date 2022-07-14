const itemsSection = document.querySelector('.items');
const cartItemSection = document.querySelector('.cart__items');
const priceSection = document.querySelector('.total-price');
const emptyCartButton = document.querySelector('.empty-cart');

const getPrices = async () => {
  const cartItem = document.querySelectorAll('.cart__item');
  let sum = 0;
  cartItem.forEach((item) => { 
    const price = Number(item.innerText.split('$')[1]);
    sum += price;
  });
  const rightSum = (Math.round(sum)).toFixed(2);
  const totalPhrase = `Preço Total: ${rightSum}`;
  priceSection.innerText = totalPhrase;
};

const addingLoadingElement = () => {
  const loadingElement = document.createElement('div');
  loadingElement.className = 'loading';
  loadingElement.innerText = 'carregando...';
  itemsSection.appendChild(loadingElement);
};

const removingLoadingElement = () => {
  const loadingElement = document.querySelector('.loading');
  loadingElement.remove();
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
  product.remove();
  const cartItems = JSON.parse(getSavedCartItems('cartItems'));
  console.log(cartItems.length);
  const filtered = cartItems.filter((item) => !product.innerText.includes(item));
  await saveCartItems(filtered);
  getPrices();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const createCartItem = async (sku) => {
  const { id, title, price } = await fetchItem(sku);
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
      await createCartItem(sku);
      getPrices();
      saveCartItems(items);
    });
  }); 
};

const emptyCart = () => {
  emptyCartButton.addEventListener('click', () => {
    const cartItems = document.getElementsByClassName('cart__item');
    [...cartItems].forEach((item) => item.remove());
    localStorage.removeItem('cartItems');
    priceSection.innerText = 'Preço Total: 0';
  });
};

window.onload = async () => { 
  addingLoadingElement();
  await createItems(); 
  addingListeners(); 
  removingLoadingElement();
  if (localStorage.cartItems) {
    const cartItems = JSON.parse(getSavedCartItems('cartItems'));
    cartItems.forEach(async (cartItem) => {
      await createCartItem(cartItem);
      getPrices();
    });
  }
  emptyCart();
};