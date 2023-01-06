#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const packageJSON = require('./package/package.json');

const src = path.resolve(
  __dirname,
  `./dist/standard-charts_v${packageJSON.version}.js`
);
const dest = path.resolve(__dirname, './public/download');

// delete the download folder
if (fs.existsSync(dest)) {
  fs.rmdirSync(dest, { recursive: true });
}

// create the download folder
fs.mkdirSync(dest);

// copy the file
fs.copyFileSync(
  src,
  path.resolve(dest, `standard-charts_v${packageJSON.version}.js`)
);

console.log('Distributed download in /public!');
