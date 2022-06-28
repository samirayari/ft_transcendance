import axios from 'axios'
import type { NextPage } from 'next'
import { getSession, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import styles from '../styles/Navbar.module.css'
import Notif from './login/notif'
import NotifPlay from './login/notifPlay'

const socket = io("http://localhost:4001", {transports: ['websocket']});

const Navbar: NextPage = () => {

	const {data : session, status} = useSession()
	const [notifications, setNotifications] = useState(false)
	const [listFriends, setListFriends] = useState<any[]>([]);
	const [notifPlay, setNotifPlay] = useState();
	const [activeNotif, setActiveNotif] = useState(false)

  const logout = async () => {
	await axios.post("http://localhost:4000/user/setAuth", {
		id : session?.user?.id,
  	})
    signOut()
  }

	const getNotif = async () => {
		const sess = await getSession();
		const friends = axios.post("http://localhost:4000/user/getNotif", {
			id: sess?.user?.id, 
		}).then((response) => {
			setListFriends(response.data.response)
		})

	}
  const showNotification = async () => {
	setNotifications(!notifications)
  }

  useEffect(() => {
	getNotif();
	socket.off("inviteToPlay")
	socket.on("inviteToPlay", (response:any) => {
		if (response.idGuest == session?.user?.id){
			setNotifPlay(response)
			setActiveNotif(!activeNotif)
		}
	})
  }, [])

  return (
	<div className={styles.navbar_content}>	
		<div className={styles.wrap}>
			<div className={styles.profile}>
				<div className={!activeNotif ? styles.notifPlay: `${styles.notifPlay} ${styles.notifPlayActive}`}>
					<NotifPlay notif={notifPlay} setActiveNotif={setActiveNotif}/>
				</div>
				<div className={styles.notifWrap} style={notifications ? {visibility:"visible", height: "200px"} : {}}>
					{listFriends.map((friend:any, id:number)=> {
						return (<Notif friend={friend} key={id} getNotif={getNotif}/>)
					})}
				</div>
				<button className={styles.notifBtn} onClick={showNotification}>
				<Image src= "/icone/cloche.svg" width={25} height={25} alt="Bell"></Image>
				</button>
                <div className={styles.userImg} style={{ backgroundImage: `url(${session?.user?.picture})`,}}></div>
				<span className={styles.username}>{session?.user?.username}</span>
			</div>
			<button className={styles.logoutBtn} onClick={() => logout()}>
				<Image src="/icone/deconnexion.svg" width={20} height={20} alt="Disconnect"></Image>
			</button>
		</div>
	</div>
  )
}

export default Navbar