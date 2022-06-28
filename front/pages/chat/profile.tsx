import type { NextPage } from 'next'
import styles from '../../styles/chat/Profile.module.css'
import Roomusers from './roomusers'
import Userprofile from './userprofile'

const Profile: NextPage<any> = (props) => {
    
    return (
        <div className={styles.profileContent}>
            <div className={!props.active ? styles.profile : `${styles.profile} ${styles.hideprofile}`}>
                <div className={styles.text}>Profile</div>
            </div>
            {!props.active ? <Userprofile/> 
                : <Roomusers  active={props.active} setActive={props.setActive} socket={props.socket}/>}
        </div>
  )
}

export default Profile