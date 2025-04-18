import { config } from "../config/config";
import { Sequelize } from 'sequelize-typescript';
import path from 'path';

const sequelize = new Sequelize({
  dialect: "mysql",
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  logging: false,
  models: [path.resolve(__dirname, '../models/**/*.model.ts')],
});

export default sequelize;
