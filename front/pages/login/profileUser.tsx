import styles from '../../styles/login/ProfileUser.module.css'
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
const ProfileUser = (props:any) => {

    const {data : session} = useSession();
    const router = useRouter();
    const data = router.query;
    const [ranky , setRanky] = useState("");
    const [userState, setUser] = useState<any>("")
    
    const requestUser = async () => {
        const userr = await axios.post("http://localhost:4000/user/requestUser", {
            id: data.id,
        }).then((response:any) => {
            setUser(response.data.response)
            console.log(response.data.response)
        })

    }

    
    
    useEffect(() => {
        requestUser()
        const path = userState.rank + ".png"
        setRanky(path)
    },[])

    return (
        <div className={styles.allWrap}>
            <div className={styles.container}>
                <div className={styles.containerLeft}>
                    <div className={styles.pictureBox}>
                        <div className={styles.pictureWrap}>
							<div className={styles.picture} style={{ backgroundImage: `url(${userState.picture})`, }}></div>
                        </div>
                        <div className={styles.pictureTitle}>
                            <span>{userState.username}</span>
                            <span id={styles.mailTitle}>{userState.email}</span>
                        </div>
                    </div>
                    <div className={styles.rankBox}>
                        <span id={styles.rankName}> Rank </span>
                        <span> {userState.rank}</span>
						<div className={styles.rankImage} style={{ backgroundImage: `url(${ranky})`, }}></div>
                    </div>
                </div>
                <div className={styles.containerRight}>
                    <div className={styles.name}>
                        <div className={styles.nameTitle}>Name</div>
                        <div className={styles.nameContent}>{userState.name}</div>
                    </div>
                    <div className={styles.username}>
                        <div className={styles.usernameTitle}>username</div>
                        <div className={styles.usernameContent}>{userState.username}</div>
                    </div>
                    <div className={styles.email}>
                        <div className={styles.emailTitle}>Email</div>
                        <div className={styles.emailContent}>{userState.email}</div>
                    </div>
                    <div className={styles.ratio}>
                        <div className={styles.ratioTitle}>Score</div>
                        <div className={styles.ratioContent}>{userState.score}</div>
                    </div>
                    <div className={styles.status}>
                        <div className={styles.statusTitle}>Rank</div>
                        <div className={styles.statusContent}>{userState.rank}</div>
                    </div>
                    <div className={styles.ratio}>
                        <div className={styles.ratioTitle}>Status</div>
                        <div className={styles.ratioContent}>{userState.status}</div>
                    </div>
                    <Link href='/mainpage'>
                    <div className={styles.buttonField}>
                        <div className={styles.editButton}>Back</div>
                    </div>
                    </Link>
                </div>
            </div>
        </div>
    )

}
export default ProfileUser;