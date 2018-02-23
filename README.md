# Jest-Ratchet

[![Maintainability](https://api.codeclimate.com/v1/badges/dcf0bf468746ec3dc221/maintainability)](https://codeclimate.com/github/markis/jest-ratchet/maintainability)
[![Build Status](https://travis-ci.org/markis/jest-ratchet.svg?branch=master)](https://travis-ci.org/markis/jest-ratchet)
[![Coverage Status](https://coveralls.io/repos/github/markis/jest-ratchet/badge.svg?branch=master)](https://coveralls.io/github/markis/jest-ratchet?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/markis/jest-ratchet/badge.svg?targetFile=package.json)](https://snyk.io/test/github/markis/jest-ratchet?targetFile=package.json)
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

```json
{
  "collectCoverage": true,
  "coverageReporters": [ "json-summary" ],
  "reporters": [ "jest-ratchet" ]
}
```
