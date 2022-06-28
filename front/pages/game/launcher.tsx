import { NextPage } from "next"
import styles from '../../styles/game/Launcher.module.css'
import styles2 from '../../styles/game/Game.module.css'
import Image from 'next/image'
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Countdown from "./countdown"
import Popup from './popup'
import { Client } from 'colyseus.js'
import { useDispatch } from "react-redux"
import { setPongInfos, setRoom } from "./gamestore"
import { useSession } from "next-auth/react"
import axios from "axios"
import { io } from "socket.io-client"

const chatsocket = io("http://localhost:4001", {transports: ['websocket']});

const Launcher: NextPage = () => {

	const { data: session } = useSession();
	const dispatch = useDispatch();
	const [showcount, setCountdown] = useState(false);
	const [popup, setPopup] = useState(false);
	const router = useRouter();
	const client = new Client("ws://localhost:4000");
	const { paddleSpeed, ballSpeed, ballStyle, backStyle, player } = router.query;

	const sleep = (time: any) => {
		return new Promise((resolve) => setTimeout(resolve, time));
	}

	const getRooms = async () => {
		const rooms = await client.getAvailableRooms();

		for (let i = 0; i < rooms.length; i++) {
			if (rooms[i].metadata.status === "wait" && !rooms[i].metadata.private)
				return rooms[i].roomId;
		}
		setPopup(true);
		sleep(2000).then(() => {
			router.push('/gamepage');
		})
		return null;
	}

	const connect = async () => {
		let room: any;
		let ready: boolean = false;
		let spectate: boolean = false

		try {
			if (player == "1" && !spectate) {
				room = await client.create("pong", {
					username: session?.user?.username,
					id: session?.user?.id,
					paddleSpeed: paddleSpeed,
					ballSpeed: ballSpeed,
					ballStyle: ballStyle,
					backStyle: backStyle,
					private: false
				});
			}
			else if (player == '2' && !spectate) {
				const id = await getRooms();

				if (id) {
					room = await client.joinById(id, {
						username: session?.user?.username,
						id: session?.user?.id
					});
				}
			}
			else if (router.query.inviter && !spectate) {
				room = await client.create("pong", {
					username: session?.user?.username,
					id: session?.user?.id,
					paddleSpeed: 2,
					ballSpeed: 2,
					ballStyle: "circle",
					backStyle: "classic",
					private: true
				})
				chatsocket.emit("inviteToPlay", { roomId: room.id, idInviter: session?.user?.id, idGuest: router.query.id, inviterUser: session?.user?.username })

			}
			else {
				if (router.query.roomId)
					room = await client.joinById(router.query.roomId.toString(), {
						username: session?.user?.username,
						id: session?.user?.id
					});
				if (!router.query.invite)
					spectate = true;
			}


			if (room) {
				dispatch(setRoom({
					room: room
				}));
				room.onStateChange((newState: any) => {
					dispatch(setPongInfos({
						gameState: newState
					}));
					if (newState.game.status === "play" && !ready) {
						ready = true;
						axios.post("http://localhost:4000/game/updateStatus", {
							id: session?.user?.id,
						}).then(() => {
						})
						if (spectate)
							router.push("/pongpage")
						else {
							setCountdown(true);
							sleep(4000).then(() => {
								router.push("/pongpage");
							})
						}
					}
				});
			}
		} catch (e) {
			console.error("Couldn't connect: ", e);
		}
	}

	useEffect(() => {
		connect();
	}, [])


	if (showcount == true) {
		return <Countdown />
	}

	if (popup == true) {
		return <Popup />
	}

	return (
		<div className={styles2.content}>
			<div className={styles2.background}>
				<Image src="/pong.png" layout="fill" objectFit='contain' alt="Pong" />
				<div className={styles.wrap}>
					<div className={styles.launch}>
						<a>WAITING FOR AN OPPONENT </a>
						<div className={styles.spinner}>
							<div className={styles.bounce1}></div>
							<div className={styles.bounce2}></div>
							<div className={styles.bounce3}></div>
						</div>
					</div>
					<a className={styles.instructions}>INSTRUCTIONS</a>
					<div className={styles.commandup}>
						<div className={styles.imgwrap}>
							<a>UP :</a>
							<Image src="/icone/upkey.svg" width={30} height={30} alt="upkey" />
						</div>
					</div>
					<div className={styles.commanddown}>
						<div className={styles.imgwrap}>
							<a>DOWN :</a>
							<Image src="/icone/downkey.svg" width={30} height={30} alt="downkey" />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Launcher