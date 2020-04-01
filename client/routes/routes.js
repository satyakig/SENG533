import { getHttp } from '../helpers.js';
import { javaURL, nodeURL, prefixURL } from '../config.js';

const http = getHttp();

export const routes = {
    get: function get() { console.log('GET') },
    put: function put() { console.log('PUT') },
    post: async function post(url, body, results, instance, updateErrors, errorResponse) {
        try {
            const response = await http.post(prefixURL + instance + url, body);

            results.push({
                id: response.data.id,
                totalTime: response.data.totalTime,
                clientTotalTime: response.headers['request-duration'],
                instanceType: instance
            });

            updateErrors(false);
        } catch (error) {
            results.push(errorResponse);
            updateErrors(true);
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