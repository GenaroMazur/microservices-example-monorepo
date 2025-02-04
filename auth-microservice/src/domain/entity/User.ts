import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 50 })
  @Index({ unique: true, where: "deletedAt IS NULL" })
  username: string;

  @Column({ select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  static Builder() {
    return new UserBuilder();
  }
}

class UserBuilder {
  private user: User;

  constructor() {
    this.user = new User();

    this.user.updatedAt = new Date();
    this.user.createdAt = new Date();
  }

  id(id: number) {
    this.user.id = id;
    return this;
  }

  username(username: string) {
    this.user.username = username;
    return this;
  }

  password(password: string) {
    this.user.password = password;
    return this;
  }

  build() {
    return this.user;
  }
}
