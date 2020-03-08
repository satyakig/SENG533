import { getHttp } from '../helpers.js';
import { javaURL, nodeURL } from '../config.js';

const http = getHttp();

export const routes = {
    get: function get() { console.log('GET') },
    put: function put() { console.log('PUT') },
    post: async function post(url, body, results) {
        try {
            const response = await http.post(url, body);
            results.push({
                id: response.data.id,
                totalTime: response.data.totalTime,
                clientTotalTime: response.headers['request-duration']
            });
        } catch (error) {
            console.log(error);
        }
    },
    del: function del() { console.log('DELETE') },
};

export const url = {
    java: {
        sql: javaURL + '/sql',
        nosql: javaURL + '/nosql'
    },
    node: {
        sql: nodeURL + '/sql',
        nosql: nodeURL + '/nosql'
    }
};