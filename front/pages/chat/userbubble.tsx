import axios from 'axios'
import type { NextPage } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../styles/chat/Users.module.css'
import { setMessagesList, setPrivateRoomInfos, updateMessages } from './store'

const Userbubble: NextPage<any> = (props:any) => {

    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");
    const [image, setImage] = useState("");
    const [join, setJoin] = useState(false);
    const [userId, setUserId] = useState(0);
    const [rank, setRank] = useState("");
    const dispatch = useDispatch();

    useEffect(()  => {
        const getData = async () => {
            
            const session = await getSession()
            props.data.participants.forEach((part:any) => {
                if (part.user.id != session?.user?.id) {
                    const name = part.user.name.split(" ")[0];
                    setName(name);
                    setUserName(part.user.username);
                    setImage(part.user.picture);
                    setRank(part.user.rank);
                    setUserId(part.user.id);
                }
                if (part.user.id == session?.user?.id)
                    setJoin(true);
            })
        }
        getData();
    },[])

    const handlePrivateRoom = () => {
        dispatch(setPrivateRoomInfos({id:props.data.id, userId:userId, name:name, username:userName, image:image, rank:rank}));
        axios.get("http://localhost:4000/chat/room/messages/" + props.data.id)
        .then((param:any) => {
            dispatch(setMessagesList(param))
            dispatch(updateMessages());
        })
        .catch((error:any) => {
            console.log(error);
        }  )
    }

    return ( 
        join && <div className={styles.userBubble} onClick={handlePrivateRoom}>
            <div className={styles.profileImg} style={{backgroundImage: `url(${image})`}} />
            <div className={styles.name}>
                <div>
                    <span>{name}</span>
                    <span>{userName}</span>
                </div>
            </div>
        </div>
        
        
  )
}

export default Userbubble
