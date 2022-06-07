module.exports = {
  things: async (user, args, { models }) => {
    return await models.Thing.find({ author: user._id }).sort({ _id: -1 });
  },
};

