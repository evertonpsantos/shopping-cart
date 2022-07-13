const getSavedCartItems = (arg) => {
  if (!arg) return new Error('Parâmetro necessário!');
  return localStorage.getItem(arg);
};

if (typeof module !== 'undefined') {
  module.exports = getSavedCartItems;
}

