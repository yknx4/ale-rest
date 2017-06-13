import { log, trace, info, warn } from 'logger';
import NodeCache from 'node-cache';
import CacheOperation from './CacheOperation';

const ttl = 10;
const countCache = new NodeCache({ stdTTL: ttl, checkperiod: 2 });
const cacheKey = builder => builder.toString();

const cacheOperation = new CacheOperation();
const CachedQueryBuilder = Model =>
  class CacheQueryBuilder extends Model.QueryBuilder {
    resultSize() {
      const knex = this.knex();

      // orderBy is useless here and it can make things a lot slower (at least with postgresql 9.3).
      // Remove it from the count query. We also remove the offset and limit
      const query = this.clone().clear(/orderBy|offset|limit/).build();
      const rawQuery = knex.raw(query).wrap('(', ') as temp');
      const countQuery = knex.count('* as count').from(rawQuery);

      if (this.internalOptions().debug) {
        countQuery.debug();
      }

      const cKey = countQuery.toString();
      const cachedCount = countCache.get(cKey);
      if (cachedCount != null) {
        log(`Hit from cache (TTL:${ttl}s): ${cKey}`);
        return Promise.resolve(cachedCount);
      }

      return countQuery
        .then(result => (result[0] ? result[0].count : 0))
        .then(count => {
          trace(`Cache miss. Storing result to ${cKey}`);
          countCache.set(cKey, count);
          return count;
        });
    }
    cache() {
      // Take a clone so that we don't modify this instance during execution.
      const builder = this;
      info('Cache Enabled');

      const cachedResult = cacheOperation.cache.get(cacheKey(builder));
      if (cachedResult != null) {
        warn(`Hit from cache (TTL:${ttl}s): ${cacheKey(builder)}`);
        builder.resolve(cachedResult);
      }

      // eslint-disable-next-line no-underscore-dangle
      builder._operations.push(cacheOperation);

      return this;
    }
  };
export default CachedQueryBuilder;
