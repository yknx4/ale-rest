import '~/config/knex'; // eslint-disable-line

import {
  asFn,
  camelKey,
  getDescription,
  getOutputFromInstance,
  instanceToResult,
  pluralKey,
  resolveCollection,
  resolveSingleElement,
} from './selectors';

import { User } from '~/models'; // eslint-disable-line
import { exec } from 'shelljs'; // eslint-disable-line
import { utils } from '~/lib/ale-persistence'; // eslint-disable-line

const { test: { create } } = utils;

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
    const where = jest.fn();
    const fetchAll = jest.fn();
    fetchAll.mockReturnValue(Promise.resolve([{}]));
    where.mockReturnValue({ fetchAll });
    const model = { where, schema: { primaryKey: 'id', title: 'Model' } };
    const models = { Model: model };
    it('should find model by id', async () => {
      await resolveSingleElement(models, 'Model')(null, { id: 1 });
      expect(where).toHaveBeenCalledWith('id', 'IN', [1]);
      expect(fetchAll).toHaveBeenCalled();
    });
  });

  describe('asFn', () => {
    it('shoudl return a function that returns the input', () => {
      const input = {};
      const fn = asFn(input);
      expect(fn()).toBe(input);
    });
  });

  describe('resolveCollection', () => {
    let resolved;
    let count;
    beforeAll(async () => {
      await create(User);
      count = await User.count();
      resolved = await resolveCollection({ a: User }, 'a')(null, {});
    });
    it('should get the collection of Model (User)', () => {
      expect(resolved.length).toEqual(parseInt(count, 10));
    });
  });
});
