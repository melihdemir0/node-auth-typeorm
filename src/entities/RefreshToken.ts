import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

import { User } from "./User";

@Entity({ name: "refresh_tokens" })
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", unique: true })
  token!: string;

  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ default: false })
  revoked!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
