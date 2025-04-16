import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'logs', timestamps: true })
export class Log extends Model {
  @Column(DataType.TEXT)
  request!: string;

  @Column(DataType.TEXT)
  error!: string;

  @Column
  stacktrace!: string;
}
