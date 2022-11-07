require('module-alias/register');
const config = require('../config');
const fs = require('fs');
const http = require('http');
const os = require('os');
const qaDb = require('../knexfile')['qa_report'];
const knex = require('knex')(qaDb);
process.setMaxListeners(0);

const BUILD = process.env.build;
const ENV = config.env;
const WHERE = process.env.WHERE;
const TRIBE = process.env.TRIBE;
const TESTER_NAME = process.env.TESTER;

if (ENV === undefined || ENV === null) {
  console.log('[Report Scraper] No ENV variable. Aborting process.');
  process.exit(-1);
}

if (TESTER_NAME === undefined || TESTER_NAME === null) {
  console.log('[Report Scraper] No TESTER variable. Aborting process.');
  process.exit(-1);
}

if (!config.report.save_to_db) {
  console.log('[Report Scraper] config.report.save_to_db is disabled. Aborting process.');
  process.exit(-1);
}

const DEFAULT_REPORT_LOCATION = 'report/report.json';
let argv = process.argv.slice(2);
let REPORT_LOCATION = argv[0] === '--json-report' ? argv[1] : DEFAULT_REPORT_LOCATION;

ALLOWED_SEVERITY = ['blocker', 'critical', 'minor'];
ALLOWED_TYPE = ['smoke', 'negative'];

/** Main script */
const main = async () => {
  console.log('[Report Scraper] Starting...');
  let startTime = process.hrtime();

  const jsonReport = JSON.parse(fs.readFileSync(REPORT_LOCATION));
  const reportChecksum = require('crypto')
    .createHash('sha256')
    .update(JSON.stringify(jsonReport))
    .digest('hex');

  let fixtureList = jsonReport.fixtures;
  let userAgentList = jsonReport.userAgents;

  let serviceName = config.env === 'stg' ? 'staging' : TRIBE;
  let serviceListId = await addServiceList({
    "sl_name": serviceName.toLowerCase(),
    "sl_type": "frontend",
    "sl_created_at": knex.fn.now(),
    "sl_updated_at": knex.fn.now()
  });

  let testerId = await getTesterId(TESTER_NAME);
  if (!testerId) {
    console.log(`[Report Scraper] User with tester name ${TESTER_NAME} not found. Aborting process.`)
    process.exit(-1);
  }

  let testRunSessionId = await addTestRunSession({
    "trs_u_id": testerId,
    "trs_started_at": jsonReport.startTime,
    "trs_ended_at": jsonReport.endTime,
    "trs_build_number": BUILD,
    "trs_env": ENV,
    "trs_req_origin": WHERE ? WHERE : await getPublicIp(),
    "trs_hostname": os.userInfo().username + '@' + os.hostname(),
    "trs_checksum": reportChecksum,
    "trs_created_at": knex.fn.now()
  });

  if (testRunSessionId === 'exist') {
    console.log('[Report Scraper] Report with the same checksum is already in database. Aborting process.');
    process.exit(-1);
  }

  for (let fixture of fixtureList) {
    let testSuiteId = await addTestSuite({
      "ts_sl_id": serviceListId,
      "ts_title": fixture.name.toLowerCase(),
      "ts_created_at": knex.fn.now(),
      "ts_updated_at": knex.fn.now()
    });

    let testSuiteRunTimeId = await addTestSuiteRunTime({
      "tsrt_ts_id": testSuiteId,
      "tsrt_sl_id": serviceListId,
      "tsrt_trs_id": testRunSessionId,
      "tsrt_duration": 0,
      "tsrt_created_at": knex.fn.now()
    });

    let tcsDuration = 0;
    for (let tc of fixture.tests) {
      tcsDuration += tc.durationMs;

      let tcTitle = tc.name.replace('#manual', '')
        .trim()
        .toLowerCase();
      let tcType = tc.meta.TYPE.toLowerCase(); // smoke, negative
      let tcIsManual = tc.name.includes('#manual') ? true : false;
      let tcJiraId = tc.meta.STORY;
      let tcSeverity = tc.meta.SEVERITY.toLowerCase();

      let psId;
      if (tcJiraId) {
        tcJiraId = tcJiraId.toUpperCase().trim();
        if (tcJiraId.split('-').length !== 2) {
          let strPart = tcJiraId.match(/\D/g).join('');
          tcJiraId = tcJiraId.replace(/\D/g, '');
          tcJiraId = strPart + '-' + tcJiraId;
        }

        psId = await addParentStory({
          "ps_jira_id": tcJiraId,
          "ps_created_at": knex.fn.now(),
          "ps_updated_at": knex.fn.now()
        });
      }

      if (!ALLOWED_SEVERITY.includes(tcSeverity))
        tcSeverity = '-';

      if (!ALLOWED_TYPE.includes(tcType))
        tcType = '-';

      let testCaseId = await addTestCase({
        "tc_ts_id": testSuiteId,
        "tc_ps_id": psId,
        "tc_title": tcTitle,
        "tc_type": tcType,
        "tc_is_manual": tcIsManual,
        "tc_severity": tcSeverity,
        "tc_created_at": knex.fn.now(),
        "tc_updated_at": knex.fn.now()
      });

      for (let browserName of userAgentList) {
        let trStatus;
        let trContext = tc.errs.find(err =>
          err.match(/(Browser:[^\\\n]+)/g)[0]
          .replace('Browser: ', '') === browserName);

        if (trContext)
          trStatus = trContext.match(/AssertionError/g) ?
          'failed' : 'broken';
        else
          trStatus = 'passed';

        if (tcIsManual)
          trStatus = 'pending';

        await addTestResult({
          "tr_tc_id": testCaseId,
          "tr_tsrt_id": testSuiteRunTimeId,
          "tr_status": trStatus,
          "tr_response_time": null,
          "tr_run_time": tc.durationMs,
          "tr_browser": browserName,
          "tr_context": trContext,
          "tr_created_at": knex.fn.now(),
          "tr_updated_at": knex.fn.now()
        });
      }
    };

    await updateTestSuitesRunTimeDuration(testSuiteRunTimeId, tcsDuration);
  };

  let endTime = process.hrtime(startTime);
  endTime = Math.floor(endTime[0] * 1000 + endTime[1] / 1000000);
  console.log('[Report Scraper] Finished');
  console.log('[Report Scraper] Elapsed time: ' + endTime + ' ms');
}

main()
  .then(() => knex.destroy());
/** End of main script */

async function getTesterId(testerName) {
  return knex.select('u_id')
    .from('users')
    .where({
      u_tester_name: testerName
    })
    .first()
    .then((row) => {
      if (row) {
        return row.u_id;
      }
    });
}

async function addServiceList(values) {
  return knex.select('sl_id')
    .from('service_list')
    .where({
      sl_name: values.sl_name
    })
    .first()
    .then((row) => {
      if (row === undefined) {
        return knex('service_list')
          .returning('sl_id')
          .insert(values)
          .then(slId => slId[0]);
      } else {
        return row.sl_id;
      }
    });
}

async function addTestSuite(values) {
  return knex.select('ts_id')
    .from('test_suites')
    .where({
      ts_title: values.ts_title
    })
    .first()
    .then((row) => {
      if (row === undefined) {
        return knex('test_suites')
          .returning('ts_id')
          .insert(values)
          .then(tsId => tsId[0]);
      } else {
        return row.ts_id;
      }
    });
}

async function addTestSuiteRunTime(values) {
  return knex.select('tsrt_id')
    .from('test_suites_run_time')
    .where({
      tsrt_ts_id: values.tsrt_ts_id,
      tsrt_trs_id: values.tsrt_trs_id
    })
    .first()
    .then((row) => {
      if (row === undefined) {
        return knex('test_suites_run_time')
          .returning('tsrt_id')
          .insert(values)
          .then(tsrtId => tsrtId[0]);
      } else {
        return row.tsrt_id;
      }
    });
}

async function addTestCase(values) {
  return knex.select('tc_id')
    .from('test_cases')
    .where({
      tc_title: values.tc_title,
      tc_ts_id: values.tc_ts_id
    })
    .first()
    .then((row) => {
      if (row === undefined) {
        return knex('test_cases')
          .returning('tc_id')
          .insert(values)
          .then(tsId => tsId[0]);
      } else {
        return row.tc_id;
      }
    });
}

async function addTestResult(values) {
  return knex('test_results')
    .insert(values);
}

async function addParentStory(values) {
  return knex.select('ps_id')
    .from('parent_story')
    .where({
      ps_jira_id: values.ps_jira_id
    })
    .first()
    .then((row) => {
      if (row === undefined) {
        return knex('parent_story')
          .returning('ps_id')
          .insert(values)
          .then(psId => psId[0]);
      } else {
        return row.ps_id;
      }
    });
}

async function addTestRunSession(values) {
  return knex.select('trs_id')
    .from('test_run_session')
    .where({
      trs_checksum: values.trs_checksum
    })
    .first()
    .then((row) => {
      if (row === undefined) {
        return knex('test_run_session')
          .returning('trs_id')
          .insert(values)
          .then(trsId => trsId[0]);
      } else {
        return "exist";
      }
    });
}

async function updateTestSuitesRunTimeDuration(tsrtId, value) {
  return knex('test_suites_run_time')
    .where('tsrt_id', tsrtId)
    .update({
      tsrt_duration: value
    });
}

async function getPublicIp() {
  const data = [];
  return new Promise((resolve, reject) => {
    const req = http.get({
      host: 'ipv4bot.whatismyipaddress.com',
      port: 80,
      path: '/'
    }, function(res) {
      res.on("data", function(chunk) {
        data.push(chunk);
      });

      res.on('end', () => resolve(Buffer.concat(data).toString()));
    });

    req.on('error', function(e) {
      reject("[Report Scraper] Can't get external IP" + e.message);
    });

    req.end();
  });
}