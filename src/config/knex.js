import knex from 'knex';
import knexConfig from '../../knexfile'; // eslint-disable-line

const configPath =
  process.env.SERVER_ENV || process.env.NODE_ENV || 'development';

const db = knex(knexConfig[configPath]);

export default db;
