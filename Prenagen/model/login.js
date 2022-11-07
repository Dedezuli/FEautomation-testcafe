import { Selector, t } from 'testcafe';
import XPathSelector from 'lib/xpath-selector';
import helper from 'lib/helper';

class LoginPage {
  constructor() {
    this.buttonMasuk = Selector('[data-unq=home-button-signin]')
    this.userNumber = Selector('[data-unq=login-input-phonenumber]');
    this.userPIN = XPathSelector('//*[@id="__next"]/main/section/div[2]/form/div/div/div[2]/div/input[1]');
    this.submitButton = Selector('[data-unq=login-button-submit]');
    this.notif = XPathSelector('//*[@id="__next"]/main/section/div[2]/form/div/div/div[2]/div/span');
    this.forgotPIN = Selector('[data-unq=pin-button-forgotPassword]')
    this.inputNoLupaPin = Selector('[data-unq=forgotPin-input-phonenumber]')
    this.buttonSubmitLupaPin = Selector('[data-unq=forgotPin-button-submit]')
    this.buttonVercode = Selector('[data-unq=verification-code-button-submit]')
    this.loginForgotPIN = Selector('[data-unq=forgotPin-button-login]')
    this.referralDashboard = Selector('[data-unq=dashboard-button-referral]')
  };

  async login(username, password) {
    await t
      .click(this.buttonMasuk)
      .typeText(this.userNumber, username)
      .click(this.submitButton)
      .typeText(this.userPIN, password)
  };
};

export default new LoginPage();