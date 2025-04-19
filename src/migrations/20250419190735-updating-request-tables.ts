import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('trade_requests', 'updated_by', {
      type: DataTypes.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('purchase_requests', 'updated_by', {
      type: DataTypes.STRING(100),
      allowNull: true,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('trade_requests', 'updated_by');
    await queryInterface.removeColumn('purchase_requests', 'updated_by');
  },
}