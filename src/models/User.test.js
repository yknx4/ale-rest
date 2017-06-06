import { User } from './index';

const requiredFields = {
  first_name: 'first',
  last_name: 'last',
};

describe('User', () => {
  test('Model', () => {
    expect(User.name).toBe('User');
    expect(User.displayName).toBe('User');
  });

  describe('Schema Validations', () => {
    it('should validate email', async () => {
      const user = new User({ ...requiredFields, email: 'invalidemail' });
      const isValid = await user.validateWithSchema();
      const errors = user.schemaErrors;

      const expectError = expect(errors[0]);

      expect(isValid).toBeFalsy();
      expectError.toHaveProperty('dataPath', '.email');
      expectError.toHaveProperty('keyword', 'format');
    });
  });
});
