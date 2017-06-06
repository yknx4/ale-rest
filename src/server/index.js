/* eslint import/no-unresolved: [2, { ignore: ['^~/'] }]*/
import express from 'express';
import logger from '~/logger'; // eslint-disable-line import/extensions

const { info } = logger();

const app = express();
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(app.get('port'), () => {
  info(`ale-rest listening on port ${app.get('port')}!`);
});
