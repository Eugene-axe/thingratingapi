module.exports = {
  // things: async (parent, args, { db }) => {
  //   return await db.things.find({});
  // },
  things: async (parent, args, { models }) => {
    return await models.Thing.find();
  },
  thing: async (parent, args, { models }) => {
    return await models.Thing.findById(args._id);
  },
  users: async (parent, args, { models }) => {
    return await models.User.find();
  },
  user: async (parent, { _id }, { models }) => {
    return await models.User.findById(_id);
  },
  me: async (parent, args, { models, user }) => {
    return await models.User.findById(user.id);
  },
  thingFeed: async (parent, { cursor, category }, { models }) => {
    const limit = 20;
    let hasNextPage = false;
    let cursorQuery = {};
    const categoryQuery = { category: category || "" };
    const publicQuery = { public: true };

    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } };
    }
    let things = await models.Thing.find({
      $and: [categoryQuery, cursorQuery, publicQuery],
    })
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    if (things.length > limit) {
      hasNextPage = true;
      things = things.slice(0, -1);
    }
    let newCursor = things[things.length - 1]._id;
    return { things, cursor: newCursor, hasNextPage };
  },
  myThingFeed: async (parent, { cursor, category }, { models, user }) => {
    const limit = 20;
    let hasNextPage = false;
    const cursorQuery = {};
    const categoryQuery = { category: category || "" };
    const userQuery = { author: { _id: user.id } };

    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } };
    }
    let things = await models.Thing.find({ $and: [categoryQuery, cursorQuery] })
      .find({ $and: [categoryQuery, cursorQuery, userQuery] })
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    if (things.length > limit) {
      hasNextPage = true;
      things = things.slice(0, -1);
    }
    let newCursor = things[things.length - 1]._id;
    return { things, cursor: newCursor, hasNextPage };
  },

  categories: async (parent, args, { models }) => {
    return await models.Category.find({
      $or: [{ directAncestor: args.ancestor }, { _id: args.id }],
    });
  },
  category: async (parent, args, { models }) => {
    // return await models.Category.findOne({
    //   $or: [{ directAncestor: args.ancestor }, { _id: args.id }],
    // });
    return await models.Category.findById(args.id);
  },
};
