/* eslint import/no-unresolved: [2, { ignore: ['^~/'] }]*/
import { error, info } from 'logger'; // eslint-disable-line import/extensions

function errorNotification(err, str, req) {
  info(`Error in ${req.method} ${req.url}`);
  error(str);
}

export default {
  log: errorNotification,
};
