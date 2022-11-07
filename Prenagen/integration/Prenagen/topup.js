import 'module-alias/register';
import { ClientFunction, Selector, t } from "testcafe";
import topup from "model/frontoffice/Prenagen-model/topup";
import login from 'model/login';
import XPathSelector from 'lib/xpath-selector';

const router = require('lib/router');
const help = require('lib/helper');
const getLocation = ClientFunction(() => document.location.href);
const foUrl = router.getPrenagenUrl();
const data = require('resources/data');

fixture `Topup Club Prenagen`
  .page `${foUrl}`
  .meta({
    EPIC: 'Prenegen Topup'
  })
  .beforeEach(async t => {
    await login.login(data.user, data.userPIN)
  })

test
  .meta({
    SEVERITY: 'low',
    TYPE: 'SMOKE',
    STORY: 'PRENAREG-01'
  })
  ('Klik tombol "Unggah" seharusnya akan masuk ke halaman unggah struk', async t => {
    await t
      .click(topup.buttonUnggah)
      .doubleClick(topup.closeSK)
      .setFilesToUpload(XPathSelector('//*[@id="__next"]/main/section/div[2]/div/div[3]/div[2]/span/img'), [
        '../../../../resources/others/Struk.jpeg'
      ])
      .expect(getLocation()).contains('/');
  });