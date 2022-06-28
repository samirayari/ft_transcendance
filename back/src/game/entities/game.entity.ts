import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paddleSpeed: number;

  @Column()
  ballSpeed: number;

  @Column()
  ballStyle: string;

  @Column()
  backStyle: string;

  @ManyToOne(() => User, user => user.player1, {eager:true})
  idPlayer1: User;

  @ManyToOne(() => User, user => user.player2, {eager:true})
  idPlayer2: User;

  @Column()
  scorePlayer1: number;

  @Column()
  scorePlayer2: number;
}