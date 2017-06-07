import {
  getOutputFromInstance,
  instanceToResult,
  getDescription,
  camelKey,
  pluralKey,
  resolveSingleElement,
} from './selectors';

describe('selectors', () => {
  const name = 'awesome name';
  const data = {
    attributes: {
      first_name: name,
    },
  };
  const expectedOutput = {
    firstName: name,
  };
  const meta = {
    fieldName: 'firstName',
  };

  describe('instanceToResult', () => {
    it('converts attributes map to camelCase', () => {
      expect(instanceToResult(data)).toEqual(expectedOutput);
    });
  });

  describe('getOutputFromInstance', () => {
    it('should get the appropiate field based on meta fieldName', () => {
      const output = getOutputFromInstance(data, null, null, meta);
      expect(output).toEqual(name);
    });
  });

  describe('getDescription', () => {
    it('should get description if available', () => {
      expect(getDescription('d')).toEqual('d');
    });

    it('should get Missing Description if unavailable', () => {
      expect(getDescription()).toEqual('Missing Description');
    });
  });

  describe('camelKey', () => {
    it('should convert key (second param) to camelKey', () => {
      expect(camelKey(null, 'first_name')).toEqual('firstName');
    });
  });

  describe('pluralKey', () => {
    it('should pluralize key (second param)', () => {
      expect(pluralKey(null, 'user')).toEqual('users');
    });
  });

  describe('resolveSingleElement', () => {
    const finder = jest.fn();
    const model = { findById: finder };
    const models = { Model: model };
    it('should find model by id', () => {
      resolveSingleElement(models, 'Model')(null, { id: 1 });
      expect(finder).toHaveBeenCalledWith(1);
    });
  });
});
