import { GenerateDefaultModel } from '~/lib/ale-persistence'; // eslint-disable-line
import userSchema from './User.json';
import knex from '~/config/knex'; // eslint-disable-line

const defaultModel = GenerateDefaultModel(knex);

const User = defaultModel(userSchema);

export { User }; // eslint-disable-line import/prefer-default-export
