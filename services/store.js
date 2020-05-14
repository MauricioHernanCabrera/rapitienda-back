const { StoreModel } = require("../models");

const boom = require("@hapi/boom");
const mongoose = require("mongoose");

const createOne = ({ filter, data }) => {
  return StoreModel.create(data);
};

const getAll = () => {
  return StoreModel.find({ isActive: true }).select("-products -categories");
};

const getOne = async ({ filter }) => {
  const foundStore = await StoreModel.findOne({
    _id: filter._id,
    isActive: true,
  }).select("-products -categories");

  if (!foundStore) return Promise.reject(boom.notFound("¡No se encontro la tienda!"));

  if (String(foundStore.owner) != String(filter.owner)) return Promise.reject(boom.forbidden("¡No tenes acceso a esta tienda!"));

  return foundStore;
};

const getOnePublic = async ({ filter }) => {
  const foundStore = await StoreModel.findOne({
    _id: filter._id,
    isActive: true,
  }).populate([
    {
      path: "products",
      populate: {
        path: "category",
        select: "isActive _id",
      },
    },
    {
      path: "categories",
      populate: {
        path: "products",
        select: "isActive _id",
      },
    },
  ]);

  if (!foundStore) return Promise.reject(boom.notFound("¡Tienda no encontrada!"));

  const store = foundStore.toJSON();
  return {
    store: {
      ...store,
      products: undefined,
      categories: undefined,
    },
    products: store.products
      .filter((product) => product.isActive && product.category && product.category.isActive)
      .map((product) => ({ ...product, category: product._id })),
    categories: store.categories
      .filter((category) => {
        const filteredProducts = category.products.filter((product) => product && product.isActive);
        return category.isActive && filteredProducts.length >= 1;
      })
      .map((category) => ({ ...category, products: undefined })),
  };
};

const updateOne = async ({ filter, data }) => {
  await getOne({ filter });

  return StoreModel.findOneAndUpdate(filter, data, {
    new: true,
    runValidators: true,
    context: "query",
  });
};

const getStoreCategories = async ({ filter }) => {
  const foundStore = await StoreModel.findOne({
    _id: filter._id,
    isActive: true,
  }).populate({
    path: "categories",
    select: "_id name isPublished createdAt updatedAt isActive",
  });

  if (!foundStore) return Promise.reject(boom.notFound("¡No se encontro la tienda!"));

  if (String(foundStore.owner) != String(filter.owner)) return Promise.reject(boom.forbidden("¡No tenes acceso a esta tienda!"));

  return foundStore.categories.filter((category) => category.isActive);
};

const getStoreProducts = async ({ filter }) => {
  const foundStore = await StoreModel.findOne({
    _id: filter._id,
    isActive: true,
  }).populate("products");

  if (!foundStore) return Promise.reject(boom.notFound("¡No se encontro la tienda!"));

  if (String(foundStore.owner) != String(filter.owner)) return Promise.reject(boom.forbidden("¡No tenes acceso a esta tienda!"));

  return foundStore.products.filter((product) => product.isActive);
};

module.exports = {
  createOne,
  getAll,
  getOne,
  updateOne,
  getOnePublic,
  getStoreCategories,
  getStoreProducts,
};
