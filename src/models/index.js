import { GenerateDefaultModel, models } from '~/lib/ale-persistence'; // eslint-disable-line
import userSchema from './User.json';
import knex from '~/config/knex'; // eslint-disable-line

const defaultModel = GenerateDefaultModel(knex);
const { bookshelf } = defaultModel;

const User = defaultModel(userSchema);

const onlyModels = {
  User,
};

export default models.modelsProxy(bookshelf);
export { bookshelf, defaultModel, onlyModels }; // eslint-disable-line import/prefer-default-export
