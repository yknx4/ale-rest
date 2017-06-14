exports.up = function(knex, Promise) {
  return knex.schema.createTable("posts", function(table) {
    table.bigIncrements();
    table.string("title").unique();
    table.text("content");
    table.text("description");
    table.string("legacy_permalink");
    table.timestamps();
    table.timestamp("deleted_at");

    table.bigInteger("user_id").unsigned();
    table.foreign("user_id").references("users.id");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("posts");
};
