const modelsProxyHandler = {
  get(bsInstance, name) {
    return bsInstance.model(name);
  },
};

const modelsProxy = bookshelf => new Proxy(bookshelf, modelsProxyHandler);
export default modelsProxy;
