import { config } from "../config/config";
import { Sequelize } from "sequelize-typescript";
import path from "path";

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    dialect: "mysql",
    host: config.db.host,
    port: config.db.port,
    logging: false,
    models: [path.resolve(__dirname, "../models")],
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  },
);

export default sequelize;
