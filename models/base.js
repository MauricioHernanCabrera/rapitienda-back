const { Schema, model } = require("mongoose");

const BaseSchema = Schema(
  {
    username: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      index: true,
      uniqueCaseInsensitive: true,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Base", BaseSchema);
