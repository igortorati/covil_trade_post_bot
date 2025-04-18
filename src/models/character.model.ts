import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "characters", timestamps: false })
export default class Character extends Model<Character> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  discord_id!: string;
}
