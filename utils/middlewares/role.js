const boom = require("@hapi/boom");

const isRole = (roles = []) => (req, res, next) => {
  const rolesName = {
    admin: "admin",
    customer: "cliente",
  };
  if (req.user && !roles.includes(req.user.role)) {
    const str = roles
      .reduce((acum, act) => `${rolesName[act]} o ${acum}`, "")
      .slice(0, -3);
    next(boom.unauthorized(`¡Necesitas ser ${str} para ejecutar esta accion!`));
  } else {
    next();
  }
};

const ADMIN = "admin";

const CUSTOMER = "customer";

module.exports = {
  isRole,
  ADMIN,
  CUSTOMER,
};
