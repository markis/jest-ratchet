# Jest-Ratchet

[![Maintainability](https://api.codeclimate.com/v1/badges/dcf0bf468746ec3dc221/maintainability)](https://codeclimate.com/github/markis/jest-ratchet/maintainability)
[![Build Status](https://travis-ci.org/markis/jest-ratchet.svg?branch=master)](https://travis-ci.org/markis/jest-ratchet)
[![Coverage Status](https://coveralls.io/repos/github/markis/jest-ratchet/badge.svg?branch=master)](https://coveralls.io/github/markis/jest-ratchet?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/markis/jest-ratchet/badge.svg?targetFile=package.json)](https://snyk.io/test/github/markis/jest-ratchet?targetFile=package.json)


Ratchet up code coverage - keep test coverage going only one direction -- up

Jest-Ratchet is a coverage watcher for Jest. Everytime a new level of coverage is reached Jest-Ratchet will automatically update the coverageThreshold.

## What does it do?

Lets say you have some [jest coverage thresholds](https://facebook.github.io/jest/docs/configuration.html#coveragethreshold-object) set in the `package.json` for your project at the following values:
```javascript
{
  "branches": 30,
  "functions": 30,
  "lines": 30,
  "statements": 50,
}
```

then you get inspired one day and write lots of tests. Now your actual coverage summary might look like this:
```javascript
{
  "branches": 50,
  "functions": 60,
  "lines": 77,
  "statements": 50,
}
```

Great 🌸‼ Except you'd really like your accomplishment to set the new standard for test coverage in this project. **`jest-coverage-ratchet` just does that automatically by looking at your current coverage summary, comparing it to your specified coverage thresholds, and updating the minimum for any threshold that is higher in the summary.**

So given the previous values, running this script will update your coverage thresholds specified in the `jest` key of `package.json` to the following values:
```javascript
{
  "branches": 50,
  "functions": 60,
  "lines": 77,
  "statements": 50,
}
```

### Ratcheting at *Folder* level
Jest currently supports checking coverage thresholds at individual folder level and this package allows ratcheting for the same
```javascript
  "coverageThreshold": {
    "global": {
      "branches": Number,
      "functions": Number,
      "lines": Number,
      "statements": Number
    },
    "./src/imp-folder/": {
      "branches": 85,
      "functions": 85,
      "lines": 85,
      "statements": 85
    },
    "./very-imp-folder/": {
      "branches": 90,
      "functions": 90,
      "lines": 90,
      "statements": 90
    }
  }
```


### Installation

npm

```bash
npm install jest-ratchet --dev
```

yarn

```bash
yarn add jest-ratchet --dev
```

### Jest Settings

Add `jest-ratchet` to the `reporters` section. And also ensure that `collectCoverage` is enabled and `json-summary` is added to the `coverageReporters`.

```json
{
  "collectCoverage": true,
  "coverageReporters": ["json", "lcov", "text", "clover", "json-summary"],
  "reporters": ["default", "jest-ratchet"]
}
```

### Optional Settings

By default, Jest-Ratchet is aggressive with updating coverage thresholds. Every time your coverage ticks up by 0.01%, the coverageThreshold is updated. There are a couple of options dampen this behavior.

- tolerance (number): keeps the threshold below the measured coverage, allowing wiggle room. default: 0 tolerance
- roundDown (boolean): round down to the nearest integer. default: false
- timeout (number): the number of milliseconds to wait for to the Jest coverage json summary. default: wait indefinitely

Here's how to pass configuration to Jest-Ratchet, per the [Jest documentation](https://jestjs.io/docs/en/configuration.html#reporters-array-modulename-modulename-options)

```json
{
  "collectCoverage": true,
  "coverageReporters": ["json", "lcov", "text", "clover", "json-summary"],
  "reporters": [
    "default",
    [
      "jest-ratchet",
      { "tolerance": 2, "roundDown": true, "timeout": 5000 }
    ]
  ]
}
```

## Assumptions

I know what happens [when you assume](http://www.urbandictionary.com/define.php?term=Assume), but `jest-coverage-ratchet` makes the following assumptions about your project.

- `jest` has been run for project at least once with `--coverage` so that there is a valid file at the path `./coverage/coverage-summary.json` _(alternatively pass a path with `--coverageSummaryPath` of `./your/path/to/coverage-summary.json`)_
- `jest` configuration object is present in the `package.json` that specifies at least:
  - [coverage thresholds](https://facebook.github.io/jest/docs/configuration.html#coveragethreshold-object) _(alternatively pass a path with `--configPath` of `./your/path/to/jest.config.json`)_
  - `'json-summary'` in your jest config's [reporters list](https://facebook.github.io/jest/docs/configuration.html#coveragereporters-array-string) like so:
  ```javascript
  {
    // ...
    "jest": {
      "coverageReporters": [
        "json-summary"
      ],
      "coverageThreshold": {
        "global": {
          "branches": Number,
          "functions": Number,
          "lines": Number,
          "statements": Number,
        }
      }
    },
    // ...
  }
  ```
- For ratcheting at folder level, `threshold-name` should be folder path relative to the root of the project starting with './' and end with '/'
  For eg - 
  ```javascript
  './src/imp' // incorrect usage (not ending with '/')
  './src/imp/' // correct usage
  'src/imp' // incorrect usage (does not start with './')

Should this tool support things like piping the coverage data in as an argument? Of course it should. If you want to build that and send a PR I will be all smiles 😀✨. If not then you probably see me do it _eventually_.
