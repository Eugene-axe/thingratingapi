const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  AuthenticationError,
  ForbiddenError,
} = require("apollo-server-express");
require("dotenv").config();

module.exports = {
  newThing: async (
    parent,
    { description, rating, title, image, category, public = true },
    { db, user }
  ) => {
    const thing = {
      title,
      description,
      rating,
      category,
      public,
      image: image,
      author: user,
    };
    const response = await db.things.insert(thing);
    return response;
  },
  deleteThing: async (parent, { id }, { db, user }) => {
    if (!user) {
      throw new AuthenticationError("You must be signed in to delete thing");
    }
    const thing = await db.things.findOne({ _id: id });
    try {
      if (user.id !== thing.author.id)
        throw new Error("You can delete only self Things");
      await db.things.remove({ _id: id }, { multi: true });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  updateThing: async (parent, args, { db, user }) => {
    if (!user) {
      throw new AuthenticationError("You must be signed in to update thing");
    }
    const thing = await db.things.findOne({ _id: args.id });
    if (user.id !== thing.author.id) {
      console.log(user._id !== thing.author.id);
      throw new Error("You can edit only self Things");
    }

    return db.things.update(
      { _id: args.id },
      {
        $set: args,
      },
      { multi: false, returnUpdatedDocs: true }
    );
  },
  signUp: async (parent, { username, password, name }, { db }) => {
    const hashed = await bcrypt.hash(password, 10);
    try {
      const user = await db.users.insert({ name, username, password: hashed });
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error("Error creating account");
    }
  },
  signIn: async (parent, { username, password }, { db }) => {
    const user = await db.users.findOne({ username });
    if (!user)
      throw new AuthenticationError(
        "Error sign in! С таким именем пользователя нет"
      );
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      throw new AuthenticationError(
        "Error sign in! Username + password != friend"
      );
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },
  newCategory: async (parent, args, { db }) => {
    const ancestorId = args.ancestor || "";
    const catAncestor = await db.categories.findOne({ _id: ancestorId });
    const ancestorsList = catAncestor?.ancestors || [];
    const category = {
      title: args.title,
      directAncestor: ancestorId,
      ancestors: [...ancestorsList, ancestorId],
      descendants: [],
      things: [],
    };
    const response = await db.categories.insert(category);
    return response;
  },
  updateCategory: async (parent, args, { db }) => {
    return db.categories.update(
      { _id: args._id },
      {
        $set: args,
      },
      { multi: false, returnUpdatedDocs: true }
    );
  },
  deleteCategory: async (parent, { _id }, { db }) => {
    try {
      await db.categories.remove({ _id }, { multi: true });
      return true;
    } catch (err) {
      return false;
    }
  },
};
