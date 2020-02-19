/* 
    A list of dictionaries defining the expected arguments for the performance client. 
*/

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
    '5': 5,
    '10': 10,
    '15': 15,
    '20': 20,
    '40': 40,
    '50': 50,
    '60': 60,
    '70': 70
}

// Number of Users
export const NUM_USERS = {
    '1': 1,
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
    DEFAULT: 'default'
}