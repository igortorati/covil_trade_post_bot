import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Character } from './character.model';
import { Item } from './item.model';
import { Status } from './status.model';

@Table({ tableName: 'trade_requests', timestamps: true })
export class TradeRequest extends Model {
  @ForeignKey(() => Character)
  @Column
  characterId!: number;

  @BelongsTo(() => Character)
  character!: Character;

  @ForeignKey(() => Item)
  @Column
  offeredItemId!: number;

  @BelongsTo(() => Item, 'offeredItemId')
  offeredItem!: Item;

  @ForeignKey(() => Item)
  @Column
  requestedItemId!: number;

  @BelongsTo(() => Item, 'requestedItemId')
  requestedItem!: Item;

  @ForeignKey(() => Status)
  @Column
  statusId!: number;

  @BelongsTo(() => Status)
  status!: Status;
}
