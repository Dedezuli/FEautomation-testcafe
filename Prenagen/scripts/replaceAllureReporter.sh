#!/bin/sh

ALLURE_REPORTER_DIR=node_modules/testcafe-reporter-allure/lib

yes | cp -rf scripts/allure/generateConfig.js "${ALLURE_REPORTER_DIR}"
yes | cp -rf scripts/allure/index.js "${ALLURE_REPORTER_DIR}"