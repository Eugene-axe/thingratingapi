module.exports = {
  things: async (category, args, { models }) => {
    return await models.Thing.find({ category: category._id }).sort({ _id: -1 });
  },
  descendants: async (category, args, { models }) => {
    return await models.Category.find({ directAncestor: category._id });
  },
};
