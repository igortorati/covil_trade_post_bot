import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // Tabela de temporadas
    await queryInterface.createTable('seasons', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      version: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      is_current: { type: DataTypes.BOOLEAN, defaultValue: false },
    });

    // Tabela de itens base (todos do sistema, ex: 5eTools)
    await queryInterface.createTable('items', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      rarity: { type: DataTypes.STRING(50), allowNull: false },
      source: { type: DataTypes.STRING(50) },
      description: { type: DataTypes.STRING(1000) },
      category: {
        type: DataTypes.ENUM('item', 'upgrade'),
        allowNull: false,
      },
    });

    // Tabela de itens disponíveis para troca ou compra
    await queryInterface.createTable('available_items', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'items', key: 'id' },
        onDelete: 'CASCADE',
      },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      can_trade: { type: DataTypes.BOOLEAN, defaultValue: false },
      season_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'seasons', key: 'id' },
        onDelete: 'CASCADE',
      },
    });

    // Tabela de personagens
    await queryInterface.createTable('characters', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      discord_id: { type: DataTypes.STRING(100), allowNull: false },
    });

    // Tabela de status
    await queryInterface.createTable('statuses', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    });

    // Tabela de requisições de troca
    await queryInterface.createTable('trade_requests', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      character_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'characters', key: 'id' },
        onDelete: 'CASCADE',
      },
      item_desired_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'items', key: 'id' },
      },
      item_offered_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'items', key: 'id' },
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'statuses', key: 'id' },
      },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    // Tabela de requisições de compra
    await queryInterface.createTable('purchase_requests', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      character_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'characters', key: 'id' },
        onDelete: 'CASCADE',
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'items', key: 'id' },
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'statuses', key: 'id' },
      },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    // Tabela de logs
    await queryInterface.createTable('logs', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      route: { type: DataTypes.STRING(1000) },
      method: { type: DataTypes.STRING(10) },
      query: { type: DataTypes.STRING(1000) },
      error_message: { type: DataTypes.STRING(1000) },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    // Inserir status padrões
    await queryInterface.bulkInsert('statuses', [
      { name: 'pending' },
      { name: 'approved' },
      { name: 'rejected' },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('logs');
    await queryInterface.dropTable('purchase_requests');
    await queryInterface.dropTable('trade_requests');
    await queryInterface.dropTable('statuses');
    await queryInterface.dropTable('characters');
    await queryInterface.dropTable('available_items');
    await queryInterface.dropTable('items');
    await queryInterface.dropTable('seasons');
  },
};
