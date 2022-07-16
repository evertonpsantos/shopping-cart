const itemsSection = document.querySelector('.items');
const cartItemSection = document.querySelector('.cart__items');
const priceSection = document.querySelector('.total-price');
const emptyCartButton = document.querySelector('.empty-cart');
const cartIcon = document.querySelector('.material-icons');
const cartContainer = document.querySelector('.cart');
const pageContainer = document.querySelector('.container');

const showCartSection = () => {
  cartIcon.addEventListener('click', () => {
    cartContainer.classList.toggle('hide');
  });
};

const getPrices = () => {
  let sum = 0;
  [...document.getElementsByClassName('cart__item')].forEach((item) => { 
    const price = Number(item.innerText.split('$')[1]);
    sum += price;
  });
  priceSection.innerText = `Preço Total: ${sum.toFixed(2)}`;
  if (sum === 0) {
    priceSection.innerText = 'Cart empty 😟';
    emptyCartButton.classList.add('hide');
  }
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
  const product = event.target.parentElement;
  product.remove();
  await saveCartItems(cartItemSection.innerHTML);
  if (cartItemSection.children.length === 0) {
    localStorage.removeItem('cartItems');
  }
  getPrices();
};

const createCartItemImage = (image) => {
  const cartImage = document.createElement('img');
  cartImage.src = image;
  cartImage.className = 'cart-item-image';
  return cartImage;
};

const createCartItemElement = ({ name, salePrice, image }) => {
  const cartItem = document.createElement('div');
  cartItem.className = 'cart-item-section';

  const deleteButtonCart = document.createElement('div');
  deleteButtonCart.innerText = 'X';
  deleteButtonCart.className = 'delete-item';

  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `${name} | $${salePrice}`;

  cartItem.appendChild(createCartItemImage(image));
  cartItem.appendChild(li);
  cartItem.appendChild(deleteButtonCart);
  deleteButtonCart.addEventListener('click', cartItemClickListener);
  return cartItem;
};

const createCartItem = async (sku) => {
  const { title, price, thumbnail } = await fetchItem(sku);
  const obj = { name: title, salePrice: price, image: thumbnail };
  cartItemSection.appendChild(createCartItemElement(obj));
  saveCartItems(cartItemSection.innerHTML);
};

const addingListeners = () => {
  const addButtons = document.getElementsByClassName('item__add');
  [...addButtons].forEach((element) => {
    element.addEventListener('click', async (e) => {
      const clicked = e.target.parentElement;
      const sku = getSkuFromProductItem(clicked);
      await createCartItem(sku);
      getPrices();
      cartContainer.classList.remove('hide');
      emptyCartButton.classList.remove('hide');
    });
  }); 
};

const emptyCart = () => {
  emptyCartButton.addEventListener('click', () => {
    const cartItems = document.getElementsByClassName('cart-item-section');
    [...cartItems].forEach((item) => item.remove());
    localStorage.removeItem('cartItems');
    getPrices();
  });
};

const recoverCartItems = () => {
  const cartItems = JSON.parse(getSavedCartItems('cartItems'));
  cartItemSection.innerHTML = cartItems;
  [...document.querySelectorAll('.delete-item')].forEach((deleteButton) => {
    deleteButton.addEventListener('click', cartItemClickListener);
  });
};

const showScrollTopButton = () => {
  const scrollButton = document.querySelector('.scroll-top');
  const scroll = document.documentElement.scrollTop;
  if (scroll > 500) {
    scrollButton.style.display = 'block';
  } else {
    scrollButton.style.display = 'none';
  }
};

const scrollTop = () => {
  const scrollTopButton = document.createElement('button');
  scrollTopButton.classList.add('scroll-top');
  scrollTopButton.innerText = '⬆️';
  scrollTopButton.addEventListener('click', () => {
    document.documentElement.scrollTop = 0;
  })
  pageContainer.appendChild(scrollTopButton);
};

window.onload = async () => { 
  addingLoadingElement();
  await createItems(); 
  addingListeners(); 
  removingLoadingElement();
  if (localStorage.cartItems) {
    recoverCartItems();
    cartContainer.classList.remove('hide');
    emptyCartButton.classList.remove('hide');
  }
  getPrices();
  emptyCart();
  showCartSection();
  scrollTop();
};

window.onscroll = () => showScrollTopButton();