
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Image from 'next/image'
import styles from '../../styles/game/Settings.module.css'
import styles2 from '../../styles/game/Game.module.css'
import Dropdown from './dropdown'

const Settings: NextPage = () => {

	const[padelCursorState, setPadelCursorState] = useState(2);
	const[ballCursorState, setBallCursorState] = useState(2);
	const[ballOptionState, setBallOptionState] = useState("circle");
	const[backOptionState, setBackOptionState] = useState("classic");

	const router = useRouter(); 
	const goBack = () => {
		router.back();
	}

	const changeCursorPadel = (event: any) => {
		setPadelCursorState(event.target.value);
	}
	
	const changeCursorBall = (event: any) => {
		setBallCursorState(event.target.value);
	}

	const ballOptions = [
		{value: "circle", label:"Circle"},
		{value: "square", label:"Square"},
		{value: "rainbow", label:"Rainbow"}
	]

	const backOptions = [
		{value: "classic", label: "Classic"},
		{value: "space", label:"Space"},
		{value: "beach", label:"Beach"},
		{value: "forest", label:"Forest"}
	]

	const getBallStyle = (name: string) => {
		setBallOptionState(name);
	}

	const getBackgroundStyle = (name: string) => {
		setBackOptionState(name);
	}

	return (
		<div className={styles2.content}>
			<div className={styles2.background}>
				<Image src="/pong.png" layout="fill" objectFit='contain' alt="Pong"/>
				<div className={styles.settings}>
					<div className={styles.padelSpeed}>
						<div className={styles.settingButton}>
							PADEL SPEED
						</div>
						<div className={styles.settingButton}>
							<input onChange={changeCursorPadel} id="range1" name="range1" type="range" min="0" max="5" value={padelCursorState}></input>
							<span>{padelCursorState}</span>
						</div>
					</div>
					<div className={styles.ballSpeed}>
						<div className={styles.settingButton}>
							BALL SPEED
						</div>
						<div className={styles.settingButton}>
							<input onChange={changeCursorBall} id="range2" name="range2" type="range" min="0" max="5" value={ballCursorState}></input>
							<span>{ballCursorState}</span>
						</div>
					</div>
					<div className={styles.ballStyle}>
						<div className={styles.settingButton}>
							BALL STYLE
						</div>
						<div className={styles.settingButton}>
							<Dropdown sendValue={getBallStyle} option={ballOptions}/>
						</div>
					</div>
					<div className={styles.backgroundStyle}>
						<div className={styles.settingButton}>
							<a>BACKGROUND STYLE</a>
						</div>
						<div className={styles.settingButton}>
							<Dropdown sendValue={getBackgroundStyle} option={backOptions}/>
						</div>
					</div>
					<div className={styles.buttonSelect}>
						<div className={styles.settingButtonBack}>
							<button onClick={goBack}>GO BACK</button>
						</div>
						<div className={styles.settingButtonPlay}>
							<Link href={{
								pathname: '/launchgame',
								query:{
									paddleSpeed: padelCursorState,
									ballSpeed: ballCursorState,
									ballStyle: ballOptionState,
									backStyle: backOptionState,
									player: 1,	
								}}} passHref as="/launchgame">
								<button>LET&apos;S PLAY</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Settings