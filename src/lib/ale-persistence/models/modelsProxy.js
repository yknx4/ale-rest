import { libState } from 'ale-persistence/store';

const modelsProxyHandler = {
  get(bsInstance, name) {
    return bsInstance.model(name);
  },
};

const modelsProxy = new Proxy(libState.bookshelf, modelsProxyHandler);
export default modelsProxy;
