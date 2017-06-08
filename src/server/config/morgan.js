/* eslint import/no-unresolved: [2, { ignore: ['^~/'] }]*/
import logger from '~/logger'; // eslint-disable-line import/extensions

const { log } = logger;

export default {
  buffer: false,
  stream: { write: input => log(input.trim()) },
};
