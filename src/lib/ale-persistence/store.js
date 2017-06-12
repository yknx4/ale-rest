import { trace, error } from "logger"; // eslint-ignore-line
import { isString } from "lodash";
import caller from "caller";

const grapqhlObjectTypes = new Map();
const state = new Map();
const models = new Map();

const storeProxyHandler = {
  get(instance, name) {
    if (!isString(name)) return instance[name];
    trace(`Fetching ${name} from ${caller()}`);
    if (!instance.has(name)) {
      throw new TypeError(
        `Couldn't find ${name}. Have you initialized AleRest?`
      );
    }
    return instance.get(name);
  },
  set(instance, name, value) {
    if (instance.has(name)) return false;
    trace(`Setting ${name} from ${caller()}`);
    instance.set(name, value);
    return true;
  }
};

const typesStore = new Proxy(grapqhlObjectTypes, storeProxyHandler);
const libState = new Proxy(state, storeProxyHandler);
const libModels = new Proxy(models, storeProxyHandler);
export { typesStore, libState, libModels };
