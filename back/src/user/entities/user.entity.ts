import { Messages } from 'src/chat/entities/messages.entity';
import { Participants } from 'src/chat/entities/participants.entity';
import { Game } from 'src/game/entities/game.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, PrimaryColumn, ManyToMany, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Block } from './block.entity';
import { Friends } from './friends.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  picture: string;
  
  @OneToMany(() => Messages, message => message.conversation)
  messages:Messages[]

  @Column()
  enable2FA: boolean;

  @Column()
  secretAuth: string;

  @Column()
  status: string;

  @Column()
  authenticate: boolean;

  @Column()
  isFirst: boolean;

  @Column({default: 0})
  score: number;

  @Column()
  rank: string;

  @OneToMany( () => Participants, participants => participants.user)
  participants:Participants[];

  @OneToMany(() => Game, game => game.idPlayer1)
  player1: Game;

  @OneToMany(() => Game, game => game.idPlayer2)
  player2: Game;

  @OneToMany(() => Friends, friends => friends.guest)
  receiveList: Friends[]

  @OneToMany(() => Friends, friends => friends.inviter)
  sendList: Friends[]

  @OneToMany(() => Block, block => block.userToBlock)
  blockList: Block[];

  // @OneToMany(type => User, user => user.blocked, {eager:true})
  // usrs: User[];
  
  // @ManyToOne(type => User, user => user.usrs)
  // @JoinColumn({ name: "blockedId" })
  // blocked: User;


/*
  @ManyToMany(() => Friends, friendlist => friendlist.user, {
    cascade: true,
  })
  friendList: Friends[];*/
}