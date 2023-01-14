import * as utils from './utility-functions';
describe('utility-function', () => {
  const data = [
    { username: 'user01', age: 10 },
    { username: 'user02', age: 10 },
    { username: 'user03', age: 14 },
    { username: 'user04', age: 15 },
    { username: 'user04', age: 16 },
  ];
  const user1 = { username: 'user04', age: 12 };
  const user2 = { username: 'user', age: 12 };

  beforeEach(() => {});

  it('findByProperty', () => {
    const find1 = utils.findByProperty(data, 'username', user1);
    expect(find1?.age).toEqual(15);
    expect(find1?.username).toEqual('user04');
    const find2 = utils.findByProperty(data, 'username', user2);
    expect(find2).toBeUndefined();
    const find3 = utils.findByProperty(data, 'username', user1);
    expect(find3?.age).toBe(15);
  });

  it('findIndexByProperty using an object as search param', () => {
    const index1 = utils.findIndexByProperty(data, 'username', user1);
    expect(index1).toEqual(3);
    const index2 = utils.findIndexByProperty(data, 'username', user2);
    expect(index2).toEqual(-1);
  });

  it('findIndexByProperty using a primitive value as search param', () => {
    const index3 = utils.findIndexByProperty(data, 'username', 'user04');
    expect(index3).toEqual(3);
    const index4 = utils.findIndexByProperty(data, 'username', 'user');
    expect(index4).toEqual(-1);
  });
});
