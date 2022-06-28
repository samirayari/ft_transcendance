import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import styles from '../../styles/game/Game.module.css'
import Canvas from './canvas'

const Pong: NextPage = () => {

	const router = useRouter();

	return (
		<div className={styles.content}>
			<div className={styles.background}>
				<Canvas settingame={router.query} width='1080' height='600'/>
			</div>
		</div>
	)
}

export default Pong