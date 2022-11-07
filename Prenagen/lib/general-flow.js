import 'module-alias/register';
import { Selector, t } from 'testcafe';
import WCTLEmailAct from 'model/registration/wctl/wctl-general-terms-of';
import OTP from 'model/otp-registration';
import passPage from 'model/registration/wctl/create-password';
import compDataOne from 'model/registration/wctl/wctl-completing-data';
import applyLoan from 'model/loan-application/wctl/wctl-add-new-loan';
const req = require('lib/request.js');


class GeneralFlow {
  constructor() {};
  async createPassword(email) {
    let hash_rd = await req.registBorrowerWctl(email);
    await t
      .navigateTo(`/email-activation/${hash_rd}`);
    await WCTLEmailAct.GeneralTermOfWCTL();
    await t
      .eval(() => location.reload(true));
    await OTP.Otp();
    await t
      .wait(5000);
    let pass = 'Brandal17';
    let rePass = 'Brandal17';
    await t
      .typeText(passPage.password, pass, { paste: true, replace: true })
      .typeText(passPage.rePassword, rePass, { paste: true, replace: true })
      .pressKey('enter')
      .wait(1000);
    await t
      .pressKey('enter')
      .wait(5000);
  };

  async dataCompletionOne(email) {
    await this.createPassword(email);
    await compDataOne.CompletingData();
  };

  async applyLoan(email) {
    await this.dataCompletionOne(email);
    await applyLoan.AddNewLoanWCTL();
  };
};

export default new GeneralFlow();