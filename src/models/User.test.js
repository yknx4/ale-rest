import { User } from './index';

test('User', () => {
  expect(User.name).toBe('User');
  expect(User.displayName).toBe('User');
});
