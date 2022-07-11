require('../mocks/fetchSimulator');
const { fetchItem } = require('../helpers/fetchItem');
const item = require('../mocks/item');

describe('2 - Teste a função fetchItem', () => {
  it('Testa se fetchItem é uma função', () => {
    expect(typeof fetchItem).toEqual('function');
  });
  it('Testa se a função fetch é chamada ao executar fetchItem("MLB1615760527")', () => {
    expect.assertions(1);
    fetchItem('MLB1615760527');
    expect(fetch).toHaveBeenCalled();
  });
  it('Testa se ao chamar fetchItem("MLB1615760527") a função fetch é chamada com o parâmetro correto', async () => {
    expect.assertions(1);
    const endpoint = 'https://api.mercadolibre.com/items/MLB1615760527';
    await fetchItem('MLB1615760527');
    expect(fetch).toHaveBeenCalledWith(endpoint);
  });
  it('Testa se ao chamar fetchItem("MLB1615760527") retorna o objeto correto', async () => {
    expect.assertions(1);
    expect(await fetchItem('MLB1615760527')).toEqual(item);
  });
  it('Testa se ao chamar fetchItem sem argumento retorna um erro', async () => {
    expect.assertions(1);
    expect(await fetchItem()).toEqual(new Error('You must provide an url'));
  });
});
