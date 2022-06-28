import type { NextPage } from 'next'
import Image from 'next/image'
import styles from '../../styles/game/Game.module.css'
import Link from 'next/link'

const Game: NextPage = () => {
	return (
		<div className={styles.content}>
			<div className={styles.background}>
				<Image src="/pong.png" layout="fill" objectFit='contain' alt="Pong"/>
					<div className={styles.gameChoice}>
						<div className={styles.gameButton}>
							<Link href='/settingsgame' passHref>
								<button>CREATE GAME</button>
							</Link>
						</div>
						<div className={styles.gameButton}>
							<Link href={{
								pathname: '/launchgame',
								query:{
									paddleSpeed: 2,
									ballSpeed: 2,
									ballStyle: 'circle',
									backStyle: 'space',
									player: 2,	
								}}} passHref>
								<button>JOIN GAME</button>
							</Link>
						</div>
					</div>
			</div>
		</div>
	)
}

export default Game