import { generateModel, models } from 'ale-persistence'; // eslint-disable-line
import userSchema from './User.json';

const User = generateModel(userSchema);

const onlyModels = {
  User,
};

export default models.modelsProxy;
export { onlyModels }; // eslint-disable-line import/prefer-default-export
