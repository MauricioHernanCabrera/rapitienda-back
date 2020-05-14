const { initDB } = require("./../../utils/db");
const { CustomerService, TermService } = require("./../../services");

(async function () {
  try {
    await initDB();
  } catch (error) {
    console.log(error);
  } finally {
    return process.exit(0);
  }
})();
