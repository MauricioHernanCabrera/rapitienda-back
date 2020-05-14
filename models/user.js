const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const UserSchema = Schema(
  {
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

    resetPasswordToken: { type: String, default: "" },

    resetPasswordExpires: { type: Date, default: Date.now() },

    stores: [
      {
        type: ObjectId,
        ref: "Stores",
        default: [],
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Users", UserSchema);
