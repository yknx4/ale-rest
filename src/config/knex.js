import knex from 'knex';
import knexConfig from '../../knexfile'; // eslint-disable-line
import './knexPagination';

const configPath =
  process.env.SERVER_ENV || process.env.NODE_ENV || 'development';

const db = knex(knexConfig[configPath]);

process.once('SIGUSR2', () => {
  db.destroy();
  process.exit();
});

export default db;
