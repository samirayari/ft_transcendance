import styles from '../../styles/login/Notif.module.css'
import axios from 'axios';

const Notif = (props: any) => {

    
    const acceptInvit = () => {
		const accept = axios.post("http://localhost:4000/user/statusAddFriend", {
            id: props.friend.id,
            status: "accepted"
        }).then((response) => {
            props.getNotif();
        })
    }

    const refuseInvit = () => {
		const accept = axios.post("http://localhost:4000/user/statusAddFriend", {
            id: props.friend.id,
            status: "decline"
        }).then((response) => {
            props.getNotif();
        })


    }
    return (
        <div className={styles.notifWrap}>
            <div className={styles.pictureProfile}>
                <div className={styles.pictureRaw} style={{ backgroundImage: `url(${props.friend.inviter.picture})`, }}></div>
            </div>
            <div className={styles.nameProfile}>
                <span>{props.friend.inviter.username}</span>
            </div>
            <div className={styles.buttonField}>
                <div className={styles.acceptButton} onClick={acceptInvit}>accept</div>
                <div className={styles.acceptButton} onClick={refuseInvit}>decline</div>
            </div>

        </div>
    )
}
export default Notif;