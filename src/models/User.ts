import {
  Table,
  Column,
  DataType,
  IsEmail,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "user",
})
export class User extends Model {
  @PrimaryKey
  @IsEmail
  @Column({ type: DataType.STRING })
  public email!: string;

  @Column({ type: DataType.STRING })
  public password!: string;

  @Column
  @CreatedAt
  public createdAt: Date = new Date();

  @Column
  @UpdatedAt
  public updatedAt: Date = new Date();

  short() {
    return { email: this.email };
  }
}
