import { NextPage } from "next";
import styles from '../../styles/game/Popup.module.css'
import styles2 from '../../styles/game/Game.module.css'
import Image from 'next/image'

const Popup: NextPage = () => {
	return (	
		<div className={styles2.content}>
		<div className={styles2.background}>
			<Image src="/pong.png" layout="fill" objectFit='contain' alt="Pong"/>
			<div className={styles.nogame}>
				<h3>NO GAME AVAILABLE</h3>
				<a>Please create one first</a>
			</div>
		</div>
		</div>
	)
}

export default Popup