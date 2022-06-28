import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game)
        private readonly gameRepository: Repository<Game>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

	async createGame(paddleSpeed: number, ballSpeed: number, ballStyle: string, backStyle: string, idPlayer1: number, idPlayer2: number, scorePlayer1: number, scorePlayer2: number) {
		const pl1 = await this.userRepository.findOne({id: idPlayer1});
		const pl2 = await this.userRepository.findOne({id: idPlayer2});
		if (pl1 && pl2) {
			const newGame = this.gameRepository.create({
				paddleSpeed: paddleSpeed,
				ballSpeed: ballSpeed,
				ballStyle: ballStyle,
				backStyle: backStyle,
				idPlayer1: pl1,
				idPlayer2: pl2,
				scorePlayer1: scorePlayer1,
				scorePlayer2: scorePlayer2,
			});
			if (scorePlayer1 > scorePlayer2) {
				pl1.score += 100
			}
			else {
				pl2.score += 100
			}
			if (pl1.score >= 300)
				pl1.rank = "Silver"
			if (pl2.score >= 300)
				pl2.rank = "Silver"
			if (pl1.score >= 500)
				pl1.rank = "Gold"
			if (pl2.score >= 500)
				pl2.rank = "Gold"
			if (pl1.score >= 1000)
				pl1.rank = "Platinium"
			if (pl2.score >= 1000)
				pl2.rank = "Platinium"
			pl1.status = "Online";
			pl2.status = "Online";
			this.userRepository.save(pl1)
			this.userRepository.save(pl2)
			const response = this.gameRepository.save(newGame);
			return response;
		}
	}

	async lastFive(){
		const last = this.gameRepository.find({
			take: 5,
			order: {
				id: "DESC" 
			}
		})
		if (last)
			return last;
	}

	async getLeaderboard(){
		const leaderboard = this.userRepository.find({
			order: {
				score: "DESC" 
			}
		})
		if (leaderboard)
			return leaderboard;
	}

	async updateStatus(id){
		const user = await this.userRepository.findOne(id)
		user.status = "Playing"
		this.userRepository.save(user)
		return user
	}
}
