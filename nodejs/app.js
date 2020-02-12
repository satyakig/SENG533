const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const asyncHandler = require('express-async-handler')


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(morgan('dev'));

app.use(
  '/',
  asyncHandler(async (req, res, next) => {
    res.send('Hello World');
  }),
);

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.debug(`Server started at http://localhost:${PORT}`);
  });
}

module.exports = app;