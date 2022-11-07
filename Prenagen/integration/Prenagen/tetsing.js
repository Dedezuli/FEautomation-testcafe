import { Selector } from 'testcafe';

fixture `My fixture`
  .page `./index.html`

test('Check uploaded files', async t => {

  await t
    .setFilesToUpload('#upload-input', [
      '../../../../resources/others/Struk.jpeg',
      '../../../../resources/others/Struk.jpeg'
    ])
    .click('#upload-btn');
});