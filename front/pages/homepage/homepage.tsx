import type { NextPage } from 'next'
import styles from '../../styles/homepage/Homepage.module.css'
import Image from 'next/image'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Client } from 'colyseus.js'
import { getSession, useSession } from 'next-auth/react'
import User from '../login/user'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import { store } from '../chat/store'
import { useSSRSafeId } from '@react-aria/ssr'

const Homepage: NextPage = () => {

	const [lastFive, setLastFive] = useState<any[]>([]);
	const [totalRoom, setTotalRoom] = useState<any[]>([]);
	const [listUser, setListUser] = useState<any[]>([]);
	const [listFriends, setListFriends] = useState<any[]>([]);
	const {data: session} = useSession();
	const client = new Client("ws://localhost:4000");
	const router = useRouter();
	
	const getFirstSession = async () => {
		const laSession = await getSession();
		if (laSession?.user?.isFirst == true){
			router.push("/editpage")
			axios.post("http://localhost:4000/user/setIsFirst", {
				id: laSession?.user.id,
			})
		}
	}

	useEffect(() => {
		getFirstSession()
	}, [])

	const getLastFive = async () => {
		axios.get("http://localhost:4000/game/getFiveLast")
			.then((response) => {
				setLastFive(response.data.response);
			})
	}

	const getTotalRooms = async () => {
		const rooms = await client.getAvailableRooms();
		const playing: any[] = [];

		if (rooms.length > 0) {
			for (let i = 0; i < rooms.length; i++) {
				if (rooms[i].metadata.status === "play")
					playing.push(rooms[i]);
			}
			setTotalRoom(playing);
		}
	}

	const getAllUser = async () => {
		const sess = await getSession();

		axios.get("http://localhost:4000/user/getAllUser")
			.then((response) => {
				let all: any[] = response.data.response;
				let list: any[] = [];
				if (all) {
					for (let i = 0; i < all.length; i++) {
						if (all[i].id != sess?.user?.id)
							list.push(all[i]);
					}
					setListUser(list);
				}
			})
	}

	const getFriends = async () => {
		const sess = await getSession();
		axios.post("http://localhost:4000/user/getFriends", {
			id: sess?.user?.id, 
			status : "accepted",
		}).then((response) => {
			setListFriends(response.data.response)
		})
	}

	useEffect(() => {
		getLastFive();
		getTotalRooms();
		getAllUser();
		getFriends();
	}, [])

	return (
		<Provider store={store}>
		<div className={styles.content}>
			<div className={styles.leftContainer}>
				<div className={styles.play}>
					<Image className={styles.ponghome} priority src="/pong2.gif" layout="fill" alt="ponghome"  />
				</div>
				<div className={styles.lastMatchs}>
					<div className={styles.header}>
						LAST DUELS
					</div>
					<div className={styles.infos}>
						<span className={styles.padelleft}>Padel left</span>
						<span className={styles.scoreheader}>SCORE</span>
						<span className={styles.padelright}>Padel right</span>
					</div>
					<div className={styles.score}>
						{lastFive.map((match, id) => (
							<div className={styles.lastscore} key={id}>
								<div className={styles.playerleft}>
									<div className={styles.imgwrap}>
										<div className={styles.imgleft} style={{ backgroundImage: `url(${match.idPlayer1.picture})`, }}></div>
									</div>
									<div className={styles.nameleft}>
										<span className={styles.name}>{match.idPlayer1.username}</span>
									</div>
								</div>
								<div className={styles.finalscore}>
									{match.scorePlayer1} - {match.scorePlayer2}
								</div>
								<div className={styles.playerright}>
									<div className={styles.nameright}>
										<span className={styles.name}>{match.idPlayer2.username}</span>
									</div>
									<div className={styles.imgwrap}>
										<div className={styles.imgright} style={{ backgroundImage: `url(${match.idPlayer2.picture})`, }}></div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div><div className={styles.rightContainer}>
				<div className={styles.liveMatchs}>
					<div className={styles.titleBar}>
						<h1 className={styles.title}>Live Matchs
							<span className={styles.nbr}> : {totalRoom.length}</span>
						</h1>
					</div>
					<div className={styles.liveMatchsList}>
						{totalRoom.map((match, id) => (
							<div className={styles.livematch} key={id}>
								<div className={styles.users}>
									<div> Match number {id + 1}</div>
								</div>
								<button className={styles.joinBtn} onClick={() => router.push({pathname: '/launchgame', query: match}, "launchgame")}>Watch</button>
							</div>
						))}
					</div>
				</div>
				<div className={styles.social}>
					<div className={styles.titleSocial}>Social</div>
					<div className={styles.worldUser}>
						<div className={styles.titleWorldUser}>Users</div>
						<div className={styles.userBox}>
							{listUser?.map((match, id) => (
								<User user={match} key={id} getAllUser={getAllUser} getFriends={getFriends}/>
							))}
						</div>
					</div>
					<div className={styles.friendUser}>
						<div className={styles.titleFriendUser}>Friends</div>
						<div className={styles.friendBox}>
							{listFriends.map((friend, id) => {
								const theFriend = friend.guest.id != session?.user?.id ? friend.guest : friend.inviter;
								return (<User user={theFriend} key={id} getAllUser={getAllUser} getFriends={getFriends}/>)
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
		</Provider>
	)
}

export default Homepage