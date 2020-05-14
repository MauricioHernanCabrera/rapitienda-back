const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const ProductSchema = Schema(
  {
    store: {
      type: ObjectId,
      ref: "Stores",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    category: {
      type: ObjectId,
      ref: "Categories",
      required: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Products", ProductSchema);
