const fetchItem = async (productId) => {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${productId}`);
    const result = await response.json();
    return result;
  } catch (error) {
    return new Error('You must provide an url');
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
