import axios from "axios";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useRef, useEffect, useContext, useState } from "react";
import { useSelector } from "react-redux";
import style from '../../styles/game/Canvas.module.css'

let red = 255;
let green = 0;
let blue = 0;
let color = 'rgb(' + red + ', ' + green + ', ' + blue + ')';

const Canvas: NextPage<any> = (props: any) => {
	async function loadFont() {
		const myFont = new FontFace('PressStart2P', 'url(PressStart2P-Regular.ttf)');
		await myFont.load();
		document.fonts.add(myFont);
	}

	const pongState = useSelector((state: any) => state.pong.gameState);
	const room = useSelector((state: any) => state.pong.room);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const divRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const { data: session } = useSession();
	const username = session?.user?.username;
	let i = 0;
	const [mybool, setMyBool] = useState(true);
	const [gameleft, setGameLeft] = useState(false);

	const ballStyle = pongState.game.ballStyle;
	let background;
	if (pongState.game.backStyle === 'space')
		background = "/space.png";
	else if (pongState.game.backStyle === 'beach')
		background = "/beach.png";
	else if (pongState.game.backStyle === 'forest')
		background = "/forest.png";
	else
		background = "/black.png"

	const keyHandler = (event: any) => {
		if (event.code === "ArrowUp") {
			room.send("message", {
				direction: "up",
				user: username
			});
		}
		else if (event.code === "ArrowDown") {
			room.send("message", {
				direction: "down",
				user: username
			});
		}
	}

	const drawRainbow = () => {
		if (red === 255 && green < 255 && blue === 0) {
			green++;
		}
		if (red > 0 && green === 255 && blue === 0) {
			red--;
		}
		if (red === 0 && green === 255 && blue < 255) {
			blue++;
		}
		if (red === 0 && green > 0 && blue === 255) {
			green--;
		}
		if (red < 255 && green === 0 && blue === 255) {
			red++;
		}
		if (red === 255 && green === 0 && blue > 0) {
			blue--;
		}
		return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
	}

	const drawBall = (context: any) => {
		if (ballStyle === 'square') {
			context.fillRect(pongState.ball.x - pongState.ball.radius, pongState.ball.y - pongState.ball.radius, pongState.ball.radius * 2, pongState.ball.radius * 2);
		}
		else if (ballStyle === 'rainbow') {
			color = drawRainbow();
			context.fillStyle = color;
			context.arc(pongState.ball.x, pongState.ball.y, pongState.ball.radius, 0, 2 * Math.PI);
			context.fill();
		}
		else {
			context.arc(pongState.ball.x, pongState.ball.y, pongState.ball.radius, 0, 2 * Math.PI);
			context.fill();
		}
	}

	const drawPaddle = (context: any) => {
		context.fillRect(pongState.p1.x, pongState.p1.y, pongState.p1.paddleWidth, pongState.p1.paddleHeight);
		context.fillRect(pongState.p2.x, pongState.p2.y, pongState.p2.paddleWidth, pongState.p2.paddleHeight);
	}

	const drawScore = (context: any) => {
		context.globalAlpha = 0.5;
		context.font = "75px PressStart2P";
		context.fillText(pongState.game.score1, context.canvas.width / 4, context.canvas.height / 6);
		context.fillText(pongState.game.score2, 3 * (context.canvas.width / 4), context.canvas.height / 6);
		context.globalAlpha = 1;
	}

	const drawNet = (context: any) => {
		for (let i = 10; i < context.canvas.height; i += 50) {
			context.fillRect(pongState.net.x, pongState.net.y + i, pongState.p1.paddleWidth, 30);
		}
	}

	const drawWin = (context: any) => {
		const play = pongState.game.score1 > pongState.game.score2 ? "PLAYER 1" : "PLAYER 2";

		context.font = '50px PressStart2P';
		context.fillStyle = 'red';
		context.fillText(`${play} WINS !!!`, context.canvas.width / 8, context.canvas.height / 2);
		context.fillStyle = 'white';
	}

	const drawAll = (context: any, win: boolean) => {
		if (context) {
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
			context.beginPath();
			context.fillStyle = 'white';
			context.globalAlpha = 1;
			drawBall(context);
			context.fillStyle = 'white';
			drawScore(context);
			if (win)
			drawWin(context);
			drawPaddle(context);
			drawNet(context);
			context.closePath();
		}
	}

	const sleep = (time: any) => {
		return new Promise((resolve) => setTimeout(resolve, time));
	}
	
	const render = () => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext("2d");
		let animationFrameId: any;	

		if (pongState.game.status == "end") {
			if (mybool) {
				setMyBool(false);
				if (pongState.game.winner == username) {
					axios.post("http://localhost:4000/game/createGame", { 
						paddleSpeed: pongState.game.paddleSpeed,
						ballSpeed: pongState.game.ballSpeed,
						ballStyle: pongState.game.ballStyle,
						backStyle: pongState.game.backStyle,
						idPlayer1: pongState.p1.id,
						idPlayer2: pongState.p2.id,
						scorePlayer1: pongState.game.score1,
						scorePlayer2: pongState.game.score2 })
					}
				room.leave();
			}
			drawAll(context, true);
			sleep(5000).then(() => { router.push('/mainpage') });
			return ;
		}
		drawAll(context, false);
		animationFrameId = requestAnimationFrame(() => {
			setTimeout(render, 50);
		});
		// animationFrameId = window.requestAnimationFrame(render);
		if (gameleft){
			return ;
		}
		return () => {
			window.cancelAnimationFrame(animationFrameId);
		};
	}
	
	useEffect(() => {
		loadFont();
		render();
	}, []);

	return (
		<div className={style.wrap} style={{ backgroundImage: `url(${background})` }} ref={divRef} tabIndex={-1} onKeyDown={keyHandler}>
			<canvas className={style.cnv} ref={canvasRef} {...props} />
		</div>
	)
}

export default Canvas