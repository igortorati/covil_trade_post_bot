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

@Table({ tableName: "purchase_requests" })
export default class PurchaseRequest extends Model<PurchaseRequest> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => Character)
  @Column({ type: DataType.INTEGER, allowNull: false })
  character_id!: number;

  @ForeignKey(() => Item)
  @Column({ type: DataType.INTEGER, allowNull: false })
  item_id!: number;

  @ForeignKey(() => Status)
  @Column({ type: DataType.INTEGER, allowNull: false })
  status_id!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;

  @BelongsTo(() => Status)
  status!: Status;
}
