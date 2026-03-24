import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("items", "is_consumable", {
      type: DataTypes.BOOLEAN(),
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("items", "is_magical", {
      type: DataTypes.BOOLEAN(),
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("items", "is_mundane", {
      type: DataTypes.BOOLEAN(),
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("items", "is_legacy", {
      type: DataTypes.BOOLEAN(),
      allowNull: false,
      defaultValue: false,
    });
    
    await queryInterface.removeConstraint("items", "name");

    await queryInterface.changeColumn("items", "name", {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: false,
    });

    await queryInterface.addConstraint('items', {
      fields: ['name', 'source_id'],
      type: 'unique',
      name: 'unique_name_source_constraint'
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("items", "is_consumable");
    await queryInterface.removeColumn("items", "is_magical");
    await queryInterface.removeColumn("items", "is_mundane");
    await queryInterface.removeColumn("items", "is_legacy");
    await queryInterface.changeColumn("items", "name", {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    });
    await queryInterface.addConstraint("items", {
      fields: ["name"],
      type: "unique",
      name: "name",
    });

    await queryInterface.removeConstraint("items", "unique_name_source_lecacy_constraint");
  },
};
