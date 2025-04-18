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

@Table({ tableName: "trade_requests" })
export default class TradeRequest extends Model<TradeRequest> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => Character)
  @Column({ type: DataType.INTEGER, allowNull: false })
  character_id!: number;

  @ForeignKey(() => Item)
  @Column({ type: DataType.INTEGER, allowNull: false })
  item_desired_id!: number;

  @ForeignKey(() => Item)
  @Column({ type: DataType.INTEGER, allowNull: false })
  item_offered_id!: number;

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
