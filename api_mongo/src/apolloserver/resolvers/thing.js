module.exports = {
  author: async (thing, args, { models }) => {
    return await models.User.findById(thing.author);
  },
};
