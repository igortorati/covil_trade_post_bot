import { config } from "../config/config";
import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
  dialect: "mysql",
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  logging: false,
});

export default sequelize;
