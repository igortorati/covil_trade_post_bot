import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { AvailableItem } from './availableItem.model';

@Table({ tableName: 'seasons', timestamps: false })
export class Season extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ allowNull: false, unique: true })
  version!: string;

  @Column({ field: 'is_current', defaultValue: false })
  isCurrent!: boolean;

  @HasMany(() => AvailableItem)
  availableItems!: AvailableItem[];
}
