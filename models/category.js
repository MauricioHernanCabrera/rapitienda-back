const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const CategorySchema = Schema(
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

    products: [
      {
        type: ObjectId,
        ref: "Products",
        default: [],
      },
    ],

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

module.exports = model("Categories", CategorySchema);
