import { Sequelize } from "sequelize-typescript";
// import { User } from "../models/User"; // Adicione seus modelos aqui
import { config } from "../config/config";

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
//   models: [User],
  logging: false,
});
