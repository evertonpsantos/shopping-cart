const localStorageSimulator = require('../mocks/localStorageSimulator');
const saveCartItems = require('../helpers/saveCartItems');

localStorageSimulator('setItem');

describe('3 - Teste a função saveCartItems', () => {
  it('Testa se ao executar saveCartItems com argumento o método localStorage.setItem é chamado', () => {
    const myObj = {
      key: 'valor',
    }
    saveCartItems(myObj);
    expect(localStorage.setItem).toHaveBeenCalled();
  });
  it('Testa se ao executar saveCartItems com argumento o método localStorage.setItem é chamado com dois parâmetros, sendo o primeiro "cartItems" e o segundo sendo o valor passado como argumento para saveCartItems.', () => {
    const myObj = {
      key: 'valor',
    }
    saveCartItems(myObj);
    expect(localStorage.setItem).toHaveBeenCalledWith('cartItems', myObj);
  });
  it('Testa se ao chamar saveCartItems sem argumento retorna um erro', () => {
    expect(saveCartItems()).toEqual(new Error('Parâmetro necessário!'));
  });
});
