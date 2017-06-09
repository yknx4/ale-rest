/* eslint import/no-unresolved: [2, { ignore: ['^~/'] }]*/
import logger from '~/logger'; // eslint-disable-line import/extensions

const { error, info } = logger;

function errorNotification(err, str, req) {
  info(`Error in ${req.method} ${req.url}`);
  error(str);
}

export default {
  log: errorNotification,
};
