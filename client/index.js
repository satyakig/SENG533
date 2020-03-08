import parseArgs from 'minimist';
import { generateJSON, generateId, writeToFile } from './helpers.js';
import { routes, url } from './routes/routes.js';
import { getDb } from './GCloud.js';

import {
    TEST_PERIOD,
    SERVER,
    DB,
    SIZE,
    FREQ,
    NUM_USERS,
    SCENARIO
} from './args.js';

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
    freq = FREQ[5],
    num_users = NUM_USERS[1],
    scenario = SCENARIO.DEFAULT
} = parseArgs(process.argv.slice(2));

console.log(
    '\nRecieved Arguments:',
    '\n\tServer: ' + server,
    '\n\tDatabase: ' + db,
    '\n\tSize: ' + size,
    '\n\tRequest Frequency: ' + freq,
    '\n\tNumber of Users: ' + num_users,
    '\n\tTest Scenario: ' + scenario,
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

console.log('Start testing every:' + 1000 / freq);

// Trigger the scenario at a rate of [frequency] times per second
let test = setInterval(() => {
    const request = {
        id: generateId(),
        frequency: freq + '',
        requestSize: size + '',
        data: requests[Math.floor(Math.random() * 9)] // Pick one of the ten generated requests
    };
    runScenario(scenarioURL, request, results);
}, (1000 / freq));

// After two minutes we end the test
setTimeout(async () => {
    clearInterval(test);
    console.log('\nTest Complete. Waiting 10 seconds for any open calls to finish');
    await new Promise(resolve => setTimeout(resolve, 1000 * 10));
    console.log('Sent ' + results.length + ' requests over ' + TEST_PERIOD / 1000 + ' seconds');

    // Save settings and timings to local file (just in case)
    writeToFile({
        settings: {
            server: server,
            db: db,
            size: size,
            freq: freq,
            num_users: num_users,
            scenario: scenario
        },
        results: results
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

        if (i >= 10) {
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

}, TEST_PERIOD);