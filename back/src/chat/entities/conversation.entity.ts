import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Messages } from './messages.entity';
import { Participants } from './participants.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id:number;

  @Column({})
  name: string;

  @Column()
  visibility:boolean;

  @Column()
  messagetype:string;

  @Column()
  status:string;

  @Column()
  password:string;

  @OneToMany( () => Participants, participants => participants.conversation, {nullable:true, eager:true})
  participants:Participants[];

  @OneToMany( () => Messages, message => message.conversation, {nullable:true, eager:true})
  messages:Messages[]
}