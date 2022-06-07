const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar DateTime
  type Thing {
    _id: ID!
    title: String!
    description: String!
    rating: Int
    image: String
    category: [ID]
    author: User!
    public: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  type User {
    _id: ID!
    username: String!
    things: [Thing!]!
    name: String!
  }
  type Category {
    _id: ID!
    title: String!
    things: [Thing!]!
    directAncestor: ID!
    ancestors: [ID!]
    descendants: [Category]
  }
  type ThingFeed {
    things: [Thing!]!
    cursor: String
    hasNextPage: Boolean!
  }
  type Query {
    things: [Thing!]!
    thing(_id: ID!): Thing!
    users: [User!]!
    user(_id: ID!): User!
    me: User!
    thingFeed(cursor: String, category: ID): ThingFeed
    myThingFeed(cursor: String, category: ID): ThingFeed
    category(id: ID, ancestor: ID): Category!
    categories(id: ID, ancestor: ID): [Category!]!
  }
  type Mutation {
    newThing(
      description: String
      rating: Int
      title: String
      image: String
      public: Boolean
      category: [ID]
    ): Thing!
    updateThing(
      id: ID!
      rating: Int
      title: String
      description: String
      category: [ID]
      public: Boolean
      image: String
    ): Thing!
    deleteThing(id: ID!): Boolean
    signUp(username: String!, password: String!, name: String!): String!
    signIn(username: String!, password: String!): String!
    newCategory(title: String!, ancestor: ID): Category!
    updateCategory(_id: ID!, title: String!): Category!
    deleteCategory(_id: ID!): Boolean
  }
`;
