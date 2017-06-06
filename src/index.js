import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const { info, debug, warn, error } = logger();

info('info');
debug('debug');
warn('warn');
error('error');
