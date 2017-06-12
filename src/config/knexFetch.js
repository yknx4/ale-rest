import Knex from 'knex';
import { remove } from 'lodash';
import { info } from 'logger';

info('Injecting fetch() method to Knex');

const queryBuilderDummyInstance = Knex.Client.prototype.queryBuilder();
const builderPrototype = queryBuilderDummyInstance.constructor.prototype;
Object.assign(builderPrototype, {
  fetch(after, first = 5, key = 'id') {
    console.log('collision');
    const queryClone = this.clone();
    remove(queryClone._statements, s => s.grouping === 'order'); // eslint-disable-line no-underscore-dangle
    return queryClone
      .clearSelect()
      .where(key, '<', after)
      .count('* as count')
      .first()
      .then(result => result.count)
      .then(count => ({
        pagination: { before: count },
        results: this.andWhere(key, '>', after).limit(first),
      }));
  },
});
