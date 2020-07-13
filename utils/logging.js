const { logger } = require("./logger");
require("express-async-errors");

module.exports = function () {
  process.on("uncaughtException", (ex) => {
    console.log("WE GOT AN UNCAUGHT EXCEPTION");
    logger.error(ex);
    process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    console.log("WE GOT AN UNHANDLED REJECTION");
    logger.error(ex);
    process.exit(1);
  });
};
