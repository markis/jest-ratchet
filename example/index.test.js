var math = require('./index');

describe('Test', function() {
  test('Add 1 plus 1', function() {
    expect(math.add(1, 1)).toBe(2);
  })
})
