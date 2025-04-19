import {
  Column,
  DataType,
  Model,
  Table,
  HasMany,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import AvailableItem from "./availableItem.model";
import Source from "./source.model";
import Rarity from "./rarity.model";

@Table({ tableName: "items", timestamps: false })
export default class Item extends Model<Item> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  name!: string;

  @ForeignKey(() => Rarity)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "unknown",
    field: "rarity_id",
  })
  rarityId!: string;

  @BelongsTo(() => Rarity)
  rarity?: Rarity;

  @ForeignKey(() => Source)
  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    field: "source_id",
  })
  sourceId!: string | null;

  @BelongsTo(() => Source)
  source?: Source;

  @Column({
    type: DataType.ENUM("item", "upgrade"),
    allowNull: false,
  })
  category!: "item" | "upgrade";

  @HasMany(() => AvailableItem)
  availableItems!: AvailableItem[];
}
