import { Column, Model, Table, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'rarities',
  timestamps: false,
})
export default class Rarity extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING(20) })
  id!: string;

  @Column({ type: DataType.STRING(20), allowNull: false })
  name_pt!: string;
}
