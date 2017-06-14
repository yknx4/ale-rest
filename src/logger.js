import { dropRight, isString } from 'lodash';
import tracerdebug from 'tracerdebug';

const path = dropRight(__dirname.split('/'), 2).join('/');

const { DEBUG, LOG, DEBUG_LOG } = process.env;

const level = isString(DEBUG) && DEBUG.includes('ale')
  ? DEBUG_LOG || 'log'
  : LOG || 'info';

console.log(`Log Level: ${level}`); // eslint-disable-line no-console

const logger = tracerdebug.colorConsole({
  level,
  format: [
    '{{timestamp}} {{path}}:{{line}} <{{title}}> {{message}}',
    {
      error:
        '{{timestamp}} {{path}}:{{line}} <{{title}}> {{message}} \nCall Stack:\n{{stack}}',
      log: '{{timestamp}} <{{title}}> {{message}}',
    },
  ],
  dateformat: 'HH:MM:ss.L',
  preprocess: data => {
    if (data.title === 'log') {
      data.path = 'ale-server'; // eslint-disable-line no-param-reassign
    } else {
      data.path = data.path.replace(path, ''); // eslint-disable-line no-param-reassign
    }
  },
});

const { log, trace, debug, info, warn, error } = logger;

process.stderr.on('data', data => {
  error(data);
});

export default logger;

export { log, trace, debug, info, warn, error };
