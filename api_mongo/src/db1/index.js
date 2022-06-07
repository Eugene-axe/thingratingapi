const DataStore = require("nedb-promises");
require("dotenv").config();
const db_store = process.env.DB_STORE || "./db/store/default.db";

const things = DataStore.create({
  filename: db_store + `things.db`,
  timestampData: true,
});
things.ensureIndex({ fieldName: "title", unique: true });

const users = DataStore.create({
  filename: db_store + `users.db`,
});

const categories = DataStore.create({
  filename: db_store + `categories.db`,
});
users.ensureIndex({ fieldName: "username", unique: true });

module.exports = {
  things,
  users,
  categories,
};
