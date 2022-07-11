require('../mocks/fetchSimulator');
const { fetchProducts } = require('../helpers/fetchProducts');
const computadorSearch = require('../mocks/search');

describe('1 - Teste a função fetchProducts', () => {
  it('Testa se fetchProduct é uma função', () => {
    expect(typeof fetchProducts).toEqual('function');
    })
  it('Testa se a função fetch é chamada ao executar fetchProducts com "computador" como parâmetro' , async () => {
    expect.assertions(1);
    await fetchProducts('computador');
    expect(fetch).toHaveBeenCalled();
    })
  it('Testa se ao executar a função fetchProduct com argumento "computador" a função é chamada com o endpoint certo' , async () => {
    expect.assertions(1);
    const rightURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    await fetchProducts('computador');
    expect(fetch).toHaveBeenCalledWith(rightURL);
    })
  it('Testa se ao executar a função fetchProduct com argumento "computador" é retornado o resultado correto' , async () => {
    expect.assertions(1);
    expect(await fetchProducts('computador')).toEqual(computadorSearch);
    })
  it('Testa se ao executar a função fetchProduct sem argumento, retorna um erro com a mensagem: "You must provide an url"' , async () => {
    expect.assertions(1);
    expect(await fetchProducts()).toEqual(new Error('You must provide an url'));
    })
});
