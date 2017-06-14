const init = require("../build/lib/ale-persistence/init").default;
const { build } = require("../build/lib/ale-persistence/utils/testUtils");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  init(knex);
  const { User } = require("../build/models").default;
  return knex("users").del().then(() => {
    // Inserts seed entries
    const data = [];
    for (let index = 0; index < 200; index++) {
      data.push(build(User));
    }
    return knex("users").insert(data);
  });
};
