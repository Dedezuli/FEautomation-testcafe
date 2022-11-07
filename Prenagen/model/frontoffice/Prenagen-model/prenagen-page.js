import { Selector, t } from 'testcafe';
import XPathSelector from 'lib/xpath-selector';
import xpathSelector from 'lib/xpath-selector';
const help = require('lib/helper');

class PrenagenPage {
  constructor() {
    this.buttonDaftar = Selector('[data-unq=button-action-default]')
    this.inputNoBaru = Selector('[data-unq=register-input-phonenumber]')
    this.inputReferralCode = Selector('[data-unq=register-input-referralcode]')
    this.buttonSubmit = Selector('[data-unq="register-button-submit"]')

    this.erorMassage = Selector('div.text-sm')
    this.erorMassage2 = Selector('div.relative')

    this.buttonVercode = Selector('[data-unq=verification-code-button-submit]')
    this.inputEmail = Selector('[data-unq="register-input-email"]')
    this.inputFirstName = Selector('[data-unq="register-input-firstname"]')
    this.inputLastName = Selector('[data-unq="register-input-lastname"]')
    this.inputBday = Selector('[data-unq="register-input-birthdate"]')
    this.opsiGdrLaki = Selector('[data-unq="register-input-genderMale"]')
    this.opsiGdrWanita = Selector('[data-unq="register-input-genderFemale"]')

    this.inputFullAddres = Selector('[data-unq="address-input-address"]')
    this.buttonPilihProv = Selector('[data-unq="address-input-province"]')
    this.inputProvinsi = Selector('[data-unq="address-input-province-search"]')
    this.selectProv = Selector('[data-unq="address-input-province-selected-0"]')
    this.buttonPilihDist = Selector('[data-unq="address-input-district"]')
    this.inputDistrict = Selector('[data-unq="address-input-district-search"]')
    this.selectDist = Selector('[data-unq="address-input-district-selected-1"]')
    this.buttonSubmitAddres = Selector('[data-unq="address-button-submit"]')

    this.inputPin1 = xpathSelector('//*[@id="__next"]/main/section/div[2]/form/div/div[1]/div[2]/div/input[1]')
    this.inputPin2 = xpathSelector('//*[@id="__next"]/main/section/div[2]/form/div/div/div[2]/div/input[1]')

    this.buttonSubmitPin = Selector('[data-unq="pin-button-submit"]')

    this.buttonRegSuccess = Selector('[data-unq="register-button-success"]')

    this.buttonMsuk = Selector('[data-unq="home-button-signin"]')
    this.inputNoLogin = Selector('[data-unq="login-input-phonenumber"]')
    this.buttonSubmitLogin = Selector('[data-unq="login-button-submit"]')

    this.buttonLupaPin = Selector('[data-unq="pin-button-forgotPassword"]')
    this.inputNoLupaPin = Selector('[data-unq="forgotPin-input-phonenumber"]')
    this.buttonSubmitLupaPin = Selector('[data-unq="forgotPin-button-submit"]')
    this.buttonBerhasiLubahPin = Selector('[data-unq="forgotPin-button-login"]');
  };
};

export default new PrenagenPage();