import { memoize, dropRight, isEmpty } from 'lodash';
import tracer from 'tracer';
import debugCreator from 'debug';
import caller from 'caller';

import moduleConfig from '../package.json';

const createDebugFn = memoize(tag => debugCreator(tag));
const logger = tracer.colorConsole({
  format: [
    '{{timestamp}} {{path}}:{{line}} <{{title}}> {{message}}',
    {
      error:
        '{{timestamp}} {{path}}:{{line}} <{{title}}> {{message}} \nCall Stack:\n{{stack}}',
    },
  ],
  dateformat: 'HH:MM:ss.L',
  preprocess: data => {
    data.path = data.path.replace(__dirname, ''); // eslint-disable-line no-param-reassign
  },
});
const hookLogger = (instance, name) => input => {
  if (instance.enabled) {
    instance(input);
  } else {
    logger[name](input);
  }
};

function finalLogger() {
  const callerInfo = dropRight(
    caller().replace(__dirname, '').split('/'),
    1
  ).join(':');
  const debugFn = createDebugFn(
    `${moduleConfig.name}${isEmpty(callerInfo) ? '' : `:${callerInfo}`}`
  );
  const log = hookLogger(debugFn, 'log');
  const info = hookLogger(debugFn, 'info');
  const debug = hookLogger(debugFn, 'debug');
  const error = hookLogger(debugFn, 'error');
  const warn = hookLogger(debugFn, 'warn');
  return {
    log,
    info,
    debug,
    error,
    warn,
  };
}

finalLogger('Logger Initialized');

export default finalLogger;
