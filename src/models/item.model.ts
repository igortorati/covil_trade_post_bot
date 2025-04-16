import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { AvailableItem } from './availableItem.model';

@Table({ tableName: 'items', timestamps: false })
export class Item extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ allowNull: false })
  name!: string;

  @Column({ allowNull: false })
  rarity!: string;

  @Column
  source!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column({ allowNull: false })
  category!: string;

  @HasMany(() => AvailableItem)
  availableItems!: AvailableItem[];
}
