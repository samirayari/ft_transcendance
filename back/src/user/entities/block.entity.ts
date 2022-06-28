import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userWhoBlock:number;

  @ManyToOne(() => User, user => user.blockList, {eager:true})
  userToBlock: User;


}