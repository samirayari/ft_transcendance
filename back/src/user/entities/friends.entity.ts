import { Entity, Column, PrimaryGeneratedColumn, OneToMany, PrimaryColumn, ManyToMany, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Friends {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.receiveList)
  guest: User;

  @ManyToOne(() => User, user => user.sendList)
  inviter: User;

  @Column({default : "waiting"})
  status: string;
  blockUser: any;
}