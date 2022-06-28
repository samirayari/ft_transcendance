import { NextPage } from "next"
import styles from '../../styles/game/Launcher.module.css'
import styles2 from '../../styles/game/Game.module.css'
import styles3 from '../../styles/game/Countdown.module.css'
import Image from 'next/image'

const Countdown: NextPage = () => {
	return (
		<div className={styles2.content}>
		<div className={styles2.background}>
			<Image src="/pong.png" layout="fill" objectFit='contain' alt="Pong"/>
			<div className={styles.wrap}>
				<div className={styles.launch}>
					<a>GAME STARTS IN </a>
					<div className={styles3.countdown}></div>
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

export default Countdown