/* eslint import/no-unresolved: [2, { ignore: ['^~/'] }]*/
import { info } from 'logger'; // eslint-disable-line import/extensions

export default {
  buffer: false,
  stream: { write: input => info(input.trim()) },
};
