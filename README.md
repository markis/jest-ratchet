# Jest-Ratchet

[![Greenkeeper badge](https://badges.greenkeeper.io/markis/jest-ratchet.svg)](https://greenkeeper.io/)

Ratchet up code coverage - keep test coverage going only one direction -- up

Jest-Ratchet is a coverage watcher for Jest.  Everytime a new level of coverage is reached Jest-Ratchet will automatically update the coverageThreshold.

### Installation

npm
``` bash
npm install jest-ratchet --dev
```

yarn
``` bash
yarn add jest-ratchet --dev
```

### Jest Settings

Add `jest-ratchet` to the `reporters` section.  And also ensure that `collectCoverage` is enabled and `json-summary` is added to the `coverageReporters`.

``` json
{
  "collectCoverage": true,
  "coverageReporters": [
    "json-summary"
  ],
  "reporters": ["jest-ratchet"]
}
```