
# newcore-frontend-testcafe

Frontend testing using [TestCafe](https://devexpress.github.io/testcafe).

**Please read this README carefully before you start developing test.**

## Table of Contents

- [Table of Contents](#markdown-header-table-of-contents)
- [Getting Started](#markdown-header-getting-started)
    - [Prerequisites](#markdown-header-prerequisites)
    - [Installing](#markdown-header-installing)
    - [Usage](#markdown-header-usage)
- [Coding Style and Rules](#markdown-header-coding-style-and-rules)
    - [Folder Structure and File Naming](#markdown-header-folder-structure-and-file-naming)
    - [Variable and Function Naming](#markdown-header-variable-and-function-naming)
    - [Variable Declaration and Function Expression](#markdown-header-variable-declaration-and-function-expression)
    - [Tab Spaces and Code Beautify](#markdown-header-tab-spaces-and-code-beautify)
- [TestCafe: Fixture and Test](#markdown-header-testcafe-fixture-and-test)
- [TestCafe: Page Object Model](#markdown-header-testcafe-page-object-model)
- [Recommended to Use Visual Studio Code](#markdown-header-recommended-to-use-visual-studio-code)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for testing purposes.

### Prerequisites

Install git and npm. For Debian/Ubuntu distribution:

```
$ sudo apt install npm git
```

For Windows, download installer using links below: 

- [npm](https://nodejs.org/en/)
- [git](https://git-scm.com/downloads)

### Installing

These are the steps to install newcore-frontend-testcafe

```bash
$ git clone git@bitbucket.org:investree/newcore-frontend-testcafe.git
$ cd newcore-frontend-testcafe
$ npm install
```

To use our version of testcafe-allure-reporter

```bash
$ sh scripts/replaceAllureReporter.sh
```

### Usage

```bash
$ npm run test:chrome -- /path/to/test/folder
$ npm run test:firefox -- /path/to/test/folder
```

Headless mode

```bash
$ npm run test:chrome:headless -- /path/to/test/folder
```

If you want to use allure reporter

```bash
$ npm run test:chrome -- -S -r allure /path/to/test/folder
```

Then, generate and serve allure report

```bash
$ npm run allure:gen && npm run allure:open
```

Open http://localhost:8080/ on your browser

## Coding Style and Rules

Before contributing to this repository, please read and follow these rules:

### Folder Structure and File Naming

Folder and file name should be written in **lowercase**.

If name contains multiple words, it should be joined using hyphen.

```
 integration
    |_ frontoffice
       |_ loan-application
       |   |_ invoice-financing
       |   |   |_ single-invoice.js
       |   |   |_ multiple-invoice.js
```

Besides integration folder, there are several other folders

#### Folder: lib
This folder is reserved for router, helper, database functions, and API call functions.

#### Folder: model
This folder is reserved for page object model files. Page object model will be explained on [this section](#markdown-header-testcafe-page-object-model).

#### Folder: resources
This folder is reserved for json, documents, and images which are static files.

```sh
  integration
  lib
  model
  resources
    |_ docs
    |  |_ skdu.pdf
    |_ images
    |  |_ ktp.png
    |_ json
       |_ bo-user.json
```

#### Folder: scripts
This folder is reserved for pipeline-related scripts and scripts that are not used on TestCafe runtime.

### Variable and Function Naming

Variable and function name should be written in **lowerCamelCase**

```
let fullName = "Immanuel Yohansen"
```

```
function randomFullName() {
    return faker.name.findName()
}
```

### Variable Declaration and Function Expression

Please use **let** and **const** instead of **var**

```
// Bad
var faker = require('faker')

// Good
const faker = require('faker')

// Bad
var fullName = faker.name.findName()

// Good
let fullName = faker.name.findName()
```
  
This also applies to function expression. Write function with ES6 arrow function.

```
// Bad
var add = function(a, b) {
	return a + b
}

// Good
const add = (a, b) => {
	return a + b
}
```

### Tab Spaces and Code Beautify

A tab is 2 space characters. Make sure to setup your editor/IDE that way.

Every time you run `npm run test:chrome` or `npm run test:firefox`, beautify script will be run first before executing TestCafe.

Make sure to run `npm run beautify` before commit.

For VS Code user, you can trigger beautify on save (trigger after pressing Ctrl + S) 

1. Install Beautify (HookyQR) extension

2. Press Ctrl + "," (comma)

3. Click Extensions

4. Click **Edit in Settings.json**

5. Paste these lines below and save.

```json
{
  "[javascript]": {
    "editor.tabSize": 2,
    "editor.insertSpaces": true
  },
  "beautify.config": {
    "js": {
      "ext": [
        "js"
      ],
      "brace_style": "collapse,preserve-inline",
      "break_chained_methods": false,
      "e4x": false,
      "end_with_newline": false,
      "indent_char": " ",
      "indent_level": 0,
      "indent_size": 2,
      "indent_with_tabs": false,
      "jslint_happy": false,
      "keep_array_indentation": false,
      "keep_function_indentation": false,
      "max_preserve_newlines": 0,
      "preserve_newlines": true,
      "space_after_anon_function": false,
      "space_before_conditional": true,
      "space_in_empty_paren": false,
      "space_in_paren": false,
      "unescape_strings": false,
      "wrap_line_length": 0
    }
  },
  "editor.formatOnSave": true,
  "beautify.language": {
    "js": {
      "type": [
        "javascript"
      ]
    }
  }
}
```

## TestCafe: Fixture and Test
If you ever tried [Cypress](https://www.cypress.io/) before, a fixture is a static resource. While in TestCafe, a fixture is a categorization of test cases.

As written in [TestCafe documentation](https://devexpress.github.io/testcafe/documentation/test-api/test-code-structure.html#fixtures):
> TestCafe tests must be organized into categories called fixtures. A JavaScript, TypeScript or CoffeeScript file with TestCafe tests can contain one or more fixtures.

To write a test file, you must define a fixture and write test(s) below it.

```js
import { Selector } from 'testcafe'

fixture `Getting Started`
    .page `http://devexpress.github.io/testcafe/example`

test('My first test', async t => {
    await t
        .typeText('#developer-name', 'John Smith')
        .click('#submit-button')
})
```

### Manual Test
When you analyze a feature, sometimes you will find that some test cases are inefficient or hard to be implemented. This kind of test case must be done manually. But, you still have to document it by writing a test case with empty implementation and add `#manual` at the end of test case name.

```js
test
  .meta({
    SEVERITY: 'normal',
    STORY: 'OBS-999'
  })
  .skip('User should receive email after successful request data verification #manual', async t => {})
```

## TestCafe: Page Object Model
Page Object Model is a design pattern to create object repository for web UI elements. Under this model, for each web page in the application, there should be corresponding page class. This Page class will define the selector of elements for that web page and can also contains Page methods which perform operations on those elements.

For every element inside every page that will be tested must have a page object model.

Here is the example how to implement page object model. In this example, we will make a login page model.

First, create a file inside `model` folder
```sh
$ cd model
$ touch login-page.js
```

Write `LoginPage` class and element identifier that you need for testing this page.
```js
import { Selector } from 'testcafe'

class LoginPage {
  constructor () {
    this.username = Selector('[data-unq="username-field"]')
    this.password = Selector('[data-unq="password-field"]')
    this.submitButton = Selector('#login-submit')
  }
}

export default new LoginPage()
```

Then, to use it inside your test file, simply import it and use this class attributes.

```js
import LoginPage from '../model/login-page'

fixture `Login`
    .page `https://example.site/login`

test('Login using valid credential should succeed', async t => {
    let username = 'investree'
    let password = 'semuabisatumbuh'

    await t
        .typeText(LoginPage.username, username)
        .typeText(LoginPage.password, password)
        .click(LoginPage.submitButton)
        .expect(Selector('#profile-header').innerText).eql('Hello, investree!')
})
```

You can also implement page method inside page object model class.

```js
import { Selector, t } from 'testcafe'

class LoginPage {
  constructor () {
    this.username = Selector('[data-unq="username-field"]')
    this.password = Selector('[data-unq="password-field"]')
    this.submitButton = Selector('#login-submit')
  }

  login (username, password) {
    await t
        .typeText(this.username, username)
        .typeText(this.password, password)
        .click(this.submitButton)
  }
}

export default new LoginPage()
```

```js
import LoginPage from '../model/login-page'

fixture `Login`
    .page `https://example.site/login`

test('Login using valid credential should succeed', async t => {
    let username = 'investree'
    let password = 'semuabisatumbuh'

    LoginPage.login(username, password)
    await t.expect(Selector('#profile-header').innerText).eql('Hello, investree!')
})
```

## Recommended to Use Visual Studio Code

### Plugin: TestLatte

TestLatte is used for listing test cases in your project. You can run a particular test case, unlike using terminal where you have to run the whole test suite.

To use TestLatte in this project, include `"testlatte.filePath": "integration/"` in `settings.json`.

![](https://raw.githubusercontent.com/Selminha/testlatte/master/images/browser-list.png)

### Plugin: TestCafe Test Runner

Just like TestLatte, this plugin is used for running a particular test case just by right clicking test case and click `TestCafe: Run test(s) in browser`
![](https://github.com/romanresh/vscode-testcafe/raw/master/images/demo.gif)