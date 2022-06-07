const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  AuthenticationError,
  ForbiddenError,
} = require("apollo-server-express");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

module.exports = {
  newThing: async (
    parent,
    { description, rating, title, image, category, public = true },
    { models, user }
  ) => {
    const thing = {
      title,
      description,
      rating,
      category,
      public,
      image,
      author: mongoose.Types.ObjectId(user.id),
    };
    console.log("thing2", thing);
    const response = await models.Thing.create(thing);
    return response;
  },
  deleteThing: async (parent, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError("You must be signed in to delete thing");
    }
    const thing = await models.Thing.findById(id);
    try {
      if (user.id !== String(thing.author._id)) {
        throw new Error("You can delete only self Things");
      }
      await models.Thing.findOneAndRemove({ _id: id }, { multi: true });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  updateThing: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError("You must be signed in to update thing");
    }
    const thing = await models.Thing.findById(args.id);
    if (user.id !== String(thing.author._id)) {
      throw new Error("You can edit only self Things");
    }
    return await models.Thing.findOneAndUpdate(
      { _id: args.id },
      {
        $set: args,
      },
      { new: true }
    );
  },
  signUp: async (parent, { username, password, name }, { models }) => {
    const hashed = await bcrypt.hash(password, 10);
    try {
      const user = await models.User.create({
        name,
        username,
        password: hashed,
      });
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error("Error creating account");
    }
  },
  signIn: async (parent, { username, password }, { models }) => {
    const user = await models.User.findOne({ username });
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

  newCategory: async (parent, args, { models }) => {
    const ancestorId = args.directAncestor || "";
    const catAncestor =
      ancestorId && (await models.Category.findOne({ _id: ancestorId }));
    const ancestorsList = catAncestor?.ancestors || [];
    const category = {
      title: args.title,
      directAncestor: ancestorId,
      ancestors: [...ancestorsList, ancestorId],
    };
    const response = await models.Category.create(category);
    return response;
  },
  updateCategory: async (parent, args, { models }) => {
    return models.Category.updateOne(
      { _id: args._id },
      {
        $set: args,
      },
      { multi: false, returnUpdatedDocs: true }
    );
  },
  deleteCategory: async (parent, { _id }, { models }) => {
    try {
      await models.Category.remove({ _id }, { multi: true });
      return true;
    } catch (err) {
      return false;
    }
  },
};
