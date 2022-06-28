import { Schema, type } from "@colyseus/schema";

export const PADDLE_SPEED = 0;
export const PADDLE_HEIGHT = 100;
export const PADDLE_WIDTH = 10;
export const START = -1;
export const SPACE = 10;
export const WIDTH = 1080;
export const HEIGHT = 600;

class Ball extends Schema {
    @type("float64") x: number = WIDTH / 2;
    @type("float64") y: number = HEIGHT / 2;
    @type("float64") radius: number = 10;
    @type("float64") angleRad: number = 0;
    @type("float64") speed: number;
    @type("float64") velX: number = START;
    @type("float64") velY: number = Math.random() * 8 - 4;
}

class Player extends Schema {
	@type("number") id: number;
	@type("string") username: string;
    @type("float64") x: number;
    @type("float64") y: number;
	@type("number") paddleHeight: number = PADDLE_HEIGHT;
	@type("number") paddleWidth: number = PADDLE_WIDTH;

	constructor( x: number, y: number ) {
		super();
		this.x = x;
		this.y = y;
	}
}

class Net extends Schema {
	@type("float64") x: number = (WIDTH / 2) - (PADDLE_WIDTH / 2);
	@type("float64") y: number = 0;
}

class Game extends Schema {
	@type("number") score1: number = 0;
	@type("number") score2: number = 0;
	@type("number") paddleSpeed: number;
	@type("number") ballSpeed: number;
	@type("string") ballStyle: string;
	@type("string") backStyle: string;
	@type("string") status: string = "wait";
	@type("string") winner: string;
}

export class GameState extends Schema {
    @type(Ball) ball: Ball = new Ball();
    @type(Player) p1: Player = new Player(SPACE, ((HEIGHT / 2) - (PADDLE_HEIGHT / 2)));
    @type(Player) p2: Player = new Player((WIDTH - SPACE - PADDLE_WIDTH), ((HEIGHT / 2) - (PADDLE_HEIGHT / 2)));
	@type(Net) net: Net = new Net();
    @type(Game) game: Game = new Game();
}