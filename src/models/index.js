import { GenerateDefaultModel, models } from '~/lib/ale-persistence'; // eslint-disable-line
import userSchema from './User.json';
import knex from '~/config/knex'; // eslint-disable-line

const defaultModel = GenerateDefaultModel(knex);
const { bookshelf } = defaultModel;

const User = defaultModel(userSchema);

export default models.modelsProxy(bookshelf);
export { bookshelf, defaultModel, User }; // eslint-disable-line import/prefer-default-export
