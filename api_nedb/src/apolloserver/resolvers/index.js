const Query = require("./query");
const Mutation = require("./mutation");
const User = require("./user");
const Thing = require("./thing");
const Category = require("./category");

const { GraphQLDateTime } = require("graphql-iso-date");

module.exports = {
  Query,
  Mutation,
  User,
  Thing,
  Category,
  DateTime: GraphQLDateTime,
};
