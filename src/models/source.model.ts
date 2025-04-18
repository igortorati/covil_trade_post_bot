import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
} from "sequelize-typescript";

@Table({ tableName: "sources", timestamps: false })
export default class Source extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING(10),
  })
  source!: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  name!: string;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  published!: Date;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
  })
  author?: string;
}
