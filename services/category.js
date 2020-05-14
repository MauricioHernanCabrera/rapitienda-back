const { CategoryModel, StoreModel } = require("../models");

const boom = require("@hapi/boom");

const createOne = async ({ filter, data }) => {
  const foundStore = await StoreModel.findOne({ _id: data.store });
  if (!foundStore)
    return Promise.reject(boom.notFound("¡No se encontro la tienda!"));
  if (String(foundStore.owner) != String(filter.owner))
    return Promise.reject(
      boom.forbidden("¡No podes cargar categorias en tiendas que no son tuyas!")
    );

  const createdCategory = await CategoryModel.create(data);
  foundStore.categories.push(createdCategory._id);

  await foundStore.save();
  return createdCategory;
};

const getOne = async ({ filter }) => {
  const foundCategory = await CategoryModel.findOne({
    _id: filter._id,
    isActive: true,
  }).populate({
    path: "store",
    select: "_id name owner",
  });

  if (!foundCategory)
    return Promise.reject(boom.notFound("¡No se encontro la categoria!"));

  if (String(foundCategory.store.owner) != String(filter.owner))
    return Promise.reject(
      boom.forbidden(
        "¡No podes obtener categorias de tiendas que no son tuyas!"
      )
    );

  const category = foundCategory.toJSON();

  return {
    ...category,
    store: undefined,
  };
};

const updateOne = async ({ filter, data }) => {
  await getOne({ filter });

  const updatedCategory = await CategoryModel.findOneAndUpdate(
    { _id: filter._id },
    data,
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );

  const category = updatedCategory.toJSON();

  return {
    ...category,
    products: undefined,
    store: undefined,
  };
};

const deleteOne = async ({ filter }) => {
  await getOne({ filter });

  return CategoryModel.findOneAndUpdate(
    { _id: filter._id },
    { isActive: false },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );
};

module.exports = {
  createOne,
  getOne,
  updateOne,
  deleteOne,
};
