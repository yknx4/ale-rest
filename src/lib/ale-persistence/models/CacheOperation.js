import { QueryBuilderOperation } from 'objection';
import { trace } from 'logger';
import NodeCache from 'node-cache';

const ttl = 3;
const rawResultCache = new NodeCache({ stdTTL: ttl, checkperiod: 1 });
const cacheKey = builder => builder.toString();

function cacheResult(builder, result) {
  trace(`Cache miss. Storing result to ${cacheKey(builder)}`);
  rawResultCache.set(cacheKey(builder), result);
  return result;
}

class CacheOperation extends QueryBuilderOperation {
  constructor(...args) {
    super(...args);
    this.onRawResult = cacheResult;
    this.$cache = rawResultCache;
  }

  get cache() {
    return this.$cache;
  }
}

export default CacheOperation;
