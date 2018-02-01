const path = require('path');

const realFs = require.requireActual('fs');
const fs = jest.genMockFromModule('fs');

let regexes = [];
let contents = [];
function __addMockFile(regex, content) {
  regexes.push(regex);
  contents.push(content);
}
function __resetMockFiles() {
  regexes = [];
  contents = [];
}
function readFileSync(path, options) {
  for (let i = 0; i < regexes.length; i++) {
    if (regexes[i].test(path)) {
      return contents[i];
    }
  }
  return realFs.readFileSync(path, options);
}

function mockCB(type, cb) {
  cb();
}

function watch() {
  return {
    on: mockCB,
    once: mockCB,
    close: jest.fn(),
  };
}

fs.__addMockFile = __addMockFile;
fs.__resetMockFiles = __resetMockFiles;
fs.existsSync = function() { return false; };
fs.readFileSync = readFileSync;
fs.watch = watch;

module.exports = fs;
