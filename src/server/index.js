import express from 'express';
import morgan from 'morgan';
import errorHandler from 'errorhandler';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from '~/logger'; // eslint-disable-line
import {
  morgan as morganConfig,
  errorhandler as errorhandlerConfig,
} from './config';

const { info } = logger();

const app = express();
app.set('port', process.env.PORT || 3000);

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler(errorhandlerConfig));
  app.options('*', cors());
  app.use(cors);
}
app.use(morgan('dev', morganConfig));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(app.get('port'), () => {
  info(`ale-rest listening on port ${app.get('port')}!`);
});
