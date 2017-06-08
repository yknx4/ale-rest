import DataLoader from 'dataloader';
import Cache from 'caching-map';

const loadersCache = new Cache(10);

const ttl = (~~process.env.LOADER_TTL || 5) * 1000; //eslint-disable-line
const getLoader = (Model: Function, key: string = ''): DataLoader => {
  const compoundKey = `${Model.name}---${key}`;
  loadersCache.get(compoundKey) == null && // eslint-disable-line no-unused-expressions
    loadersCache.set(
      compoundKey,
      new DataLoader((keys: Array<any>): Promise<any> =>
        Model.where(Model.schema.primaryKey, 'IN', keys)
          .fetchAll()
          .then(r => r.toArray())
      ),
      { ttl }
    );
  return loadersCache.get(compoundKey);
};

export default getLoader;
