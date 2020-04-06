import parseArgs from 'minimist';
import { generateJSON, generateId, writeToFile } from './helpers.js';
import { routes, url } from './routes/routes.js';
import { getDb } from './GCloud.js';

import {
    // INTERNAL TEST CONSTANTS
    TEST_PERIOD,
    CHECK_PERIOD,
    TOO_MANY_ERRORS,

    // ACCEPTABLE CONSOLE ARGS
    SERVER,
    DB,
    SIZE,
    FREQ,
    SCENARIO,
    INSTANCE
} from './args.js';

(async () => {

    // Get function for request type
    function getScenario(scenario) {
        const type = {
            [SCENARIO.DEFAULT]: routes.post,
            [SCENARIO.GET]: routes.get,
            [SCENARIO.POST]: routes.post,
            [SCENARIO.PUT]: routes.put,
            [SCENARIO.DELETE]: routes.del,
        };
        return type[scenario];
    }

    // Destructure console args
    const {
        server = SERVER.NODE,
        db = DB.NOSQL,
        size = SIZE["1KB"],
        freq = FREQ['1'],
        scenario = SCENARIO.DEFAULT,
        instance = INSTANCE.TINY
    } = parseArgs(process.argv.slice(2));

    console.log(
        '\nRecieved Arguments:',
        '\n\tServer: ' + server,
        '\n\tDatabase: ' + db,
        '\n\tSize: ' + size,
        '\n\tRequest Frequency: ' + freq,
        '\n\tTest Scenario: ' + scenario,
        '\n\tInstance Type: ' + INSTANCE[instance],
        '\n'
    );

    // Generate mock objects of specified size
    let requests = [];
    for (let i = 0; i < 10; i++) {
        requests.push(generateJSON(size));
    }

    // Determine server / db routes
    const scenarioURL = url[server][db];
    const runScenario = getScenario(scenario);
    let results = [];

    let totalErrors = 0;
    let consecutiveErrors = 0;
    const updateErrors = (errorOccurred) => {
        if (errorOccurred) {
            totalErrors++;
            consecutiveErrors++;
        }
        else {
            consecutiveErrors = 0;
        }
    }

    console.log('\nSending a warmup message to wake up the server.\n');

    const testRequest = {
        id: generateId(),
        frequency: freq + '',
        requestSize: size + '',
        data: requests[Math.floor(Math.random() * 9)] // Pick one of the ten generated requests
    };
    await runScenario(scenarioURL, testRequest, [], INSTANCE[instance], updateErrors);

    if (totalErrors > 0) {
        console.log('Warmup message failed. Aborting test https://' + INSTANCE[instance] + scenarioURL);
    }
    else {
        console.log('Success. \n\nStarting test in\n');

        for (let countdown = 3; countdown > 0; countdown--) {
            console.log(countdown);
            await new Promise(resolve => setTimeout(resolve, 1000 * 1));
        }

        console.log('Starting Test. Send requests every: ' + 1000 / freq + ' ms');

        // Trigger the scenario at a rate of [frequency] times per second
        let test = setInterval(() => {
            const request = {
                id: generateId(),
                frequency: freq + '',
                requestSize: size + '',
                data: requests[Math.floor(Math.random() * 9)] // Pick one of the ten generated requests
            };

            const errorResponse = {
                id: request.id,
                frequency: freq + '',
                requestSize: size + '',
                instanceType: INSTANCE[instance],
                serverType: server,
                databaseType: db,
                totalTime: -1,
                clientTotalTime: -1,
                timestamp: Date.now(),
                cpuUsage: -1,
                freeMem: -1,
                timeDelete: -1,
                timeRead: -1,
                timeWrite: -1,
                totalMem: -1                
            }

            runScenario(scenarioURL, request, results, INSTANCE[instance], updateErrors, errorResponse);
        }, (1000 / freq));

        // Function to end the test
        const endTest = async () => {
            // if test has already been cleared, don't try to end it again.
            if (test) {
                clearInterval(test);
                test = null;

                console.log('\nTest Complete. Waiting 10 seconds for any open calls to finish');
                await new Promise(resolve => setTimeout(resolve, 1000 * 10));
                console.log('Sent ~' + (results.length) + ' requests over ' + TEST_PERIOD / 1000 + ' seconds with ' + totalErrors + ' errors');

                const now = new Date();
                const title = INSTANCE[instance] + '-' + server + '-' + db + '-' + now.getTime();

                // Save settings and timings to local file
                writeToFile(title, {
                    settings: {
                        timestamp: now,
                        server: server,
                        db: db,
                        size: size,
                        freq: freq,
                        scenario: scenario,
                        instanceType: INSTANCE[instance]
                    },
                    summary: {
                        totalFailed: totalErrors,
                        totalSuccess: results.length,
                        testLength: TEST_PERIOD / 1000 + ' seconds'
                    },
                    // Uncomment this line to save the final results locally (id, totalTime, etc). Either way they are inserted into the logs db.
                    // results: results 
                });

                // Save them to the database in batches (max 500 writes allowed in a batch)
                const logDb = await getDb();

                let i = 0;
                let batchCount = 1;
                let batch = logDb.batch();

                for (let doc of results) {
                    i++;
                    let logRef = logDb
                        .collection('logs')
                        .doc(doc.id);
                    batch.set(logRef, doc, { merge: true })

                    if (i >= 400) {
                        i = 0;
                        await batch.commit();
                        console.log('Saving log batch ' + batchCount);
                        batchCount++;
                        batch = logDb.batch();
                    }
                }

                if (i !== 0) {
                    await batch.commit();
                    console.log('Saving log batch ' + batchCount);
                }
            }
        }

        let triggerEndOfTest = null;

        // If too many errors are thrown in a row, terminate the test
        let checkErrors = setInterval(() => {
            if (consecutiveErrors > TOO_MANY_ERRORS) {
                console.log('Too Many Errors! Aborting test.\n');
                if (checkErrors) {
                    clearInterval(checkErrors);
                    checkErrors = null;
                }
                if (triggerEndOfTest) {
                    clearTimeout(triggerEndOfTest);
                    triggerEndOfTest = null;
                }
                endTest();
            }
        }, CHECK_PERIOD);

        // After TEST_PERIOD, we end the test
        triggerEndOfTest = setTimeout(() => {
            triggerEndOfTest = null;
            if (checkErrors) {
                clearInterval(checkErrors);
                checkErrors = null;
            }
            endTest();
        }, TEST_PERIOD);
    }
})();
