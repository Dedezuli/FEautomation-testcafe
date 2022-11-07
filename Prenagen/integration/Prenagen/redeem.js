import 'module-alias/register';
import { ClientFunction, Selector, t } from "testcafe";
import redeem from "model/frontoffice/Prenagen-model/redeem";
import login from 'model/login';
import XPathSelector from 'lib/xpath-selector';

const router = require('lib/router');
const help = require('lib/helper');
const getLocation = ClientFunction(() => document.location.href);
const foUrl = router.getPrenagenUrl();
const data = require('resources/data');

fixture `Redeem Club Prenagen`
  .page `${foUrl}`
  .meta({
    EPIC: 'Prenegen Tukar Point'
  })
  .beforeEach(async t => {
    await login.login(data.user, data.userPIN)
  })

test
  .meta({
    SEVERITY: 'low',
    TYPE: 'SMOKE',
    STORY: 'REDEEM-01'
  })
  ('Redeem Ewallet dengan point yang cukup seharusnya akan masuk ke halaman unggah struk', async t => {
    await t
      .click(redeem.menuRedeem)
      .doubleClick(redeem.gopay50)
      .typeText(redeem.nomorWallet, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(redeem.selectGopay)
      .click(redeem.buttonSubmit)
      .typeText(redeem.userPIN, help.getDefaultPassword())
      .click(redeem.submitPIN)
      .expect(getLocation()).contains('/redeem/confirm');
  });