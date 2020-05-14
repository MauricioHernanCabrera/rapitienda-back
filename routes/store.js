const express = require("express");
const router = express();

const { StoreService } = require("../services");

const {
  validationMiddleware,
} = require("../utils/middlewares/validationHandler");
const { BaseSchema, StoreSchema } = require("./../schemas");
const passport = require("passport");
require("../utils/auth/strategies/jwt");

const loadFileInBody = require("./../utils/middlewares/loadFileInBody");

const multer = require("multer");

const uploadStore = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/stores");
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
});

router.get("/", async function (req, res, next) {
  try {
    const data = await StoreService.getAll();

    res.status(200).json({
      data,
      message: "¡Tiendas recuperadas!",
    });
  } catch (err) {
    next(err);
  }
});

router.get(
  "/:_id/public",
  validationMiddleware({ _id: BaseSchema.id.required() }, "params"),
  async function (req, res, next) {
    try {
      const { _id } = req.params;
      const data = await StoreService.getOnePublic({ filter: { _id } });

      res.status(200).json({
        data,
        message: "¡Tienda recuperada!",
      });
    } catch (err) {
      next(err);
    }
  }
);

// privates

router.get(
  "/:_id/",
  validationMiddleware({ _id: BaseSchema.id.required() }, "params"),
  passport.authenticate("jwt", { session: false }),
  async function (req, res, next) {
    try {
      const { _id } = req.params;

      const data = await StoreService.getOne({
        filter: { _id, owner: req.user._id },
      });

      res.status(200).json({
        data,
        message: "¡Tienda recuperada!",
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:_id/categories",
  validationMiddleware({ _id: BaseSchema.id.required() }, "params"),
  passport.authenticate("jwt", { session: false }),
  async function (req, res, next) {
    try {
      const { _id } = req.params;
      const data = await StoreService.getStoreCategories({
        filter: { _id, owner: req.user._id },
      });

      res.status(200).json({
        data,
        message: "¡Categorias de la tienda recuperada!",
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:_id/products",
  validationMiddleware({ _id: BaseSchema.id.required() }, "params"),
  passport.authenticate("jwt", { session: false }),
  async function (req, res, next) {
    try {
      const { _id } = req.params;
      const data = await StoreService.getStoreProducts({
        filter: { _id, owner: req.user._id },
      });

      res.status(200).json({
        data,
        message: "¡Productos de la tienda recuperada!",
      });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/:_id/",
  validationMiddleware({ _id: BaseSchema.id.required() }, "params"),
  passport.authenticate("jwt", { session: false }),
  uploadStore.single("image"),
  loadFileInBody("imageUrl"),
  validationMiddleware(StoreSchema.updateOne),
  async function (req, res, next) {
    try {
      const { _id } = req.params;
      const data = await StoreService.updateOne({
        filter: { _id, owner: req.user._id },
        data: req.body,
      });

      res.status(200).json({
        data,
        message: "¡Tienda actualizada!",
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
