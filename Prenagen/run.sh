#!/bin/sh

BROWSER=$1
TEST_FOLDER=$2
BROWSER_ARGV=""
TESTER_NAME=${TESTER}

if [ -z "$TEST_FOLDER" ] || [ -z "$BROWSER" ] || [ -z "$TESTER_NAME" ]; then
    echo "Usage: TESTER=<my_tester_name> sh run.sh <browser> <test_folder> [option]" 
    echo "Example: TESTER=reyhan sh run.sh chrome integration/backoffice"
    echo "For headless usage, add --headless at the end of command"
    exit 1;
fi

user_check=$(node scripts/checkTesterName.js)

if [ "$user_check" = "NOT_EXIST" ]; then
    echo "Tester name does not exist. Please contact your administrator."
    exit 1;
fi

if [ "$3" = "--headless" ]; then
    if [ "$BROWSER" = "chrome" ]; then
        BROWSER_ARGV="chrome --headless --disable-gpu --window-size=\"1366,768\""
    elif [ "$BROWSER" = "chromium" ]; then
        BROWSER_ARGV="chromium --headless --disable-gpu --window-size=\"1366,768\""
    elif [ "$BROWSER" = "firefox" ]; then
        BROWSER_ARGV="firefox --headless -width=1366 -height=768"
    elif [ "$BROWSER" = "chrome,firefox" ]; then
        BROWSER_ARGV="chrome --headless --disable-gpu --window-size=\"1366,768\",firefox --headless -width=1366 -height=768"
    elif [ "$BROWSER" = "chromium,firefox" ]; then
        BROWSER_ARGV="chromium --headless --disable-gpu --window-size=\"1366,768\",firefox --headless -width=1366 -height=768"
    fi
else
    if [ "$BROWSER" = "chrome" ]; then
        BROWSER_ARGV="chrome --window-size=\"1366,768\""
    elif [ "$BROWSER" = "chromium" ]; then
        BROWSER_ARGV="chromium --window-size=\"1366,768\""
    elif [ "$BROWSER" = "firefox" ]; then
        BROWSER_ARGV="firefox -width=1366 -height=768"
    elif [ "$BROWSER" = "chrome,firefox" ]; then
        BROWSER_ARGV="chrome --window-size=\"1366,768\",firefox -width=1366 -height=768"
    elif [ "$BROWSER" = "chromium,firefox" ]; then
        BROWSER_ARGV="chromium --window-size=\"1366,768\",firefox -width=1366 -height=768"
    fi
fi

# Run test
npm run test -- "$BROWSER_ARGV" -r spec,json:report/report.json "$TEST_FOLDER" || EXIT_STATUS=$?

# Post test reporting
node scripts/reportScraper.js

if [ -z "$EXIT_STATUS" ];
then
    exit 0;
else
    exit $EXIT_STATUS;
fi