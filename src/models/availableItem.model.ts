import {
  Column,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
  DataType,
} from "sequelize-typescript";
import Season from "./season.model";
import Item from "./item.model";

@Table({ tableName: "available_items", timestamps: false })
export default class AvailableItem extends Model<AvailableItem> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => Item)
  @Column({ type: DataType.INTEGER, allowNull: false })
  item_id!: number;

  @BelongsTo(() => Item)
  item?: Item;

  @Column({ type: DataType.INTEGER, allowNull: false })
  quantity!: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  price!: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  can_trade!: boolean;

  @ForeignKey(() => Season)
  @Column({ type: DataType.INTEGER, allowNull: false })
  season_id!: number;

  @BelongsTo(() => Season)
  season!: Season;
}
