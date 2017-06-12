/* @flow */
import { Model } from 'objection';
import { info, log } from 'logger';
import { libState } from './store';

log(`AlePersistence init`);

function init(knex: () => any): void {
  info('Initializing AlePersistence Framework');
  libState.knex = knex;
  Model.knex(knex);
}

export default init;
