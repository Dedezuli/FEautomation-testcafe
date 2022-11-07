import 'module-alias/register';
import { ClientFunction, Selector, t } from "testcafe";
import PrenagenPage from "model/frontoffice/Prenagen-model/prenagen-page";

const router = require('lib/router');
const help = require('lib/helper');
const getLocation = ClientFunction(() => document.location.href);
const foUrl = router.getPrenagenUrl();
const data = require('resources/data');

fixture `Registration Club Prenagen`
  .page `${foUrl}`
  .meta({
    EPIC: 'Prenegen Registration'
  });


test
  .meta({
    SEVERITY: 'low',
    TYPE: 'SMOKE',
    STORY: 'PRENAREG-01'
  })
  ('Klik tombol "Daftar" seharusnya akan masuk ke halaman register input nomer handphone', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .expect(getLocation()).contains('/register');
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'SMOKE',
    STORY: 'PRENAREG-02'
  })

('Input valid nomer seharunya dapat lanjut ke halaman verivikasi code', async t => {
  await t
    .click(PrenagenPage.buttonDaftar)
    .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(6)}`)
    .click(PrenagenPage.buttonSubmit)
    .wait(10000)
    .expect(getLocation()).contains('/register/verification-code')
});

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'SMOKE',
    STORY: 'PRENAREG-03'
  })
  ('Input invalid nomer seharunya dapat lanjut ke halaman verivikasi code', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `7${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .expect(getLocation()).contains('/register/verification-code')
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'Negatif',
    STORY: 'PRENAREG-04'
  })
  ('Input invalid nomer seharunya gagal lanjut ke halaman verivikasi code', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(5)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .expect(PrenagenPage.erorMassage.textContent).contains('Must be 7 characters or more')
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'Negatif',
    STORY: 'PRENAREG-05'
  })
  ('Input invalid nomer seharunya gagal lanjut ke halaman verivikasi code', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `3${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .expect(PrenagenPage.erorMassage.textContent).contains('Phone number is not valid')
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'Negatif',
    STORY: 'PRENAREG-06'
  })
  ('input nomer yang sudah terdaftar seharusnya gagal lanjut ke halaman verivikasi code', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, data.user)
      .click(PrenagenPage.buttonSubmit)
      .wait(10000)
      .expect(PrenagenPage.erorMassage2.textContent).contains('Nomor telepon sudah terdaftar.')
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'SMOKE',
    STORY: 'PRENAREG-07'
  })
  ('pendaftaran mengunakan referal code yang benar seharusnya dapat lanjut ke halaman verivikasi code', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .typeText(PrenagenPage.inputReferralCode, 'benar')
      .expect(getLocation()).contains('/register/verification-code')
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'SMOKE',
    STORY: 'PRENAREG-08'
  })
  ('pendaftaran tanpa mengunakan referal code seharusnya dapat lanjut ke halaman verivikasi code', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .expect(getLocation()).contains('/register/verification-code')
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'Negatif',
    STORY: 'PRENAREG-09'
  })
  ('pendaftaran mengunakan referal code yang salah seharusnya gagal lanjut ke halaman verivikasi code', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .typeText(PrenagenPage.inputReferralCode, '223344')
      .expect(getLocation()).contains('/register')
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'SMOKE',
    STORY: 'PRENAREG-10'
  })
  ('klik tombol "Lanjutkan" pada halaman verivikasi code seharusnya dapat lanjut ke halaman insert profil', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .wait(5000)
      .click(PrenagenPage.buttonVercode)
      .expect(getLocation()).contains('/register/create-profile')
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'SMOKE',
    STORY: 'PRENAREG-11'
  })
  ('mengisikan form profil dengan data valid dan lengkap seharusnya dapat lanjut ke halaman insert address', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .wait(5000)
      .click(PrenagenPage.buttonVercode)
      .typeText(PrenagenPage.inputEmail, help.randEmail(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputFirstName, help.randFisrtName(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputLastName, help.randLastName(), { paste: true, replace: true })
      .click(PrenagenPage.inputBday)
      .typeText(PrenagenPage.inputBday, help.randDate(), { paste: true, replace: true })
      .click(PrenagenPage.opsiGdrWanita)
      .click(PrenagenPage.buttonSubmit)
      .expect(getLocation()).contains('/register/create-address')
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'Negatif',
    STORY: 'PRENAREG-12'
  })
  ('tidak mengisikan email pada form profil seharusnya gagal lanjut ke halaman insert address', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .wait(5000)
      .click(PrenagenPage.buttonVercode)
      .typeText(PrenagenPage.inputFirstName, help.randFisrtName(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputLastName, help.randLastName(), { paste: true, replace: true })
      .click(PrenagenPage.inputBday)
      .typeText(PrenagenPage.inputBday, help.randDate(), { paste: true, replace: true })
      .click(PrenagenPage.opsiGdrWanita)
      .click(PrenagenPage.buttonSubmit)
      .expect(PrenagenPage.erorMassage.textContent).contains('Email wajib diisi')
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'Negatif',
    STORY: 'PRENAREG-13'
  })
  ('tidak mengisikan first name pada form profil seharusnya gagal lanjut ke halaman insert address', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .wait(5000)
      .click(PrenagenPage.buttonVercode)
      .typeText(PrenagenPage.inputEmail, help.randEmail(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputLastName, help.randLastName(), { paste: true, replace: true })
      .click(PrenagenPage.inputBday)
      .typeText(PrenagenPage.inputBday, help.randDate(), { paste: true, replace: true })
      .click(PrenagenPage.opsiGdrWanita)
      .click(PrenagenPage.buttonSubmit)
      .expect(PrenagenPage.erorMassage.textContent).contains('Nama depan wajib diisi');
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'Negatif',
    STORY: 'PRENAREG-14'
  })
  ('tidak mengisikan last name pada form profil seharusnya gagal lanjut ke halaman insert address', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .wait(5000)
      .click(PrenagenPage.buttonVercode)
      .typeText(PrenagenPage.inputEmail, help.randEmail(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputFirstName, help.randFisrtName(), { paste: true, replace: true })
      .click(PrenagenPage.inputBday)
      .typeText(PrenagenPage.inputBday, help.randDate(), { paste: true, replace: true })
      .click(PrenagenPage.opsiGdrWanita)
      .click(PrenagenPage.buttonSubmit)
      .expect(PrenagenPage.erorMassage.textContent).contains('Nama belakang wajib diisi');
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'Negatif',
    STORY: 'PRENAREG-15'
  })
  ('mengisikan tanggal lahir dengan usia >17 tahun pada form profil seharusnya gagal lanjut ke halaman insert address', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .wait(5000)
      .click(PrenagenPage.buttonVercode)
      .typeText(PrenagenPage.inputEmail, help.randEmail(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputFirstName, help.randFisrtName(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputLastName, help.randLastName(), { paste: true, replace: true })
      .click(PrenagenPage.inputBday)
      .typeText(PrenagenPage.inputBday, data.fakeBirthday, { paste: true, replace: true })
      .click(PrenagenPage.opsiGdrWanita)
      .click(PrenagenPage.buttonSubmit)
      .typeText(PrenagenPage.inputFullAddres, help.randDescription(30), { paste: true, replace: true })
      .click(PrenagenPage.buttonPilihProv)
      .typeText(PrenagenPage.inputProvinsi, 'Jak')
      .click(PrenagenPage.selectProv)
      .click(PrenagenPage.buttonPilihDist)
      .click(PrenagenPage.selectDist)
      .click(PrenagenPage.buttonSubmitAddres)
      .expect(PrenagenPage.erorMassage.textContent).contains('Usia minimum 17 tahun ke atas');
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'Smoke',
    STORY: 'PRENAREG-16'
  })
  ('mengisikan form address dengan data valid dan lengkap seharusnya dapat lanjut ke halaman cerate pin', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .wait(5000)
      .click(PrenagenPage.buttonVercode)
      .typeText(PrenagenPage.inputEmail, help.randEmail(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputFirstName, help.randFisrtName(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputLastName, help.randLastName(), { paste: true, replace: true })
      .click(PrenagenPage.inputBday)
      .typeText(PrenagenPage.inputBday, help.randDate(), { paste: true, replace: true })
      .click(PrenagenPage.opsiGdrWanita)
      .click(PrenagenPage.buttonSubmit)
      .typeText(PrenagenPage.inputFullAddres, help.randDescription(30), { paste: true, replace: true })
      .click(PrenagenPage.buttonPilihProv)
      .typeText(PrenagenPage.inputProvinsi, 'Jak')
      .click(PrenagenPage.selectProv)
      .click(PrenagenPage.buttonPilihDist)
      .click(PrenagenPage.selectDist)
      .click(PrenagenPage.buttonSubmitAddres)
      .expect(getLocation()).contains('/register/create-pin');
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'Negatif',
    STORY: 'PRENAREG-17'
  })
  ('tidak mengisikan detail address pada form address seharusnya gagal lanjut ke halaman  cerate pin', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .wait(5000)
      .click(PrenagenPage.buttonVercode)
      .typeText(PrenagenPage.inputEmail, help.randEmail(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputFirstName, help.randFisrtName(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputLastName, help.randLastName(), { paste: true, replace: true })
      .click(PrenagenPage.inputBday)
      .typeText(PrenagenPage.inputBday, help.randDate(), { paste: true, replace: true })
      .click(PrenagenPage.opsiGdrWanita)
      .click(PrenagenPage.buttonSubmit)
      .click(PrenagenPage.buttonPilihProv)
      .typeText(PrenagenPage.inputProvinsi, 'Jak')
      .click(PrenagenPage.selectProv)
      .click(PrenagenPage.buttonPilihDist)
      .click(PrenagenPage.selectDist)
      .click(PrenagenPage.buttonSubmitAddres)
      .expect(PrenagenPage.erorMassage.textContent).contains('Alamat wajib diisi');
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'Negatif',
    STORY: 'PRENAREG-18'
  })
  ('tidak mengisikan kolom provinsi pada form address seharusnya gagal lanjut ke halaman  cerate pin', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .wait(5000)
      .click(PrenagenPage.buttonVercode)
      .typeText(PrenagenPage.inputEmail, help.randEmail(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputFirstName, help.randFisrtName(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputLastName, help.randLastName(), { paste: true, replace: true })
      .click(PrenagenPage.inputBday)
      .typeText(PrenagenPage.inputBday, help.randDate(), { paste: true, replace: true })
      .click(PrenagenPage.opsiGdrWanita)
      .click(PrenagenPage.buttonSubmit)
      .typeText(PrenagenPage.inputFullAddres, help.randDescription(30), { paste: true, replace: true })
      .click(PrenagenPage.buttonPilihDist)
      .click(PrenagenPage.selectDist)
      .click(PrenagenPage.buttonSubmitAddres)
      .expect(PrenagenPage.erorMassage.textContent).contains('Provinsi wajib diisi');
  });


test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'Negatif',
    STORY: 'PRENAREG-19'
  })
  ('tidak mengisikan kolom district pada form address seharusnya gagal lanjut ke halaman  cerate pin', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .wait(5000)
      .click(PrenagenPage.buttonVercode)
      .typeText(PrenagenPage.inputEmail, help.randEmail(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputFirstName, help.randFisrtName(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputLastName, help.randLastName(), { paste: true, replace: true })
      .click(PrenagenPage.inputBday)
      .typeText(PrenagenPage.inputBday, help.randDate(), { paste: true, replace: true })
      .click(PrenagenPage.opsiGdrWanita)
      .click(PrenagenPage.buttonSubmit)
      .typeText(PrenagenPage.inputFullAddres, help.randDescription(30), { paste: true, replace: true })
      .click(PrenagenPage.buttonPilihProv)
      .typeText(PrenagenPage.inputProvinsi, 'Jak')
      .click(PrenagenPage.selectProv)
      .click(PrenagenPage.buttonSubmitAddres)
      .expect(PrenagenPage.erorMassage.textContent).contains('Kelurahan wajib diisi');
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'Smoke',
    STORY: 'PRENAREG-20'
  })
  ('membuat pin baru dengan angka seharusnya dapat lanjut ke halaman confirmasi pin', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .wait(5000)
      .click(PrenagenPage.buttonVercode)
      .typeText(PrenagenPage.inputEmail, help.randEmail(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputFirstName, help.randFisrtName(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputLastName, help.randLastName(), { paste: true, replace: true })
      .click(PrenagenPage.inputBday)
      .typeText(PrenagenPage.inputBday, help.randDate(), { paste: true, replace: true })
      .click(PrenagenPage.opsiGdrWanita)
      .click(PrenagenPage.buttonSubmit)
      .typeText(PrenagenPage.inputFullAddres, help.randDescription(30), { paste: true, replace: true })
      .click(PrenagenPage.buttonPilihProv)
      .typeText(PrenagenPage.inputProvinsi, 'Jak')
      .click(PrenagenPage.selectProv)
      .click(PrenagenPage.buttonPilihDist)
      .click(PrenagenPage.selectDist)
      .click(PrenagenPage.buttonSubmitAddres)
      .typeText(PrenagenPage.inputPin1, help.getDefaultPassword())
      .click(PrenagenPage.buttonSubmitPin)
      .expect(getLocation()).contains('/register/confirm-pin');
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'Negatif',
    STORY: 'PRENAREG-21'
  })
  ('membuat pin baru dengan huruf seharusnya gagal lanjut ke halaman confirmasi pin', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .wait(5000)
      .click(PrenagenPage.buttonVercode)
      .typeText(PrenagenPage.inputEmail, help.randEmail(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputFirstName, help.randFisrtName(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputLastName, help.randLastName(), { paste: true, replace: true })
      .click(PrenagenPage.inputBday)
      .typeText(PrenagenPage.inputBday, help.randDate(), { paste: true, replace: true })
      .click(PrenagenPage.opsiGdrWanita)
      .click(PrenagenPage.buttonSubmit)
      .typeText(PrenagenPage.inputFullAddres, help.randDescription(30), { paste: true, replace: true })
      .click(PrenagenPage.buttonPilihProv)
      .typeText(PrenagenPage.inputProvinsi, 'Jak')
      .click(PrenagenPage.selectProv)
      .click(PrenagenPage.buttonPilihDist)
      .click(PrenagenPage.selectDist)
      .click(PrenagenPage.buttonSubmitAddres)
      .typeText(PrenagenPage.inputPin1, help.randFisrtName())
      .click(PrenagenPage.buttonSubmitPin)
      .expect(getLocation()).contains('/register/create-pin');
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'Negatif',
    STORY: 'PRENAREG-22'
  })
  ('membuat pin baru dengan kombinasi huruf dan angka seharusnya gagal lanjut ke halaman confirmasi pin', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .wait(5000)
      .click(PrenagenPage.buttonVercode)
      .typeText(PrenagenPage.inputEmail, help.randEmail(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputFirstName, help.randFisrtName(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputLastName, help.randLastName(), { paste: true, replace: true })
      .click(PrenagenPage.inputBday)
      .typeText(PrenagenPage.inputBday, help.randDate(), { paste: true, replace: true })
      .click(PrenagenPage.opsiGdrWanita)
      .click(PrenagenPage.buttonSubmit)
      .typeText(PrenagenPage.inputFullAddres, help.randDescription(30), { paste: true, replace: true })
      .click(PrenagenPage.buttonPilihProv)
      .typeText(PrenagenPage.inputProvinsi, 'Jak')
      .click(PrenagenPage.selectProv)
      .click(PrenagenPage.buttonPilihDist)
      .click(PrenagenPage.selectDist)
      .click(PrenagenPage.buttonSubmitAddres)
      .typeText(PrenagenPage.inputPin1, help.randNumber(2))
      .click(PrenagenPage.buttonSubmitPin)
      .expect(getLocation()).contains('/register/create-pin');
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'Smoke',
    STORY: 'PRENAREG-23'
  })
  ('confirmasi pin dengan pin yang sesuai seharusnya dapat lanjut ke halaman registrasi sukses', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .wait(5000)
      .click(PrenagenPage.buttonVercode)
      .typeText(PrenagenPage.inputEmail, help.randEmail(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputFirstName, help.randFisrtName(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputLastName, help.randLastName(), { paste: true, replace: true })
      .click(PrenagenPage.inputBday)
      .typeText(PrenagenPage.inputBday, help.randDate(), { paste: true, replace: true })
      .click(PrenagenPage.opsiGdrWanita)
      .click(PrenagenPage.buttonSubmit)
      .typeText(PrenagenPage.inputFullAddres, help.randDescription(30), { paste: true, replace: true })
      .click(PrenagenPage.buttonPilihProv)
      .typeText(PrenagenPage.inputProvinsi, 'Jak')
      .click(PrenagenPage.selectProv)
      .click(PrenagenPage.buttonPilihDist)
      .click(PrenagenPage.selectDist)
      .click(PrenagenPage.buttonSubmitAddres)
      .typeText(PrenagenPage.inputPin1, help.getDefaultPassword())
      .click(PrenagenPage.buttonSubmitPin)
      .typeText(PrenagenPage.inputPin2, help.getDefaultPassword()).wait(10000)
      .expect(getLocation()).contains('/register/success');
  });

test
  .meta({
    SEVERITY: 'Mayor',
    TYPE: 'Negatif',
    STORY: 'PRENAREG-24'
  })
  ('confirmasi pin dengan pin yang salah seharusnya gagal lanjut ke halaman registrasi sukses', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .wait(5000)
      .click(PrenagenPage.buttonVercode)
      .typeText(PrenagenPage.inputEmail, help.randEmail(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputFirstName, help.randFisrtName(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputLastName, help.randLastName(), { paste: true, replace: true })
      .click(PrenagenPage.inputBday)
      .typeText(PrenagenPage.inputBday, help.randDate(), { paste: true, replace: true })
      .click(PrenagenPage.opsiGdrWanita)
      .click(PrenagenPage.buttonSubmit)
      .typeText(PrenagenPage.inputFullAddres, help.randDescription(30), { paste: true, replace: true })
      .click(PrenagenPage.buttonPilihProv)
      .typeText(PrenagenPage.inputProvinsi, 'Jak')
      .click(PrenagenPage.selectProv)
      .click(PrenagenPage.buttonPilihDist)
      .click(PrenagenPage.selectDist)
      .click(PrenagenPage.buttonSubmitAddres)
      .typeText(PrenagenPage.inputPin1, help.getDefaultPassword())
      .click(PrenagenPage.buttonSubmitPin)
      .typeText(PrenagenPage.inputPin2, help.randNumber()).wait(10000)
      .expect(PrenagenPage.erorMassage2.textContent).contains('Konfirmasi password tidak sesuai.');
  });

test
  .meta({
    SEVERITY: 'Low',
    TYPE: 'Smoke',
    STORY: 'PRENAREG-25'
  })
  ('Klik tombol "Mulai" seharusnya akan masuk ke halaman dashboard', async t => {
    await t
      .click(PrenagenPage.buttonDaftar)
      .typeText(PrenagenPage.inputNoBaru, `8${help.randNumber(11)}`, { paste: true, replace: true })
      .click(PrenagenPage.buttonSubmit)
      .wait(5000)
      .click(PrenagenPage.buttonVercode)
      .typeText(PrenagenPage.inputEmail, help.randEmail(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputFirstName, help.randFisrtName(), { paste: true, replace: true })
      .typeText(PrenagenPage.inputLastName, help.randLastName(), { paste: true, replace: true })
      .click(PrenagenPage.inputBday)
      .typeText(PrenagenPage.inputBday, help.randDate(), { paste: true, replace: true })
      .click(PrenagenPage.opsiGdrWanita)
      .click(PrenagenPage.buttonSubmit)
      .typeText(PrenagenPage.inputFullAddres, help.randDescription(), { paste: true, replace: true })
      .click(PrenagenPage.buttonPilihProv)
      .typeText(PrenagenPage.inputProvinsi, 'Jak')
      .click(PrenagenPage.selectProv)
      .click(PrenagenPage.buttonPilihDist)
      .click(PrenagenPage.selectDist)
      .click(PrenagenPage.buttonSubmitAddres)
      .typeText(PrenagenPage.inputPin1, help.getDefaultPassword())
      .click(PrenagenPage.buttonSubmitPin)
      .typeText(PrenagenPage.inputPin2, help.getDefaultPassword()).wait(10000)
      .expect(getLocation()).contains('/register/success');
  });