
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('first_name');
    table.string('last_name');
    table.string('username');
    table.string('email');
    table.unique('email');
    table.unique('username');
    table.index('first_name');
    table.index('last_name');
    table.index(['first_name', 'last_name']);
    table.timestamp('deleted_at');
    table.timestamps();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
};
