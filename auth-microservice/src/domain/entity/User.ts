import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 50 })
  username: string;

  @Column()
  password: string;
}
