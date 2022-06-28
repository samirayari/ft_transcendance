import type { NextPage } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../styles/chat/Profile.module.css'
import User from './user'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { setRoomInfos } from './store'

const Roomusers: NextPage<any> = (props:any) => {

    const participantsLst:any = [];
    const room = useSelector((state:any) => state.room)
    const {data : session} = useSession();
    const [participantsList, setParticipantsList] = useState([]);
    const [admin, setAdmin] = useState(false);
    const [owner, setOwner] = useState(false);
    const [join, setJoin] = useState(false);
    const dispatch = useDispatch();

    const getPartInfos = () => {
        room.forEach((room:any, id:number) => {
            if (room.roomname != "") {
                const participants = room.infos[0].participants;
                for (var i = 0; i < participants.length; i++) {
                    const participantsInfos = {image:participants[i].user.picture, username:participants[i].user.username, id:participants[i].id, roomid: room.infos[0].id, isOwner:participants[i].owner, 
                        isAdmin:participants[i].admin, isJoin:participants[i].join, isBan:participants[i].ban, isMuted:participants[i].mute, isBlocked:participants[i].block
                            , roomId:room.id, userId:participants[i].user.id}
                        participantsLst.push(participantsInfos);
                    }
                }
        })
    
        for (var i = 0; i < participantsLst.length; i++) {
            if (participantsLst[i].username == session?.user?.username) {
                setJoin(true);
                if (participantsLst[i].isAdmin == true)
                    setAdmin(true)
                else
                    setAdmin(false);
                if (participantsLst[i].isOwner == true)
                    setOwner(true);
                else
                    setOwner(false);
            }
        }
        setParticipantsList(participantsLst);
        
    }

    useEffect(() => {
        
        getPartInfos()
    }, [room])

    return (
        <div className={styles.roomusers}>
            <div className={styles.titl}>
                Room Members
            </div>
            {join && participantsList.map((participant:any, id:number) => (
                
                !participant.isBan && participant.isJoin &&
                    <User active={props.active} setActive={props.setActive} key={id} id={id} socket={props.socket} participant={participant} admin={admin} owner={owner}/>))}
            
        </div>
  )
}

export default Roomusers

