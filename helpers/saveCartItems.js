const saveCartItems = (arg) => {
  if (!arg) return new Error('Parâmetro necessário!');
  localStorage.setItem('cartItems', arg);
};

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
