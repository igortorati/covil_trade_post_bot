import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'logs', timestamps: true })
export default class Log extends Model {
  @Column(DataType.TEXT)
  request!: string;

  @Column(DataType.TEXT)
  error!: string;

  @Column({ type: DataType.STRING(2000), allowNull: true })
  stacktrace!: string;
}
