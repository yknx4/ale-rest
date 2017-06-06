import { User } from './index';

const requiredFields = {
  first_name: 'first',
  last_name: 'last',
};

const invalidEmailAttrs = {
  ...requiredFields,
  email: `invalidemail${Math.random()}`,
};

describe('User', () => {
  test('Model', () => {
    expect(User.name).toBe('User');
    expect(User.displayName).toBe('User');
  });

  describe('Schema Validations', () => {
    it('should validate email', async () => {
      const user = new User(invalidEmailAttrs);
      const isValid = await user.validateWithSchema();
      const errors = user.schemaErrors;

      const expectError = expect(errors[0]);

      expect(isValid).toBeFalsy();
      expectError.toHaveProperty('dataPath', '.email');
      expectError.toHaveProperty('keyword', 'format');
    });
  });

  describe('save', () => {
    it('should prevent save with invalid schema', async () => {
      const user = new User(invalidEmailAttrs);
      await expect(user.save()).rejects.toEqual(Error('Invalid Object'));
    });
  });
});
