import Knex from 'knex';
import { remove } from 'lodash';
import Paginator from 'paginator';
import { info } from 'logger';

const TOTAL_LINKS = 5;

info('Injecting paginate() method to Knex');

const queryBuilderDummyInstance = Knex.Client.prototype.queryBuilder();
const builderPrototype = queryBuilderDummyInstance.constructor.prototype;
Object.assign(builderPrototype, {
  paginate(currentPage = 1, per = 5) {
    const paginator = new Paginator(per, TOTAL_LINKS);
    const queryClone = this.clone();
    remove(queryClone._statements, s => s.grouping === 'order'); // eslint-disable-line no-underscore-dangle
    return queryClone
      .clearSelect()
      .count('* as count')
      .first()
      .then(result => result.count)
      .then(count => {
        const pagination = paginator.build(count, currentPage);
        const { results: limit, first_result: offset } = pagination;
        return {
          pagination,
          results: this.limit(limit).offset(offset),
        };
      });
  },
});
