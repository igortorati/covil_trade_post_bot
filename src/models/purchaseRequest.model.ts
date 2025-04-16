import { Column, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Character } from './character.model';
import { Item } from './item.model';
import { Status } from './status.model';

@Table({ tableName: 'purchase_requests', timestamps: true })
export class PurchaseRequest extends Model {
  @ForeignKey(() => Character)
  @Column
  characterId!: number;

  @BelongsTo(() => Character)
  character!: Character;

  @ForeignKey(() => Item)
  @Column
  itemId!: number;

  @BelongsTo(() => Item)
  item!: Item;

  @ForeignKey(() => Status)
  @Column
  statusId!: number;

  @BelongsTo(() => Status)
  status!: Status;
}
