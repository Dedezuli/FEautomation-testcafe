import { Selector, t } from 'testcafe';
import XPathSelector from 'lib/xpath-selector';
import helper from 'lib/helper';

class Redeem {
  constructor() {
    this.menuRedeem = Selector('[data-unq="dashboard-button-tukar-poin"]')
    this.filterRedeem = Selector('[data-unq="redeem-button-filter-filter-dan-urutkan"]')
    this.sortHighest = Selector('[data-unq="redeem-button-filterSort-poin-tertinggi"]')
    this.sortLowest = Selector('[data-unq="redeem-button-filterSort-poin-terendah"]')
    this.sortMaxpoint = Selector('[data-unq="redeem-button-filterMaxPoint"]')
    this.sortMinpoint = Selector('[data-unq="redeem-button-filterMinPoint"]')
    this.filterSubmit = Selector('[data-unq="redeem-button-filterSubmit"]')

    this.gopay50 = Selector('[data-unq="redeem-button-569"]')
    this.nomorWallet = Selector('[data-unq="wallet-input-phoneNumber"]')
    this.selectGopay = Selector('[data-unq="redeem-button-selected569"]')
    this.bantalLeher = Selector('[data-unq="redeem-button-573"]')
    this.Voucer = Selector('[data-unq="redeem-button-577"]')

    this.buttonRedeem = Selector('[data-unq="redeem-button-redeem"]')
    this.buttonSubmit = Selector('[data-unq="redeem-button-submit"]')
    this.userPIN = XPathSelector('//*[@id="__next"]/main/section/div[2]/form/div/div[1]/div[2]/div/input[1]')
    this.submitPIN = Selector('[data-unq="pin-button-submit"]')

    this.listAddres = Selector('[data-unq="redeem-button-listAddress"]')
    this.addAddress = Selector('[data-unq="address-button-add"]')
    this.addressName = Selector('[data-unq="address-input-addressName"]')
    this.receiptName = Selector('[data-unq="address-input-receiptName"]')
    this.phoneNo = Selector('[data-unq="address-input-phoneNo"]')
    this.address = Selector('[data-unq="address-input-address"]')
    this.buttonPilihProv = Selector('[data-unq="address-input-province"]')
    this.inputProvinsi = Selector('[data-unq="address-input-province-search"]')
    this.selectProv = Selector('[data-unq="address-input-province-selected-0"]')
    this.buttonPilihDist = Selector('[data-unq="address-input-district"]')
    this.inputDistrict = Selector('[data-unq="address-input-district-search"]')
    this.selectDist = Selector('[data-unq="address-input-district-selected-1"]')
    this.addressSubmit = Selector('[data-unq="address-button-submit"]')
    this.buttonBack = Selector('[data-unq="page-button-back"]')
    this.notif = XPathSelector('//*[@id="__next"]/main/section/div[2]/form/div/div[1]/div[2]/div/span');
  };

  async redeem(username, password) {
    await t
      .click(this.buttonMasuk)
      .typeText(this.userNumber, username)
      .click(this.submitButton)
      .typeText(this.userPIN, password)
  };
};

export default new Redeem();