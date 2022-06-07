module.exports = {
  author: async (thing, args, { db }) => {
    return await db.users.findOne({ _id: thing.author.id });
  },
};
