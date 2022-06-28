import styles from '../../styles/login/Profile.module.css'
import Link from 'next/link';
import { useSession } from 'next-auth/react';
const Profile = () => {

    const {data : session} = useSession();
    const ranky = session?.user?.rank + ".png"

    return (
        <div className={styles.allWrap}>
            <div className={styles.container}>
                <div className={styles.containerLeft}>
                    <div className={styles.pictureBox}>
                        <div className={styles.pictureWrap}>
							<div className={styles.picture} style={{ backgroundImage: `url(${session?.user?.picture})`, }}></div>
                        </div>
                        <div className={styles.pictureTitle}>
                            <span>{session?.user?.username}</span>
                            <span id={styles.mailTitle}>{session?.user?.email}</span>
                        </div>
                    </div>
                    <div className={styles.rankBox}>
                        <span id={styles.rankName}> Rank </span>
                        <span> {session?.user?.rank} </span>
						<div className={styles.rankImage} style={{ backgroundImage: `url(${ranky})`, }}></div>
                    </div>
                </div>
                <div className={styles.containerRight}>
                    <div className={styles.name}>
                        <div className={styles.nameTitle}>Name</div>
                        <div className={styles.nameContent}>{session?.user?.name}</div>
                    </div>
                    <div className={styles.username}>
                        <div className={styles.usernameTitle}>username</div>
                        <div className={styles.usernameContent}>{session?.user?.username}</div>
                    </div>
                    <div className={styles.email}>
                        <div className={styles.emailTitle}>Email</div>
                        <div className={styles.emailContent}>{session?.user?.email}</div>
                    </div>
                    <div className={styles.ratio}>
                        <div className={styles.ratioTitle}>Score</div>
                        <div className={styles.ratioContent}>{session?.user?.score}</div>
                    </div>
                    <div className={styles.enable2fa}>
                        <div className={styles.enable2faTitle}>2FA</div>
                        <div className={styles.enable2faContent}>{session?.user?.enable2FA ? "On" : "Off"}</div>
                    </div>
                    <div className={styles.status}>
                        <div className={styles.statusTitle}>Rank</div>
                        <div className={styles.statusContent}>{session?.user?.rank}</div>
                    </div>
                    <Link href='/editpage'>
                    <div className={styles.buttonField}>
                        <div className={styles.editButton}>Edit</div>
                    </div>
                    </Link>
                </div>
            </div>
        </div>
    )

}
export default Profile;