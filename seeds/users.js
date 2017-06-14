const init = require("../build/lib/ale-persistence/init").default;
const aKnexCleaner = require("knex-cleaner");
const { times } = require("lodash");

exports.seed = async function(knex, Promise) {
  await aKnexCleaner.clean(knex, {
    mode: "truncate",
    ignoreTables: ["knex_migrations", "knex_migrations_lock"]
  });
  // Deletes ALL existing entries
  init(knex);
  const { User, Post } = require("../build/models").default;
  const insertions = times(100, async () => {
    const user = User.test.build();
    user.posts = times(20, () => Post.test.build());
    return await User.query().insertGraph(user).then(i => i);
  });
  await Promise.all(insertions);
};

// Person.query().insertGraph({
//   firstName: "Sylvester",
//   lastName: "Stallone",

//   children: [
//     {
//       firstName: "Sage",
//       lastName: "Stallone",

//       pets: [
//         {
//           name: "Fluffy",
//           species: "dog"
//         }
//       ]
//     }
//   ]
// });
