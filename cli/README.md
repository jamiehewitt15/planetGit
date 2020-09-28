# FTPackage
A package to fetch URLs that contain JSON data and return the contents in a promise.

# What is this package for?

This package requests all JSON data from an array of URLs. The requests are handled asynchronously and any erros are caught during the process.

# Features
- This package makes use of the `fetch` API (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) made available in node through the `node-fetch` dependancy (https://www.npmjs.com/package/node-fetch). This is an alternative to `XMLHttpRequest` that requires minimal code.
- This package uses `async` & `await` for the asynchronous requests.

# Installation
```
 npm install ftproject
```
# Loading and configuring the module
We suggest you load the module via `require`:
```
const requestMultipleUrls = require('ftproject');
```
# Common Use Case Example
```
const requestMultipleUrls = require('ftproject');

const urls = [
'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/ftse-fsi.json',
'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-hkd.json',
'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-usd.json'
];

requestMultipleUrls(urls).then(urlContent => {
    console.log(urlContent)
    });
```
