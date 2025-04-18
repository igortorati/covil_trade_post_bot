import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'statuses', timestamps: false })
export default class Status extends Model<Status> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  name!: string;
}