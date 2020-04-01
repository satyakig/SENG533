import dummyJson from 'dummy-json';
import shortId from 'shortid';
import axios from 'axios';
import fs from 'fs';

// Generate unique short id 
export function generateId() {
  return shortId.generate();
}

// Save a json object to a file with a unique id
export function writeToFile(title, data) {
  try {
    fs.writeFileSync('./results/' + title + '-' + generateId() + '.json', JSON.stringify(data));
  } catch (error) {
    console.error(error)
  }
}

// Init http library with request timing middleware
export function getHttp() {
  const http = axios.create();

  http.interceptors.request.use((config) => {
    config.headers['request-startTime'] = process.hrtime()
    return config
  });

  http.interceptors.response.use((response) => {
    const start = response.config.headers['request-startTime']
    const end = process.hrtime(start)
    const milliseconds = Math.round((end[0] * 1000) + (end[1] / 1000000))
    response.headers['request-duration'] = milliseconds
    return response
  });

  return http;
}

// Generate a JSON array with mock data. 
// The JSON object will approximately equal the "size" variable in Kilobytes
export const generateJSON = (size /* in KB */) => {

    let myPartials = {
        user: '{\
          "id": {{@index}},\
          "firstName": "{{firstName}}",\
          "lastName": "{{lastName}}",\
          "email": "{{email}}",\
          "dob": "{{date \'1900\' \'2000\' \'YYYY\'}}",\
          "price": "${{int 0 99999 \'0,0\'}}",\
          "text": {{lorem}},\
          "location": {\
            "x": {{float -50 50 \'0.00\'}},\
            "y": {{float -25 25 \'0.00\'}}\
          }\
        }'
    };

    let template = '{\
          "users": [\
            {{#repeat ' + (2 * size) + '}}\
              {{> user}}\
            {{/repeat}}\
          ]\
        }';

    const result = dummyJson.parse(template, { partials: myPartials });
    console.log('Generated json data size: ' + (JSON.stringify(result).length / 1024) + ' KB');
    return result;
}