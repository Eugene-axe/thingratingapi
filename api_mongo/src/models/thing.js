const mongoose = require("mongoose");

const thingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    image: { type: String },
    category: [{ type: String }],
    public: { type: Boolean },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Thing = mongoose.model("Thing", thingSchema);

module.exports = Thing;
