import { dropRight } from 'lodash';
import tracerdebug from 'tracerdebug';

const path = dropRight(__dirname.split('/'), 2).join('/');

const logger = tracerdebug.colorConsole({
  format: [
    '{{timestamp}} {{path}}:{{line}} <{{title}}> {{message}}',
    {
      error:
        '{{timestamp}} {{path}}:{{line}} <{{title}}> {{message}} \nCall Stack:\n{{stack}}',
      log: '{{timestamp}} <{{title}}> {{message}} \nCall Stack:\n{{stack}}',
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
export default logger;
