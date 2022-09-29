import {
  Table,
  Column,
  DataType,
  IsEmail,
  Model,
  PrimaryKey,
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

  short() {
    return { email: this.email };
  }
}
