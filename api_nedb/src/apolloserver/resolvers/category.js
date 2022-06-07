module.exports = {
  things: async (category, args, { db }) => {
    return await db.things.find({ category: category._id }).sort({ _id: -1 });
  },
  descendants: async (category, args, { db }) => {
    return await db.categories.find({ directAncestor: category._id });
  },
};
