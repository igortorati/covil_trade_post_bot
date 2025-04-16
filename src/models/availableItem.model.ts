import { Column, ForeignKey, Model, Table, BelongsTo, DataType } from 'sequelize-typescript';
import { Item } from './item.model';
import { Season } from './season.model';

@Table({ tableName: 'available_items', timestamps: false })
export class AvailableItem extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => Item)
  @Column
  itemId!: number;

  @BelongsTo(() => Item)
  item!: Item;

  @Column
  quantity!: number;

  @Column(DataType.DECIMAL(10, 2))
  price!: number;

  @Column({ field: 'allow_trade', defaultValue: false })
  allowTrade!: boolean;

  @ForeignKey(() => Season)
  @Column
  seasonId!: number;

  @BelongsTo(() => Season)
  season!: Season;
}
