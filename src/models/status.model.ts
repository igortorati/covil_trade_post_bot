import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'statuses', timestamps: false })
export class Status extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ unique: true })
  name!: string;
}
