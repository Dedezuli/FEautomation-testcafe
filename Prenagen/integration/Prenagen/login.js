import 'module-alias/register';
import { ClientFunction, Selector, t } from "testcafe";
import LoginPage from "model/login.js";
import helper from 'lib/helper';

const router = require('lib/router');
const help = require('lib/helper');
const getLocation = ClientFunction(() => document.location.href);
const foUrl = router.getPrenagenUrl();
const data = require('resources/data');

fixture `Login Prenagen`
  .page `${foUrl}`
  .meta({
    EPIC: 'Prenegen Login'
  });

test
  .meta({
    SEVERITY: 'low',
    TYPE: 'SMOKE',
    STORY: 'PRENAlOG-26'
  })
  ('Klik tombol "Masuk" seharusnya akan masuk ke halaman Login input nomer handphone', async t => {
    await t
      .click(LoginPage.buttonMasuk)
      .expect(getLocation()).contains('/login')
  });

test
  .meta({
    SEVERITY: 'critical',
    TYPE: 'Negatif',
    STORY: 'PRENAlOG-28'
  })
  ('input nomer yang belum terdaftar seharusnya gagal lanjut ke halaman input pin', async t => {
    await t
      .click(LoginPage.buttonMasuk)
      .typeText(LoginPage.userNumber, data.fakeUser)
      .click(LoginPage.submitButton).expect(LoginPage.forgotPIN.exists).notOk({ timeout: 10000 })
      .expect(LoginPage.notif.textContent).contains('Data tidak ditemukan !!');
  });

test
  .meta({
    SEVERITY: 'critical',
    TYPE: 'SMOKE',
    STORY: 'PRENAlOG-29'
  })
  ('input pin yang sesuai seharusnya berhasil masuk ke halaman dashboard', async t => {
    await t
      .click(LoginPage.buttonMasuk)
      .typeText(LoginPage.userNumber, data.user)
      .click(LoginPage.submitButton).expect(LoginPage.forgotPIN.exists).notOk({ timeout: 10000 })
      .typeText(LoginPage.userPIN, help.getDefaultPassword())
      .expect(Selector('[data-unq=dashboard-button-referral]').innerText).eql('UNDANG SEKARANG', { timeout: 10000 });
  });

test
  .meta({
    SEVERITY: 'critical',
    TYPE: 'Negatif',
    STORY: 'PRENAlOG-30'
  })
  ('input pin yang salah seharusnya gagal masuk ke halaman dashboard', async t => {
    await t
      .click(LoginPage.buttonMasuk)
      .typeText(LoginPage.userNumber, data.user)
      .click(LoginPage.submitButton).expect(LoginPage.forgotPIN.exists).notOk({ timeout: 10000 })
      .typeText(LoginPage.userPIN, help.randNumber(6))
      .expect(LoginPage.notif.textContent).contains('Username dan password tidak ditemukan.');
  });

test
  .meta({
    SEVERITY: 'low',
    TYPE: 'SMOKE',
    STORY: 'PPRENAlOG-31'
  })
  ('klik "Lupa pin?" seharusnya dapat lanjut ke halaman forget pin input nomer telephone', async t => {
    await t
      .click(LoginPage.buttonMasuk)
      .typeText(LoginPage.userNumber, data.user)
      .click(LoginPage.submitButton).expect(LoginPage.forgotPIN.exists).notOk({ timeout: 10000 })
      .click(LoginPage.forgotPIN)
      .expect(getLocation()).contains('/forgot-pin')
  });

test
  .meta({
    SEVERITY: 'mayor',
    TYPE: 'SMOKE',
    STORY: 'PPRENAlOG-32'
  })
  ('input nomer yang sudah terdaftar seharusnya dapat lanjut ke halaman verivikasi code', async t => {
    await t
      .click(LoginPage.buttonMasuk)
      .typeText(LoginPage.userNumber, data.user)
      .click(LoginPage.submitButton)
      .expect(LoginPage.forgotPIN.exists).notOk({ timeout: 10000 })
      .expect(LoginPage.forgotPIN.exists).notOk({ timeout: 10000 })
      .click(LoginPage.forgotPIN)
      .typeText(LoginPage.inputNoLupaPin, data.user)
      .click(LoginPage.buttonSubmitLupaPin)
      .expect(getLocation()).contains('/forgot-pin/verification-code')
  });

test
  .meta({
    SEVERITY: 'mayor',
    TYPE: 'Negatif',
    STORY: 'PPRENAlOG-33'
  })
  ('input nomer yang belum terdaftar seharusnya gagal lanjut ke halaman verivikasi code', async t => {
    await t
      .click(LoginPage.buttonMasuk)
      .typeText(LoginPage.userNumber, data.user)
      .click(LoginPage.submitButton)
      .expect(LoginPage.forgotPIN.exists).notOk({ timeout: 10000 })
      .click(LoginPage.forgotPIN)
      .typeText(LoginPage.inputNoLupaPin, data.fakeUser)
      .click(LoginPage.buttonSubmitLupaPin)
      .expect(LoginPage.notif.textContent).contains('Nomor telepon belum terdafar.');
  });

test
  .meta({
    SEVERITY: 'mayor',
    TYPE: 'SMOKE',
    STORY: 'PPRENAlOG-34'
  })
  ('klik tombol "verivikasi" pada halaman verivikasi code seharusnya dapat lanjut ke halaman edit pin', async t => {
    await t
      .click(LoginPage.buttonMasuk)
      .typeText(LoginPage.userNumber, data.user)
      .click(LoginPage.submitButton)
      .expect(LoginPage.forgotPIN.exists).notOk({ timeout: 10000 })
      .click(LoginPage.forgotPIN)
      .typeText(LoginPage.inputNoLupaPin, data.user)
      .click(LoginPage.buttonSubmitLupaPin)
      .click(LoginPage.buttonVercode)
      .expect(getLocation()).contains('/forgot-pin/edit-pin')
  });

test
  .meta({
    SEVERITY: 'mayor',
    TYPE: 'SMOKE',
    STORY: 'PPRENAlOG-35'
  })
  ('membuat pin baru dengan angka seharusnya dapat lanjut ke halaman confirmasi pin', async t => {
    await t
      .click(LoginPage.buttonMasuk)
      .typeText(LoginPage.userNumber, data.user)
      .click(LoginPage.submitButton)
      .expect(LoginPage.forgotPIN.exists).notOk({ timeout: 10000 })
      .click(LoginPage.forgotPIN)
      .typeText(LoginPage.inputNoLupaPin, data.user)
      .click(LoginPage.buttonSubmitLupaPin)
      .click(LoginPage.buttonVercode)
      .typeText(LoginPage.userPIN, data.userPIN)
      .click(LoginPage.buttonSubmitLupaPin)
      .expect(getLocation()).contains('/forgot-pin/confirm-pin')
  });


test
  .meta({
    SEVERITY: 'mayor',
    TYPE: 'Negatif',
    STORY: 'PPRENAlOG-36'
  })
  ('membuat pin baru dengan kombinasi huruf dan angka seharusnya gagal lanjut ke halaman confirmasi pin', async t => {
    await t
      .click(LoginPage.buttonMasuk)
      .typeText(LoginPage.userNumber, data.user)
      .click(LoginPage.submitButton)
      .expect(LoginPage.forgotPIN.exists).notOk({ timeout: 10000 })
      .click(LoginPage.forgotPIN)
      .typeText(LoginPage.inputNoLupaPin, data.user)
      .click(LoginPage.buttonSubmitLupaPin)
      .click(LoginPage.buttonVercode)
      .typeText(LoginPage.userPIN, '1b2b3b')
      .click(LoginPage.buttonSubmitLupaPin)
      .expect(getLocation()).contains('/forgot-pin/confirm-pin')
  });

test
  .meta({
    SEVERITY: 'mayor',
    TYPE: 'Smoke',
    STORY: 'PPRENAlOG-37'
  })
  ('confirmasi pin dengan pin yang sesuai seharusnya reset pin sukses', async t => {
    await t
      .click(LoginPage.buttonMasuk)
      .typeText(LoginPage.userNumber, data.user)
      .click(LoginPage.submitButton).expect(LoginPage.forgotPIN.exists).notOk({ timeout: 10000 })
      .click(LoginPage.forgotPIN)
      .typeText(LoginPage.inputNoLupaPin, data.user)
      .click(LoginPage.buttonSubmitLupaPin)
      .click(LoginPage.buttonVercode)
      .typeText(LoginPage.userPIN, data.userPIN)
      .click(LoginPage.buttonSubmitLupaPin)
      .typeText(LoginPage.userPIN, data.userPIN)
      .expect(getLocation()).contains('/forgot-pin/success')
  });

test
  .meta({
    SEVERITY: 'mayor',
    TYPE: 'Negatif',
    STORY: 'PPRENAlOG-38'
  })
  ('confirmasi pin dengan pin yang salah seharusnya gagal reset pin ', async t => {
    await t
      .click(LoginPage.buttonMasuk)
      .typeText(LoginPage.userNumber, data.user)
      .click(LoginPage.submitButton).expect(LoginPage.forgotPIN.exists).notOk({ timeout: 10000 })
      .click(LoginPage.forgotPIN)
      .typeText(LoginPage.inputNoLupaPin, data.user)
      .click(LoginPage.buttonSubmitLupaPin)
      .click(LoginPage.buttonVercode)
      .typeText(LoginPage.userPIN, data.userPIN)
      .click(LoginPage.buttonSubmitLupaPin)
      .typeText(LoginPage.userPIN, helper.randNumber())
      .expect(LoginPage.notif.textContent).contains('PIN tidak valid, silahkan cek PIN');
  });

test
  .meta({
    SEVERITY: 'mayor',
    TYPE: 'Smoke',
    STORY: 'PPRENAlOG-39'
  })
  ('Klik tombol "Masuk" seharusnya akan masuk ke halaman login input nomer telephone', async t => {
    await t
      .click(LoginPage.buttonMasuk)
      .typeText(LoginPage.userNumber, data.user)
      .click(LoginPage.submitButton).expect(LoginPage.forgotPIN.exists).notOk({ timeout: 10000 })
      .click(LoginPage.forgotPIN)
      .typeText(LoginPage.inputNoLupaPin, data.user)
      .click(LoginPage.buttonSubmitLupaPin)
      .click(LoginPage.buttonVercode)
      .typeText(LoginPage.userPIN, data.userPIN)
      .click(LoginPage.buttonSubmitLupaPin)
      .typeText(LoginPage.userPIN, data.userPIN)
      .click(LoginPage.loginForgotPIN)
      .expect(getLocation()).contains('/login')
  });

test
  .meta({
    SEVERITY: 'mayor',
    TYPE: 'Smoke',
    STORY: 'PPRENAlOG-40'
  })
  ('Login dengan pin baru seharusnya berhasil masuk ke halaman dashboard', async t => {
    await t
      .click(LoginPage.buttonMasuk)
      .typeText(LoginPage.userNumber, data.user)
      .click(LoginPage.submitButton).expect(LoginPage.forgotPIN.exists).notOk({ timeout: 10000 })
      .click(LoginPage.forgotPIN)
      .typeText(LoginPage.inputNoLupaPin, data.user)
      .click(LoginPage.buttonSubmitLupaPin)
      .click(LoginPage.buttonVercode)
      .typeText(LoginPage.userPIN, data.userPIN)
      .click(LoginPage.buttonSubmitLupaPin)
      .typeText(LoginPage.userPIN, data.userPIN)
      .click(LoginPage.loginForgotPIN)
      .typeText(LoginPage.userNumber, data.user)
      .click(LoginPage.submitButton).expect(LoginPage.forgotPIN.exists).notOk({ timeout: 10000 })
      .typeText(LoginPage.userPIN, data.userPIN)
      .expect(Selector('[data-unq=dashboard-button-referral]').innerText).eql('UNDANG SEKARANG', { timeout: 10000 });
  });

test
  .meta({
    SEVERITY: 'mayor',
    TYPE: 'Negatif',
    STORY: 'PPRENAlOG-41'
  })
  ('Login dengan pin lama seharusnya gagal masuk akun', async t => {
    await t
      .click(LoginPage.buttonMasuk)
      .typeText(LoginPage.userNumber, data.user)
      .click(LoginPage.submitButton).expect(LoginPage.forgotPIN.exists).notOk({ timeout: 10000 })
      .click(LoginPage.forgotPIN)
      .typeText(LoginPage.inputNoLupaPin, data.user)
      .click(LoginPage.buttonSubmitLupaPin)
      .click(LoginPage.buttonVercode)
      .typeText(LoginPage.userPIN, data.userPIN)
      .click(LoginPage.buttonSubmitLupaPin)
      .typeText(LoginPage.userPIN, data.userPIN)
      .click(LoginPage.loginForgotPIN)
      .typeText(LoginPage.userNumber, data.user)
      .click(LoginPage.submitButton).expect(LoginPage.forgotPIN.exists).notOk({ timeout: 10000 })
      .typeText(LoginPage.userPIN, data.user)
      .expect(LoginPage.notif.textContent).contains('Username dan password tidak ditemukan.')
  });