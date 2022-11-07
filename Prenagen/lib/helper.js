const faker = require('faker/locale/id_ID')
const { Random } = require("random-js");
const config = require('../config');
const appRoot = require('app-root-path');

/**
 * Random full name
 * @param {Boolean} gender default: male
 * @param {Boolean} uppercase default: true
 * @returns {String} first name + last name
 */
function randName(gender = 0, uppercase = true) {
  let firstName = faker.name.firstName(gender)
  let lastName = faker.name.lastName(gender)

  let result = `${firstName} ${lastName}`
  if (uppercase)
    result = result.toUpperCase()
  return result
}

function randFisrtName(gender = 0, uppercase = true) {
  let firstName = faker.name.firstName(gender)

  let result = `${firstName}`
  if (uppercase)
    result = result.toUpperCase()
  return result
}

function randLastName(gender = 0, uppercase = true) {
  let lastName = faker.name.lastName(gender)

  let result = `${lastName}`
  if (uppercase)
    result = result.toUpperCase()
  return result
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

/**
 * Random integer
 * @param {Number} length default: 9
 * @returns {Number} random integer with passed length
 */
function randInt(length = 9) {
  let min = ''
  let max = ''
  for (let i = 0; i < length; i++) {
    min += i !== 0 ? '0' : '1';
    max += '9';
  }
  return new Random().integer(min, max)
}

/**
 * Random string number if you need number
 * larger than 15 digits
 * @param {Number} length default: 9
 * @returns {String} random integer with passed length
 */
function randNumber(length = 11) {
  let pool = '1234567890';
  let result = new Random().string(length, pool);
  if (result.charAt(0) === '0') {
    let first = new Random().integer(1, 9);
    result = first + result.slice(1, result.length);
  }
  return result;
}

/**
 * Random alphanumeric string
 * @param {Number} length default: 9
 * @param {Boolean} lowercase default: true
 * @returns {String} random integer with passed length
 */
function randAlphanumeric(length = 9, lowercase = true) {
  let pool = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let result = new Random().string(length, pool)
  if (lowercase)
    result = result.toLowerCase()
  return result
}

function randNamauser(length = 9, lowercase = true) {
  let pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = new Random().string(length, pool)
  if (lowercase)
    result = result.toLowerCase()
  return result
}
/**
 * Random email address
 * @returns {String} random email address
 */
function randEmail() {
  return `test.${randAlphanumeric(8)}@kalbeloyalti.com`
}

/**
 * Random url
 * @returns {String} random url
 */
function randUrl() {
  return `https://chakrarewards.com${new Random().uuid4()}`
}

/**
 * Random address based on resources/json/id-region.json
 */
function randAddress() {
  const addressPool = require('../resources/json/id-region.json');
  const random = new Random().die(addressPool.length);
  return addressPool[random - 1];
}

/**
 * 
 * @param {Number} endYear 
 * @param {Number} startYear
 * 
 * @returns {String} YYYY-MM-DD 
 */
function randDate(endYear = 2000, startYear = 1970) {
  let startDate = new Date(`${startYear}-01-01`);
  let endDate = '';
  if (endYear === null) {
    endDate = new Date();
  } else {
    endDate = new Date(`${endYear}-01-01`);
  }
  return formatDate(new Random().date(startDate, endDate));
}

/**
 * Format date to DD-MM-YYYY
 * @param {Object} date dateObject 
 * 
 * @returns {String} DD-MM-YYYY
 */
function formatDate(date) {
  let d = date,
    day = '' + d.getDate(),
    month = '' + (d.getMonth() + 1),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  let result = [day, month, year];
  return result.join('/');
}

/**
 * Random future date
 * 
 * @param {Number} endYear 
 * @param {Number} startYear
 * @param {Number} days default = +30 days after today
 * 
 * @returns {String} DD-MM-YYYY
 */
function randFutureDate(endYear = null, startYear = null, days = 30) {
  let startDate = startYear === null ? new Date() : new Date(`${startYear}-01-01`);
  startDate.setDate(startDate.getDate() + days);
  let endDate = endYear === null ? new Date() : new Date(`${endYear}-01-01`);
  endDate.setDate(endDate.getDate() + days * 2);
  return formatDate(new Random().date(startDate, endDate));
}

/**
 * Random description
 * 
 * @param {Number} paragraphCount 
 * 
 * @returns {String} random description
 */
function randDescription(paragraphCount = 1) {
  return `${faker.company.bs()}. ${faker.lorem.paragraphs(paragraphCount)}`;
}

/**
 * Back date by year
 * @param {Number} yearCount 
 * 
 * @returns {String} YYYY-MM-DD
 */
function backDateByYear(yearCount) {
  let date = new Date();
  date.setFullYear(date.getFullYear() - yearCount);
  return formatDate(date);
}

function getDefaultPassword() {
  return config.default.password;
}

function rootPath() {
  return appRoot.path;
}

/**
 * Generate array of ascending years
 * 
 * @param {Number} count
 * 
 * @returns {Array} series of ascending years
 */
function genYearSeries(count) {
  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();

  let yearSeries = Array.from(new Array(count), (val, index) => currentYear--);

  return yearSeries.reverse();
}

module.exports = {
  randName: randName,
  randFisrtName: randFisrtName,
  randLastName: randLastName,
  randNamauser: randNamauser,
  randInt: randInt,
  randNumber: randNumber,
  randAlphanumeric: randAlphanumeric,
  randEmail: randEmail,
  randUrl: randUrl,
  randAddress: randAddress,
  formatDate: formatDate,
  randDate: randDate,
  randFutureDate: randFutureDate,
  randDescription: randDescription,
  backDateByYear: backDateByYear,
  getDefaultPassword: getDefaultPassword,
  rootPath: rootPath,
  genYearSeries: genYearSeries
}