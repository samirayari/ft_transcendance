import { Room } from "colyseus";
import { GameState, HEIGHT, PADDLE_HEIGHT, PADDLE_WIDTH, SPACE, WIDTH } from './gamestate'

class PongRoom extends Room {
    maxClients = 4;

    async onCreate(options: any) {
        this.setState(new GameState());
        this.setMetadata(options);
        this.state.p1.id = options.id
        this.state.p1.username = options.username
        this.state.game.ballSpeed = parseInt(options.ballSpeed) + 5;
        this.state.ball.speed = this.state.game.ballSpeed;
        this.state.game.paddleSpeed = (parseInt(options.paddleSpeed) + 1) * 5;
        this.state.ball.velX *= this.state.ball.speed;
        this.state.game.ballStyle = options.ballStyle;
        this.state.game.backStyle = options.backStyle;
    }
    
    async onJoin(client: any, options: any) {
        if (this.clients.length > 1) {
            if (this.clients.length == 2) {
                this.state.p2.username = options.username
                this.state.p2.id = options.id
                this.state.game.status = "play";
            }
            setTimeout(() => {
                this.setSimulationInterval((deltaTime) => this.update(deltaTime));
            }, 5000)
        }
        this.setMetadata({
            status: this.state.game.status
        });
        this.onMessage("message", (client: any, message: any) => {
            if (message.user == this.state.p1.username){
                if (message.direction == "up"){
                    if ((this.state.p1.y - this.state.game.paddleSpeed) >= 0)
                        this.state.p1.y -= this.state.game.paddleSpeed; 
                }
                else {
                    if ((this.state.p1.y + this.state.p1.paddleHeight + this.state.game.paddleSpeed) < HEIGHT)
                        this.state.p1.y += this.state.game.paddleSpeed; 
                } 
            }
            else if (message.user == this.state.p2.username){
                if (message.direction == "up"){
                    if ((this.state.p2.y - this.state.game.paddleSpeed) >= 0)
                        this.state.p2.y -= this.state.game.paddleSpeed; 
                }
                else {
                    if ((this.state.p2.y + this.state.p2.paddleHeight + this.state.game.paddleSpeed) < HEIGHT)
                        this.state.p2.y += this.state.game.paddleSpeed; 
                } 
            }
        })
    }

    collision = (player: { x: number; y: number; paddleHeight: number, paddleWidth: number }) => {
        const ball = this.state.ball;

		let pTop = player.y;
		let pBottom = player.y + player.paddleHeight;
		let pLeft = player.x;
		let pRight = player.x + player.paddleWidth;
		
		let bTop = ball.y - ball.radius;
		let bBottom = ball.y + ball.radius;
		let bLeft = ball.x - ball.radius;
		let bRight = ball.x + ball.radius;
		
		return bRight > pLeft && bTop < pBottom && bLeft < pRight && bBottom > pTop
	}

    resetBall = (end: boolean) => {
        const ball = this.state.ball;
    
		let direction = (ball.x > WIDTH / 2) ? 1 : -1;

		this.state.ball.x = WIDTH / 2;
		this.state.ball.y = HEIGHT / 2;
		if (!end) {
            this.state.p1.x = SPACE;
            this.state.p1.y = (HEIGHT / 2) - (PADDLE_HEIGHT / 2);
            this.state.p2.x = (WIDTH - SPACE - PADDLE_WIDTH);
            this.state.p2.y = (HEIGHT / 2) - (PADDLE_HEIGHT / 2);    
		    this.state.ball.speed = this.state.game.ballSpeed;
            this.state.ball.velX = direction * -1 * this.state.game.ballSpeed;
            this.state.ball.velY = Math.random() * 8 - 4;
        }
        else {
            this.state.p1.x = SPACE;
            this.state.p1.y = (HEIGHT / 2) - (PADDLE_HEIGHT / 2);
            this.state.p2.x = (WIDTH - SPACE - PADDLE_WIDTH);
            this.state.p2.y = (HEIGHT / 2) - (PADDLE_HEIGHT / 2);   
            this.state.ball.speed = 0;
            this.state.ball.velX = 0;
            this.state.ball.velY = 0;
        }
	}

    update = (deltaTime: number) => {
        if (this.state.game.status == "end")
            return ;
        const p1 = this.state.p1;
        const p2 = this.state.p2;

        if (this.state.ball.x - this.state.ball.radius > 10 || this.state.ball.x + this.state.ball.radius < WIDTH - 20)
            this.state.ball.x += this.state.ball.velX;
        this.state.ball.y += this.state.ball.velY;
        if (this.state.ball.y + this.state.ball.radius > HEIGHT || this.state.ball.y - this.state.ball.radius < 0)
            this.state.ball.velY = -this.state.ball.velY;
        let player = (this.state.ball.x < WIDTH / 2) ? p1 : p2;
        if (this.collision(player)){
            let collidePoint = (this.state.ball.y - (player.y + player.paddleHeight / 2)) / player.paddleHeight;
            this.state.ball.angleRad = collidePoint * Math.PI / 4;
            let direction = (this.state.ball.x < WIDTH / 2) ? 1 : -1;
            if (this.state.ball.speed < 25)
                this.state.ball.speed += Math.abs(this.state.ball.angleRad);
            this.state.ball.velX = direction * this.state.ball.speed * Math.cos(this.state.ball.angleRad);
            this.state.ball.velY = this.state.ball.speed * Math.sin(this.state.ball.angleRad);
        }
        if (this.state.ball.x - this.state.ball.radius < 0) {
			this.state.game.score2++;
			this.resetBall(false);
		}
		else if (this.state.ball.x + this.state.ball.radius > WIDTH) {
			this.state.game.score1++;
			this.resetBall(false);
		}
        if (this.state.game.score1 > 9 || this.state.game.score2 > 9) {
            this.state.game.status = "end";
            this.state.game.winner = (this.state.game.score1 > this.state.game.score2) ? this.state.p1.username : this.state.p2.username;
            this.resetBall(true);
        }
    }
}

export default PongRoom