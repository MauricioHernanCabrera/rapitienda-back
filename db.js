const config = require("./config");
const mongoose = require("mongoose");

const initDB = () => {
  let mongoConfig = {};
  let mongoUri = "";

  if (config.db.hasAuth) {
    mongoUri = `mongodb://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}?authSource=admin`; // prettier-ignore
    mongoConfig = {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      authMechanism: "SCRAM-SHA-1",
    };
  } else {
    mongoUri = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`; // prettier-ignore
    mongoConfig = {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    };
  }

  mongoose.set("useCreateIndex", true);
  return mongoose.connect(mongoUri, mongoConfig);
};

module.exports = initDB;
