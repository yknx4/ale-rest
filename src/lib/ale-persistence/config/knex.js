import knex from 'knex';
import bookshelf from 'bookshelf';
import bookshelfModel from 'bookshelf-modelbase';

import knexConfig from '~/../knexfile'; // eslint-disable-line

const configPath =
  process.env.SERVER_ENV || process.env.NODE_ENV || 'development';

const db = knex(knexConfig[configPath]);
const bookshelfDb = bookshelf(db);
const ModelBase = bookshelfModel(bookshelfDb);

bookshelfDb.plugin('pagination');

export { db, bookshelfDb, ModelBase };
