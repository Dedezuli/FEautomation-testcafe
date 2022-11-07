const superagent = require('superagent');
const Promise = require('bluebird');
const conf = require('../config');
const helper = require('./helper');
const router = require('./router');
const boUsers = require('../resources/json/bo-users');
const { Random } = require('random-js');

var sha1 = require("sha1")

const SftpClient = require('ssh2-sftp-client');
const fs = require('fs');
let config = require('../config.json');
const sftpDst = '/incoming02/onboarding/';

let sftpConfig = {
  host: config.url.sftp.host,
  port: config.url.sftp.port,
  username: config.url.sftp.username,
  privateKey: fs.readFileSync(config.url.sftp.key)
};

async function getRd(email) {
  return superagent
    .get(router.getFoUrl() + `/test/getRdID?email=${email}`)
    .send()
    .then((res) => {
      return JSON.parse(res.text);
    });
}

async function registBorrowerWctl(email = null) {
  if (email == null) {
    email = helper.randEmail();
  }
  let address = helper.randAddress();
  let idMerch = helper.randAlphanumeric(5);
  let date = helper.dateNow();
  let csvFilename = `${idMerch}test_summary_${date}.csv`
  let firstName = helper.randFirstName();
  let lastName = helper.randLastName();
  let data = [{
    no: 1,
    fullName: `${firstName} ${lastName}`,
    firstName: firstName,
    lastName: lastName,
    emailAddress: email,
    phoneNumber: helper.randNumber(),
    gender: 'Male',
    companyProvince: address.province.name,
    companyDistrict: address.district.name,
    companySubDistrict: address.subDistrict.name,
    zipCode: address.postalCode,
    companyAddress: address.address,
    companyName: `Thai 2c2p ${helper.randAlphanumeric(5)} ltd`,
    companyRegistrationNumber: helper.randNumber(13),
    businessEstablishment: '2015'
  }];
  await helper.generateCsv('2C2P', data, csvFilename);
  const client = new SftpClient();
  try {
    let sftpSrc = './resources/docs/' + csvFilename;

    await client.connect(sftpConfig);
    await client.put(sftpSrc, sftpDst + csvFilename, {
      flags: 'w',
      encoding: null,
      mode: 0o666,
      autoClose: true
    });
    return superagent
      .get(router.getFoUrl() + `/sftp`)
      .send()
      .then(async () => {
        await helper.sleep(1000);
        let rd_id = await getRd(email);
        let hash_rd = await sha1(`${rd_id}`);
        return hash_rd;
      });
  } finally {
    client.end();
  }
}

module.exports = {
  getRd: getRd,
  registBorrowerWctl: registBorrowerWctl
};