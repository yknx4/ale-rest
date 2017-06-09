import DataLoader from "dataloader";
import Cache from "caching-map";
import { modelsProxy } from "ale-persistence/models";

const loadersCache = new Cache(10);

const ttl = (~~process.env.LOADER_TTL || 5) * 1000; //eslint-disable-line
const getLoader = (modelName: string, key: string = ""): DataLoader => {
  const Model = modelsProxy[modelName];
  const compoundKey = `${modelName}---${key}`;
  loadersCache.get(compoundKey) == null && // eslint-disable-line no-unused-expressions
    loadersCache.set(
      compoundKey,
      new DataLoader((keys: Array<any>) =>
        Model.rawQuery().where(Model.schema.primaryKey, "IN", keys)
      ),
      { ttl }
    );
  return loadersCache.get(compoundKey);
};

export default getLoader;
