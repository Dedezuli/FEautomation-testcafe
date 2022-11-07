import { Selector, t } from 'testcafe';
import XPathSelector from 'lib/xpath-selector';
import helper from 'lib/helper';

class Topup {
  constructor() {
    this.buttonUnggah = Selector('[data-unq="dashboard-button-unggah-struk"]')
    this.closeSK = Selector('[data-unq="modal-action-close"]')
    this.upload = XPathSelector('//*[@id="__next"]/main/section/div[2]/div/div[4]/div[2]/div/div/span/img')



  };

  async topupstruk(username, password) {
    await t
      .click(this.buttonMasuk)
      .typeText(this.userNumber, username)
      .click(this.submitButton)
      .typeText(this.userPIN, password)
  };
};

export default new Topup();