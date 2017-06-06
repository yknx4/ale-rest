/* eslint import/no-unresolved: [2, { ignore: ['^~/'] }]*/
import express from 'express';
import morgan from 'morgan';
import logger from '~/logger'; // eslint-disable-line import/extensions

const { info } = logger();

const app = express();
app.set('port', process.env.PORT || 3000);
app.use(
  morgan('dev', {
    buffer: false,
    stream: { write: input => info(input.trim()) },
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(app.get('port'), () => {
  info(`ale-rest listening on port ${app.get('port')}!`);
});
