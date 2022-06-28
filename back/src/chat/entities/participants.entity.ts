import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity()
export class Participants {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.participants, {eager:true})
  user: User;

  @ManyToOne(() => Conversation, conversation => conversation.participants)
  conversation:Conversation;

  @Column()
  join:boolean

  @Column()
  ban:boolean;

  @Column()
  owner:boolean
  
  @Column()
  admin:boolean;

  @Column()
  mute:boolean;

  @Column()
  block:boolean;

  @Column()
  mutedTime:string

  @Column()
  timeToMute:string
  
}