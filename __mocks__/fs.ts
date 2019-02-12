const realFs = require.requireActual('fs');

let regexes: RegExp[] = [];
let contents: string[] = [];
function __addMockFile(regex: RegExp, content: string) {
  regexes.push(regex);
  contents.push(content);
}
function __resetMockFiles() {
  regexes = [];
  contents = [];
}
function readFileSync(path: string, options: any) {
  for (let i = 0; i < regexes.length; i++) {
    if (regexes[i].test(path)) {
      return contents[i];
    }
  }
  return realFs.readFileSync(path, options);
}

function mockCB(_: any, cb: any) {
  cb();
}

function watch() {
  return {
    close: jest.fn(),
    on: mockCB,
    once: mockCB,
  };
}

const closeSync = jest.fn();
const existsSync = jest.fn().mockReturnValue(false);
const mkdirSync = jest.fn();
const openSync = jest.fn();
const writeFileSync = jest.fn();

export {
  __addMockFile,
  __resetMockFiles,
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  watch,
  writeFileSync,
};
