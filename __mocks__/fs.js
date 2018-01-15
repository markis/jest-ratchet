const fs = require.requireActual('fs');

fs.write = jest.fn();
fs.writeSync = jest.fn();
fs.writeFile = jest.fn();
fs.writeFileSync = jest.fn();

module.exports = fs;
