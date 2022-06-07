module.exports = {
  things: async (parent, args, { db }) => {
    return await db.things.find({});
  },
  thing: async (parent, args, { db }) => {
    return await db.things.findOne({ _id: args._id });
  },
  users: async (parent, args, { db }) => {
    return await db.users.find({});
  },
  user: async (parent, { _id }, { db }) => {
    return await db.users.findOne({ _id });
  },
  me: async (parent, args, { db, user }) => {
    return await db.users.findOne({ _id: user.id });
  },
  thingFeed: async (parent, { cursor, category }, { db }) => {
    const limit = 20;
    let hasNextPage = false;
    let cursorQuery = {};
    const categoryQuery = { category: category || "" };
    const publicQuery = { public: true };

    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } };
    }
    let things = await db.things
      .find({ $and: [categoryQuery, cursorQuery , publicQuery] })
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    if (things.length > limit) {
      hasNextPage = true;
      things = things.slice(0, -1);
    }
    let newCursor = things[things.length - 1]._id;
    return { things, cursor: newCursor, hasNextPage };
  },
  myThingFeed: async (parent, { cursor, category }, { db, user }) => {
    const limit = 20;
    let hasNextPage = false;
    const cursorQuery = {};
    const categoryQuery = { category: category || "" };
    const userQuery = { 'author.id': user.id };

    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } };
    }
    let things = await db.things
      .find({ $and: [categoryQuery, cursorQuery , userQuery] })
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    if (things.length > limit) {
      hasNextPage = true;
      things = things.slice(0, -1);
    }
    let newCursor = things[things.length - 1]._id;
    return { things, cursor: newCursor, hasNextPage };
  },

  categories: async (parent, args, { db }) => {
    return await db.categories.find({
      $or: [{ directAncestor: args.ancestor }, { _id: args.id }],
    });
  },
  category: async (parent, args, { db }) => {
    return await db.categories.findOne({
      $or: [{ directAncestor: args.ancestor }, { _id: args.id }],
    });
  },
};
