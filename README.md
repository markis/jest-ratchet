# Jest-Ratchet

[![Maintainability](https://api.codeclimate.com/v1/badges/dcf0bf468746ec3dc221/maintainability)](https://codeclimate.com/github/markis/jest-ratchet/maintainability)
[![Build Status](https://travis-ci.org/markis/jest-ratchet.svg?branch=master)](https://travis-ci.org/markis/jest-ratchet)
[![Coverage Status](https://coveralls.io/repos/github/markis/jest-ratchet/badge.svg?branch=master)](https://coveralls.io/github/markis/jest-ratchet?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/markis/jest-ratchet/badge.svg?targetFile=package.json)](https://snyk.io/test/github/markis/jest-ratchet?targetFile=package.json)

Ratchet up code coverage - keep test coverage going only one direction -- up

Jest-Ratchet is a coverage watcher for Jest. Everytime a new level of coverage is reached Jest-Ratchet will automatically update the coverageThreshold.

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
- maxThresholds (object|number): the maximum value to ratchet all thresholds up to or each threshold can have a unique value. default: unbound

Here's how to pass configuration to Jest-Ratchet, per the [Jest documentation](https://jestjs.io/docs/en/configuration.html#reporters-array-modulename-modulename-options)

```json
{
  "collectCoverage": true,
  "coverageReporters": ["json", "lcov", "text", "clover", "json-summary"],
  "reporters": [
    "default",
    ["jest-ratchet", { "tolerance": 2, "roundDown": true, "timeout": 5000, "maxThresholds": 90 }]
  ]
}
```

Here is how to define different max thresholds for each jest threshold

```json
{
  "collectCoverage": true,
  "coverageReporters": ["json", "lcov", "text", "clover", "json-summary"],
  "reporters": [
    "default",
    [
      "jest-ratchet",
      {
        "tolerance": 2,
        "roundDown": true,
        "timeout": 5000,
        "maxThresholds": {
          "branches": 80,
          "lines": 75,
          "functions": 90,
          "statements": -100
        }
      }
    ]
  ]
}
```
