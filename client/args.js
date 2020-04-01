/* 
    A list of dictionaries defining the expected arguments and constants for the performance client. 
*/

// Length of the Test
export const TEST_PERIOD = 1000 * 120; // Two Minutes

// How many consecutive errors before preemtively stopping test
export const TOO_MANY_ERRORS = 10;

// How often to check error count
export const CHECK_PERIOD = 1000 * 2;

// Which GCP server instance size to use
export const INSTANCE = {
    TINY: 'b1',
    SMALL: 'b2',
    MEDIUM: 'b4',
    LARGE: 'b8'
}

// Server Type
export const SERVER = {
    JAVA: 'java',
    NODE: 'node'
}

// Database Type
export const DB = {
    NOSQL: "nosql",
    SQL: "sql"
}

// Request Size
export const SIZE = {
    '1KB': 1,
    '5KB': 5,
    '20KB': 20,
    '50KB': 50,
    '100KB': 100,
    '200KB': 200,
    '500KB': 500,
    '1MB': 1000
};

// Requests per second
export const FREQ = {
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '10': 10,
    '15': 15,
    '20': 20,
    '40': 40,
    '50': 50,
    '60': 60,
    '70': 70
}

// Which use-case to run
export const SCENARIO = {
    DEFAULT: 'default',
    GET: 'get',
    PUT: 'put',
    POST: 'post',
    DELETE: 'delete'
}
