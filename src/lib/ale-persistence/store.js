import { trace, error } from "logger"; // eslint-ignore-line
import { isString } from "lodash";

const grapqhlObjectTypes = new Map();
const state = new Map();

const storeProxyHandler = {
  get(instance, name) {
    if (!isString(name)) return instance[name];
    trace(`Fetching ${name}`);
    if (!instance.has(name)) {
      error(Object.keys(instance));
      throw new TypeError(
        `Couldn't find ${name}. Have you initialized AleRest?`
      );
    }
    return instance.get(name);
  },
  set(instance, name, value) {
    if (instance.has(name)) return false;
    trace(`Setting ${name}`);
    instance.set(name, value);
    return true;
  }
};

const typesStore = new Proxy(grapqhlObjectTypes, storeProxyHandler);
const libState = new Proxy(state, storeProxyHandler);
export { typesStore, libState };
