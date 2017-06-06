import defaultModel from '~/lib/ale-persistence/defaultModel'; // eslint-disable-line

const createModel = name => defaultModel(require(`./${name}.json`)); // eslint-disable-line
const User = createModel('User');
const Admin = createModel('User');

export { User, Admin };
