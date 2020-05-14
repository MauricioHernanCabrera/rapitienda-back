const express = require("express");
const router = express();

const { BaseService } = require("./../services");

const {
  validationMiddleware,
} = require("./../utils/middlewares/validationHandler");
const { BaseSchema, ModuleSchema } = require("./../schemas");
const { isRole, ADMIN, CUSTOMER } = require("./../utils/middlewares/role");
const passport = require("passport");
require("./../utils/auth/strategies/jwt");

// const loadFileInBody = require("./../utils/middlewares/loadFileInBody");

// const multer = require("multer");

// const uploadHome = multer({
//   storage: multer.diskStorage({
//     destination: function(req, file, cb) {
//       cb(null, "./public/home");
//     },
//     filename: function(req, file, cb) {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     }
//   }),
//   limits: {
//     fileSize: 1024 * 1024 * 100
//   }
// });

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  isRole([]),
  async function (req, res, next) {
    try {
      const data = await BaseService.getAll();

      res.status(200).json({
        data,
        message: "¡Items recuperadas!",
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/",
  validationMiddleware(ModuleSchema.createOne),
  passport.authenticate("jwt", { session: false }),
  isRole([]),
  async function (req, res, next) {
    try {
      const data = await BaseService.createOne({ data: req.body });

      res.status(201).json({
        data,
        message: "¡Item creado!",
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
  isRole([]),
  async function (req, res, next) {
    try {
      const { _id } = req.params;
      const data = await BaseService.getOne({ filter: { _id } });

      res.status(200).json({
        data,
        message: "¡Item recuperado!",
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
  isRole([]),
  validationMiddleware(ModuleSchema.updateOne),
  async function (req, res, next) {
    try {
      const { _id } = req.params;
      const data = await BaseService.updateOne({
        filter: { _id },
        data: req.body,
      });

      res.status(200).json({
        data,
        message: "¡Item actualizado!",
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
  isRole([]),
  async function (req, res, next) {
    try {
      const { _id } = req.params;
      const data = await BaseService.deleteOne({ filter: { _id } });

      res.status(200).json({
        data,
        message: "¡Item eliminado!",
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
