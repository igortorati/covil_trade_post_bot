require('ts-node').register();
const config = require('./src/config/config').config;

module.exports = {
  development: {
    dialect: 'mysql',
    host: config.db.host,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    logging: false,
    models: [__dirname + '/src/models'],
    migrationStorageTableName: 'sequelize_meta'
  },
};
