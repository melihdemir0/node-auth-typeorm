import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";

import { RefreshToken } from "./RefreshToken";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 200, unique: true })
  email!: string;

  @Column({ length: 200 })
  password!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @OneToMany(() => RefreshToken, (token) => token.user)
  tokens!: RefreshToken[];
}
