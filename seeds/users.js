const { build } = require('../build/lib/ale-persistence/utils/testUtils');
const { User } = require('../build/models');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      // Inserts seed entries
      return knex('users').insert([
        build(User),
        build(User),
        build(User),
        build(User),
        build(User)
      ]);
    });
};
