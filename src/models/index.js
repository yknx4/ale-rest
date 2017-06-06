import { defaultModel } from '~/lib/ale-persistence'; // eslint-disable-line
import userSchema from './User.json';

const User = defaultModel(userSchema);

export { User }; // eslint-disable-line import/prefer-default-export
