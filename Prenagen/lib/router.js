const config = require('../config.json')

function getFoUrl() {
  let url;
  if (config.env === 'dev') {
    url = config.url.dev.frontoffice;
  } else if (config.env === 'stg') {
    url = config.url.staging.frontoffice;
  }
  return url;
};

function getBoUrl() {
  let url;
  if (config.env === 'dev') {
    url = config.url.dev.backoffice;
  } else if (config.env === 'stg') {
    url = config.url.stg.backoffice;
  }
  return url;
};

function getPrenagenUrl() {
  let url;
  if (config.env === 'dev') {
    url = config.url.dev.prenagen;
  } else if (config.env === 'stg') {
    url = config.url.staging.prenagen;
  }
  return url;
};

module.exports = {
  getFoUrl: getFoUrl,
  getBoUrl: getBoUrl,
  getPrenagenUrl: getPrenagenUrl
};