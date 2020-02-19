import { 
    SERVER,
    DB,
    SIZE,
    FREQ,
    NUM_USERS,
    SCENARIO 
} from './args.js';

import * as javaRoute from './routes/java.js';
import * as nodeRoute from './routes/node.js';

import parseArgs from 'minimist';

let args = parseArgs(process.argv.slice(2));

console.log(args);

console.log('Client started!');

javaRoute.get();
nodeRoute.get();