import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { initializeFirebase, initializeMySql } from './GCloud';
import { noSqlRoute } from './nosql';
import { sqlRoute } from './sql';

initializeFirebase();
initializeMySql();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('short'));

app.use('/nosql', noSqlRoute);
app.use('/sql', sqlRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.debug(`Server started at http://localhost:${PORT}`);
});

export default app;