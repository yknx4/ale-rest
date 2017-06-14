import { libState } from './store';

describe('store', () => {
  it('should throw an error on an unexistent key', () => {
    const fail = () => {
      const invalid = libState.somethingwrong; // eslint-disable-line no-unused-vars
    };
    expect(fail).toThrow();
  });

  it('should be false when setting something existant', () => {
    const falsey = () => {
      libState.s = 's';
      libState.s = 's';
    };
    expect(falsey).toThrow();
  });

  it('should ignore getting with non string', () => {
    const anyfn = () => {
      const any = libState[4]; // eslint-disable-line no-unused-vars
    };
    expect(anyfn).toThrow();
  });
});
