const fs = require.requireActual('fs');

const mockCB = function (event, cb) { if (cb) cb(); };
fs.watch = jest.fn().mockReturnValue({
  on: mockCB,
  once: mockCB,
  close: jest.fn(),
});
fs.write = jest.fn();
fs.writeSync = jest.fn();
fs.writeFile = jest.fn();
fs.writeFileSync = jest.fn();

module.exports = fs;
