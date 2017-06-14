import { generateModel, models } from 'ale-persistence'; // eslint-disable-line
import userSchema from './User.json';
import postSchema from './Post.json';

const User = generateModel(userSchema);
const Post = generateModel(postSchema);

const onlyModels = {
  User,
  Post,
};

export default models;
export { onlyModels }; // eslint-disable-line import/prefer-default-export
