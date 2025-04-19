import { Column, DataType, Model, Table, HasMany } from "sequelize-typescript";
import AvailableItem from "./availableItem.model";

@Table({ tableName: "seasons", timestamps: false })
export default class Season extends Model<Season> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  season!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false, field: "is_current" })
  isCurrent!: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false, field: "is_deleted" })
  isDeleted!: boolean;

  @HasMany(() => AvailableItem)
  availableItems!: AvailableItem[];
}
