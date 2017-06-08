import { GenerateDefaultModel } from '~/lib/ale-persistence'; // eslint-disable-line
import userSchema from './User.json';
import knex from '~/config/knex'; // eslint-disable-line

const defaultModel = GenerateDefaultModel(knex);
const { bookshelf } = defaultModel;

const User = defaultModel(userSchema);

const modelsProxyHandler = {
  get(bsInstance, name) {
    return bsInstance.model(name);
  },
};

const models = new Proxy(bookshelf, modelsProxyHandler);

export default models;
export { bookshelf, defaultModel, User }; // eslint-disable-line import/prefer-default-export
