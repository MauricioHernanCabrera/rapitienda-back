const express = require("express");
const router = express();

const { ProductService } = require("../services");

const {
  validationMiddleware,
} = require("../utils/middlewares/validationHandler");
const { BaseSchema, ProductSchema } = require("../schemas");
const passport = require("passport");
require("../utils/auth/strategies/jwt");
const loadFileInBody = require("./../utils/middlewares/loadFileInBody");

const multer = require("multer");

const uploadProduct = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/products");
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  uploadProduct.single("image"),
  loadFileInBody("imageUrl"),
  validationMiddleware(ProductSchema.createOne),
  async function (req, res, next) {
    try {
      const data = await ProductService.createOne({
        data: req.body,
        filter: { owner: req.user._id },
      });

      res.status(201).json({
        data,
        message: "¡Producto creado!",
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:_id/",
  validationMiddleware({ _id: BaseSchema.id.required() }, "params"),
  passport.authenticate("jwt", { session: false }),
  async function (req, res, next) {
    try {
      const { _id } = req.params;
      const data = await ProductService.getOne({
        filter: { _id, owner: req.user._id },
      });

      res.status(200).json({
        data,
        message: "¡Producto recuperado!",
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
  uploadProduct.single("image"),
  loadFileInBody("imageUrl"),
  validationMiddleware(ProductSchema.updateOne),
  async function (req, res, next) {
    try {
      const { _id } = req.params;
      const data = await ProductService.updateOne({
        filter: { _id, owner: req.user._id },
        data: req.body,
      });

      res.status(200).json({
        data,
        message: "¡Producto actualizado!",
      });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:_id/",
  validationMiddleware({ _id: BaseSchema.id.required() }, "params"),
  passport.authenticate("jwt", { session: false }),
  async function (req, res, next) {
    try {
      const { _id } = req.params;
      const data = await ProductService.deleteOne({
        filter: { _id, owner: req.user._id },
      });

      res.status(200).json({
        data,
        message: "¡Producto eliminado!",
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
