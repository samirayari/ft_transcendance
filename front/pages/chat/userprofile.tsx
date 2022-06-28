import type { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from '../../styles/chat/Profile.module.css'

const Userprofile: NextPage<any> = (props) => {
    
    const privateRoom = useSelector((state:any) => state.privateRoom);
    const router = useRouter();
    const [rank, setRank] = useState("");
    const [image, setImage] = useState("norank.png");

    useEffect(() => {
        if (privateRoom[0].rank == "Bronze")
            setRank("Bronze.png")
        else if (privateRoom[0].rank == "Silver")
            setRank("Silver.png")
        else if (privateRoom[0].rank == "Gold")
            setRank("Gold.png")
        else if (privateRoom[0].rank == "Platinium")
            setRank("Platinium.png")
        if (privateRoom[0].image)
            setImage(privateRoom[0].image);
    }, [privateRoom])

    const inviteToPlay = async () => {
        if (privateRoom[0].id != -1) {
            router.push({
                pathname: "/launchgame",
                query: {
                    inviter: true,
                    id: privateRoom[0].userId,
                }
            }, "launchgame")
        }
    }

    return (
        <div className={styles.profileBar}>
            <div className={styles.profileContainer}>
                <div className={styles.profileImage} style={{backgroundImage: `url(${image})`}} />
                <div className={styles.name}>
                    <br />
                    <span className={styles.username}>{privateRoom[0].name}</span>
                    <br/>
                    <span className={styles.nick}>{privateRoom[0].username}</span>
                </div>
            </div>
            <div className={styles.rank}>
                <span className={styles.title}>Rank</span>
                <div className={styles.rankContent}>
                    <div className={styles.rankImage} style={{backgroundImage: `url(${rank})`}} />
                    <span className={styles.rankName}>{privateRoom[0].rank}</span>
                </div>
                <div className={styles.rankText}>
                    {rank == "Bronze.png" && "Newbie player"}
                    {rank == "Silver.png" && "The adventure begin (more than 3 wins)"}
                    {rank == "Gold.png" && "Pong Veteran (more than 5 wins)"}
                    {rank == "Platinium.png" && "Grand Master (more than 10 wins)"}
                </div>
            </div>
            <div className={styles.Play}>
                <div className={styles.btn}>
                    <div className={styles.playBtn} onClick={inviteToPlay}>
                        <Image src="/icone/play.svg" width={30} height={30} />
                        <div className={styles.gif}>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Userprofile