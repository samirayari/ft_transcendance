import axios from 'axios'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import styles from '../../styles/game/Leaderboard.module.css'

const LearderBoard: NextPage = () => {

	const [leaderboard, setLeaderboard] = useState<any[]>([]);

	useEffect(() => {
		const getLeaderboard = async () => {
			axios.get("http://localhost:4000/game/getLeaderboard")
				.then((response) => {
					setLeaderboard(response.data.response);
				})
		}
		getLeaderboard();

	}, [])


	return (
		<div className={styles.content}>
			<header className={styles.header}>
				<h1 className={styles.title}>LEADER BOARD</h1>
				<img className={styles.playerimg} src="/player.png" alt="" />
				<nav className={styles.headerNav}>
					<div className={styles.ranking}>Rank</div>
					<div className={styles.user}>User</div>
					<div></div>
					<div></div>
					<div className={styles.points}>Points</div>
				</nav>
			</header>
			<div className={styles.table}>
				<div className={styles.tableBody}>
					{leaderboard.map((match, id:number) => (
						<div key={id} className={ id % 2 == 0 ? styles.rawBodyPair : styles.rawBodyImpair}>
							<div className={styles.rank}>{id + 1}</div>
							<div className={styles.imgname}>
								<div className={styles.img} style={{ backgroundImage: `url(${match.picture})`, }}></div>
								<div className={styles.username}>{match.username}</div>
							</div>
							<div className={styles.totalpts}>{match.score}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default LearderBoard