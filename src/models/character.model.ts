import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'characters', timestamps: false })
export class Character extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ field: 'discord_id', allowNull: false })
  discordId!: string;

  @Column({ allowNull: false })
  name!: string;
}
