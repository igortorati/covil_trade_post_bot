import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // Tabela de temporadas
    await queryInterface.createTable("seasons", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      season: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      is_current: { type: DataTypes.BOOLEAN, defaultValue: false },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });

    // Tabela de sources (livros)
    await queryInterface.createTable("sources", {
      source: { type: DataTypes.STRING(10), primaryKey: true },
      name: { type: DataTypes.STRING(150), allowNull: false },
      published: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      author: { type: DataTypes.STRING(150) },
    });

    // Tabela de raridades
    await queryInterface.createTable("rarities", {
      id: { type: DataTypes.STRING(20), primaryKey: true },
      name_pt: { type: DataTypes.STRING(20), allowNull: false },
      priority: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    });

    // Tabela de itens base (todos do sistema, ex: 5eTools)
    await queryInterface.createTable("items", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      rarity_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "unknown",
      },
      source_id: { type: DataTypes.STRING(10), allowNull: true },
      category: {
        type: DataTypes.ENUM("item", "upgrade"),
        allowNull: false,
      },
    });

    await queryInterface.addConstraint("items", {
      fields: ["source_id"],
      type: "foreign key",
      name: "fk_items_source",
      references: {
        table: "sources",
        field: "source",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addConstraint("items", {
      fields: ["rarity_id"],
      type: "foreign key",
      name: "fk_items_rarity",
      references: {
        table: "rarities",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });

    // Tabela de itens disponíveis para troca ou compra
    await queryInterface.createTable("available_items", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "items", key: "id" },
        onDelete: "CASCADE",
      },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      can_trade: { type: DataTypes.BOOLEAN, defaultValue: false },
      season_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "seasons", key: "id" },
        onDelete: "CASCADE",
      },
    });

    await queryInterface.addConstraint("available_items", {
      fields: ["item_id"],
      type: "foreign key",
      name: "fk_item",
      references: {
        table: "items",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // Tabela de personagens
    await queryInterface.createTable("characters", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      discord_id: { type: DataTypes.STRING(100), allowNull: false },
    });

    // Tabela de status
    await queryInterface.createTable("statuses", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    });

    // Tabela de requisições de troca
    await queryInterface.createTable("trade_requests", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      character_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "characters", key: "id" },
        onDelete: "CASCADE",
      },
      available_item_desired_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "available_items", key: "id" },
      },
      item_offered_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "items", key: "id" },
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "statuses", key: "id" },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    // Tabela de requisições de compra
    await queryInterface.createTable("purchase_requests", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      character_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "characters", key: "id" },
        onDelete: "CASCADE",
      },
      available_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "available_items", key: "id" },
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "statuses", key: "id" },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    // Tabela de logs
    await queryInterface.createTable("logs", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      route: { type: DataTypes.STRING(1000) },
      method: { type: DataTypes.STRING(10) },
      query: { type: DataTypes.STRING(1000) },
      error_message: { type: DataTypes.STRING(1000) },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    // Inserir status padrões
    await queryInterface.bulkInsert("statuses", [
      { name: "pending" },
      { name: "approved" },
      { name: "rejected" },
      { name: "out_of_stock" },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("logs");
    await queryInterface.dropTable("purchase_requests");
    await queryInterface.dropTable("trade_requests");
    await queryInterface.dropTable("statuses");
    await queryInterface.dropTable("characters");
    await queryInterface.dropTable("available_items");
    await queryInterface.removeConstraint("items", "fk_items_rarity");
    await queryInterface.removeConstraint("items", "fk_items_source");
    await queryInterface.dropTable("sources");
    await queryInterface.dropTable("items");
    await queryInterface.dropTable("seasons");
  },
};
