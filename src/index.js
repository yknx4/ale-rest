import logger from './logger';

const { info, debug, warn, error } = logger();

info('info');
debug('debug');
warn('warn');
error('error');
