import axios from 'axios'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../styles/chat/Users.module.css'
import Room from './room'
import { updateRooms } from './store'

const Roomlist: NextPage<any> = (props) => {
    
    const { data: session} = useSession();
    const [roomList, setRoomList] = useState([]);
    const dispatch = useDispatch();
    const updateRoom = useSelector((state:any) => state.updateRooms)

    const findJoin = (participants:any) => {
        try {
            if (participants.user && participants.user.id == session!.user!.id) {
                if (participants.join == true) 
                    return true
            }
            else
                return false;
        }
        catch (error:any) {
            console.log(error);
        }
    }

    const findAdmin = (participants:any) => {
        try {
            if (participants.user && participants.user.id == session!.user!.id) {
                if (participants.admin == true)
                    return true
            }
            else
                return false;
        }
        catch (error:any) {
            console.log(error);
        }
    }

    const getRooms = () => {
        axios.get("http://localhost:4000/chat/room/all")
        .then((param:any) => {
            setRoomList(param.data.response);
        })
        .catch((error:any) => {
            console.log(error);
        }  )
    }  
    

    useEffect(() => {
        getRooms()
    }, [updateRoom])

    useEffect(() => {
        props.socket.off("ban");
        props.socket.on("ban", (e:any) => {
            if (session != undefined) {
                if (e != undefined) {
                    if (session?.user?.id == e.userId && e.isBan) {
                        alert("You have been banned from this room: " + e.roomname)
                    }
                }
            }
            getRooms();
            setTimeout(() => {
                dispatch(updateRooms());
            }, 300);
        })

    }, [])

    return (
  
        <div className={styles.wrap}>
            {roomList.map((room:any, id:any) => (
                room.messagetype != "privateRoom" && <Room setReceiv={props.setReceiv} socket={props.socket} key={id} setIsMute={props.setIsMute} id={room.id} name={room.name}
                    status={room.status} visibility={room.visibility}
                        isJoined={room.participants.find((participants:any) => findJoin(participants)) ? true : false}
                            isAdmin={room.participants.find((participants:any) => findAdmin(participants)) ? true : false} />
            ))}
        </div>
      
  )
}

export default Roomlist