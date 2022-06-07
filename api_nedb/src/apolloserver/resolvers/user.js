module.exports = {
  things: async (user, args, { db }) => {
    return await db.things.find({ author: user._id }).sort({ _id: -1 });
  },
};

