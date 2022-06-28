import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from '../../styles/chat/Channel.module.css'

const Messageleft: NextPage<any> = (props) => {

    const blockInfos = useSelector((state:any) => state.blockInfos[0]);
    const updateBlockInfos = useSelector((state:any) => state.updateBlockInfos);
    const [blockedName, setBlockedName] = useState("");
    const [userWhoBlock, setUserWhoBlock] = useState(0);

    useEffect(() => {
        if (blockInfos) {
            blockInfos.map((infos:any, id:number) => {
                if (infos.userToBlock.username == props.username) {
                    setBlockedName(infos.userToBlock.username);
                    setUserWhoBlock(infos.userWhoBlock);
                }
            })
        }
    }, [updateBlockInfos])


    return (
        (props.sessionId == userWhoBlock && props.username != blockedName || props.sessionId != userWhoBlock) && 
        <div className={styles.messageLeft}>
            <div className={styles.profileImg} style={{backgroundImage: `url(${props.image})`}}></div>
            <div className={styles.textLeft}>
                {props.message}
                <div className={styles.timeLeft}>
                    {props.date}
                </div>
            </div>
        </div>
  )
}

export default Messageleft