/* eslint import/no-unresolved: [2, { ignore: ['^~/'] }]*/
import logger from '~/logger'; // eslint-disable-line import/extensions

const { info } = logger;

export default {
  buffer: false,
  stream: { write: input => info(input.trim()) },
};
