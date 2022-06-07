const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require('./db');
const models = require('./models');
const typeDefs = require("./apolloserver/schema");
const resolvers = require("./apolloserver/resolvers");
const helmet = require("helmet");
const cors = require('cors');

const app = express();
app.use(helmet());
app.use(cors());


const getUser = (token) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      new Error("Session valied | Token very difficult");
    }
  }
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization;
    const user = getUser(token);
    return { models, user };
  },
});
server.applyMiddleware({ app, path: "/api" });

app.get("/", (req, res) => res.send("Hello world"));
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;
db.connect(DB_HOST);
app.listen({ port }, () =>
  console.log(`Graph QL Serever listening to port ${port}`)
);
