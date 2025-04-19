import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
} from "sequelize-typescript";
import Character from "./character.model";
import Item from "./item.model";
import Status from "./status.model";
import AvailableItem from "./availableItem.model";

@Table({ tableName: "purchase_requests" })
export default class PurchaseRequest extends Model<PurchaseRequest> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => Character)
  @Column({ type: DataType.INTEGER, allowNull: false, field: "character_id" })
  characterId!: number;

  @BelongsTo(() => Character)
  character?: Character;

  @ForeignKey(() => AvailableItem)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "available_item_id",
  })
  availableItemId!: number;

  @BelongsTo(() => AvailableItem)
  availableItem?: AvailableItem;

  @ForeignKey(() => Status)
  @Column({ type: DataType.INTEGER, allowNull: false, field: "status_id" })
  statusId!: number;

  @BelongsTo(() => Status)
  status!: Status;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: "created_at",
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: "updated_at",
  })
  updatedAt!: Date;

  @Column({ type: DataType.STRING(100), allowNull: false, field: "updated_by" })
  updatedBy!: string;
}
