import models, { defaultModel } from './index';
import userSchema from './User.json';

describe('index proxy', () => {
  it('should retrieve User model from proxy', () => {
    expect(models.User).toEqual(defaultModel(userSchema)); // eslint-disable-line
  });
});
