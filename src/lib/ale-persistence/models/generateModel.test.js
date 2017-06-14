import { Model } from 'objection';
import generateModel from './generateModel';
import { libState } from '../store';

const { knex } = libState;

const schema = {
  title: 'User',
  type: 'object',
  tableName: 'users-ale-persistence-test',
  properties: {
    id: {
      $ref: '#/definitions/positiveInt',
    },
    name: {
      'x-faker': 'name.findName',
      type: 'string',
    },
    email: {
      'x-faker': 'internet.email',
      type: 'string',
      format: 'email',
    },
    created_at: {
      type: 'string',
      format: 'date-time',
    },
    updated_at: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['name', 'email'],
  definitions: {
    positiveInt: {
      type: 'integer',
      minimum: 0,
      maximum: 65536,
      exclusiveMinimum: true,
    },
  },
  'x-relationships': {
    todos: {
      relation: 'HasOneRelation',
      modelClass: 'Todo',
      join: {
        from: 'users-ale-persistence-test.id',
        to: 'todos-ale-persistence-test.user_id',
      },
    },
  },
};

const todoSchema = {
  title: 'Todo',
  type: 'object',
  tableName: 'todos-ale-persistence-test',
  properties: {
    id: {
      $ref: '#/definitions/positiveInt',
    },
    user_id: {
      type: 'integer',
    },
    text: {
      'x-faker': 'lorem.word',
      type: 'string',
    },
  },
  required: ['text', 'user_id'],
  definitions: {
    positiveInt: {
      type: 'integer',
      minimum: 0,
      maximum: 65536,
      exclusiveMinimum: true,
    },
  },
};

describe('generateModel', () => {
  beforeEach(async () => {
    await knex.schema.createTableIfNotExists(schema.tableName, table => {
      table.increments();
      table.string('name');
      table.string('email');
      table.timestamps();
    });
    await knex.schema.createTableIfNotExists(todoSchema.tableName, table => {
      table.increments();
      table.string('text');
      table.integer('user_id');
      table.timestamps();
    });
  });
  const TodoModel = generateModel(todoSchema);
  const UserModel = generateModel(schema);
  it('should create a model that inherits from Model', () => {
    expect(new UserModel()).toBeInstanceOf(Model);
    expect(new UserModel()).toBeInstanceOf(UserModel);
  });

  describe('relationships', () => {
    it('should shave relationships defned', () => {
      expect(UserModel.relationMappings).toBeDefined();
    });

    it('should enable relationship queries', async () => {
      const user = await UserModel.test.create();
      await TodoModel.test.create({ user_id: user.id });
      await TodoModel.test.create({ user_id: user.id });
      const relationQuery = await user.$relatedQuery('todos');
      expect(relationQuery.every(r => r instanceof TodoModel)).toBeTruthy();
      expect(relationQuery.length).toEqual(2);
    });
  });

  describe('test', () => {
    describe('build', () => {
      it('should return a mocked object', () => {
        const built = UserModel.test.build();
        expect(built).toHaveProperty('email');
        expect(built).toHaveProperty('name');
      });
    });
    describe('create', async () => {
      const insertResult = await UserModel.test.create().then(result => result);
      expect(insertResult).toHaveProperty('id');
      expect(insertResult).toHaveProperty('created_at');
      expect(insertResult).toHaveProperty('updated_at');
      expect(insertResult).toHaveProperty('email');
      expect(insertResult).toHaveProperty('name');
    });
  });
});
