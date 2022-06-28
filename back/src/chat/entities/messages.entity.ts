import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Conversation } from './conversation.entity';
import { Participants } from './participants.entity';

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message:string;

  @Column()
  date:string

  @ManyToOne(() => User, user => user.messages, {eager:true})
  user:User;

  @ManyToOne(() => Conversation, conversation => conversation.messages)
  conversation:Conversation;
  
}