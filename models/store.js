const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const StoreSchema = Schema(
  {
    owner: {
      type: ObjectId,
      ref: "Gecos",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    schedule: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    facebook: {
      type: String,
      default: "",
    },

    instagram: {
      type: String,
      default: "",
    },

    twitter: {
      type: String,
      default: "",
    },

    shippingPrice: {
      type: Number,
      default: 0,
    },

    categories: [
      {
        type: ObjectId,
        ref: "Categories",
        default: [],
      },
    ],

    products: [
      {
        type: ObjectId,
        ref: "Products",
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

module.exports = model("Stores", StoreSchema);
