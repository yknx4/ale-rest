import knex from 'knex';
import knexConfig from '../../knexfile'; // eslint-disable-line
import './knexFetch';
import './knexPagination';

const configPath =
  process.env.SERVER_ENV || process.env.NODE_ENV || 'development';

const db = knex(knexConfig[configPath]);

if (process.env === 'development') {
  process.once('SIGUSR2', () => {
    db.destroy();
    process.kill(process.pid, 'SIGUSR2');
  });
}

export default db;
