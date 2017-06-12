import {
  asFn,
  camelKey,
  getDescription,
  // getOutputFromInstance,
  pluralKey,
  // resolveCollection,
  // resolveSingleElement
} from './selectors';
import '../../../models';
import { exec } from 'shelljs'; // eslint-disable-line
import { utils, models } from 'ale-persistence'; // eslint-disable-line

// const { User } = models;
// const { test: { create } } = utils;

describe('selectors', () => {
  // const name = "awesome name";
  // const data = {
  //   attributes: {
  //     firstName: name
  //   }
  // };
  // const meta = {
  //   fieldName: "firstName"
  // };

  // describe("getOutputFromInstance", () => {
  //   it("should get the appropiate field based on meta fieldName", () => {
  //     const output = getOutputFromInstance(data, null, null, meta);
  //     expect(output).toEqual(name);
  //   });
  // });

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

  // describe("resolveSingleElement", () => {
  //   let resolved;
  //   beforeEach(async () => {
  //     resolved = await create("User");
  //   });
  //   it("should find model by id", async () => {
  //     console.log(resolved);
  //     await resolveSingleElement("User")(null, { id: resolved.id });
  //   });
  // });

  describe('asFn', () => {
    it('shoudl return a function that returns the input', () => {
      const input = {};
      const fn = asFn(input);
      expect(fn()).toBe(input);
    });
  });

  // describe("resolveCollection", () => {
  //   let resolved;
  //   let count;
  //   beforeAll(async () => {
  //     await create("User");
  //     count = await User.count();
  //     resolved = await resolveCollection("User")(null, {});
  //   });
  //   it("should get the collection of Model (User)", () => {
  //     expect(resolved.length).toEqual(parseInt(count, 10));
  //   });
  // });
});
