import DataLoader from "dataloader";
import Cache from "caching-map";
import { log } from "logger";
import batchGet from "./batchGet";
import { seconds } from "../types";

log(`getLoader.js`);
const loadersCache = new Cache(10);

const ttl = ((~~process.env.LOADER_TTL || 5) * 1000: seconds); // eslint-disable-line no-bitwise
function getLoader(modelName: string, key: string = ""): DataLoader {
  const compoundKey = `${modelName}---${key}`;
  loadersCache.get(compoundKey) == null && // eslint-disable-line no-unused-expressions
    loadersCache.set(compoundKey, new DataLoader(batchGet(modelName)), { ttl });
  return loadersCache.get(compoundKey);
}

export default getLoader;
