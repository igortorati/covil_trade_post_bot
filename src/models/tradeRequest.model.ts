import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Character from "./character.model";
import Item from "./item.model";
import Status from "./status.model";
import AvailableItem from "./availableItem.model";

@Table({ tableName: "trade_requests" })
export default class TradeRequest extends Model<TradeRequest> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => Character)
  @Column({ type: DataType.INTEGER, allowNull: false, field: "character_Id" })
  characterId!: number;

  @BelongsTo(() => Character)
  character?: Character;

  @ForeignKey(() => AvailableItem)
  @Column({ type: DataType.INTEGER, allowNull: false, field: "available_item_desired_id" })
  availableItemDesiredId!: number;

  @BelongsTo(() => AvailableItem)
  availableItemDesired?: AvailableItem;

  @ForeignKey(() => Item)
  @Column({ type: DataType.INTEGER, allowNull: false, field: "item_offered_id" })
  itemOfferedId!: number;

  @BelongsTo(() => Item)
  itemOffered?: Item;

  @ForeignKey(() => Status)
  @Column({ type: DataType.INTEGER, allowNull: false, field: "status_id" })
  statusId!: number;

  @BelongsTo(() => Status)
  status!: Status;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: "created_at"
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: "updated_at"
  })
  updatedAt!: Date;
}
