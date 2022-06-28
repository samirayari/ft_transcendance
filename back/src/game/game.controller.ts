import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {

    constructor(private readonly gameService: GameService){}
    
	@Post("createGame")
	async postCreateGame( @Body() {paddleSpeed, ballSpeed, ballStyle, backStyle, idPlayer1, idPlayer2, scorePlayer1, scorePlayer2} ) {
		const response = await this.gameService.createGame(paddleSpeed, ballSpeed, ballStyle, backStyle, idPlayer1, idPlayer2, scorePlayer1, scorePlayer2);
		return {
			response: response,
		}
	}

	@Get("getFiveLast")
	async getFiveLast() {
		const response = await this.gameService.lastFive();
		return {
			response: response
		}
	}
	@Get("getLeaderboard")
	async getLeaderboard() {
		const response = await this.gameService.getLeaderboard();
		return {
			response: response
		}
	}
	@Post("updateStatus")
	async updateStatus(@Body() {id}) {
		const response = await this.gameService.updateStatus({id});
		return {
			response: response
		}
	}
}
