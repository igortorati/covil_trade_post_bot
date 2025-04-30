require("ts-node").register();
const fs = require("fs");
const path = require("path");
const config = require("./src/config/config").config;

module.exports = {
  development: {
    dialect: "mysql",
    host: config.db.host,
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    logging: false,
    models: [path.resolve(__dirname, "src", "models")],
    migrationStorageTableName: "sequelize_meta",
  },
};
