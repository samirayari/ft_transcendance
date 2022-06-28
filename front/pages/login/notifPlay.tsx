import styles from '../../styles/login/NotifPlay.module.css'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import router, { useRouter } from 'next/router';

const NotifPlay = (props: any) => {
    const router = useRouter();
    
    const acceptInvit = () => {
        props.setActiveNotif(false)
        router.push({
            pathname: '/launchgame',
            query: {
                roomId: props.notif.roomId,
                invite: true
            }
        })
    }

    const declineInvit = () => {
       props.setActiveNotif(false)
    }

return (
    <div className={styles.allWrap}>
        <div className={styles.request}>{props?.notif?.inviterUser} invited you to play</div>
        <div className={styles.acceptField}>
            <div className={styles.acceptButton} onClick={acceptInvit}>
                <Image src="/icone/accept.svg" width={20} height={20} alt="Cancel"></Image>
            </div>
        </div>
        <div className={styles.declineField}>
            <div className={styles.declineButton} onClick={declineInvit}>
                <Image src="/icone/cancel.svg" width={20} height={20} alt="Cancel"></Image>
            </div>
        </div>
    </div>
    )
}
export default NotifPlay;