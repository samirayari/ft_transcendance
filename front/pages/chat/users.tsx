import axios from 'axios'
import type { NextPage } from 'next'
import { getSession } from 'next-auth/react'
import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../styles/chat/Users.module.css'
import Roombubble from './roombubble'
import { setMessagesList, setPrivateRoomInfos, setRoomInfos, updateMessages, updateRooms } from './store'
import Userbubble from './userbubble'

const Users: NextPage<any> = (props) => {

    const dispatch = useDispatch();
    const updateRoom = useSelector((state: any) => state.updateRooms);
    const [usersList, setUsersList] = useState([]);

    const getRooms = () => {
        axios.get("http://localhost:4000/chat/room/all")
            .then((param) => {
                setUsersList(param.data.response);
            })
            .catch((error) => {
                console.log(error);
            })
    }


    useEffect(() => {
        getRooms()
    }, [updateRoom])

    useEffect(() => {
        props.socket.off("privateRoom");
        props.socket.on("privateRoom", (e: any) => {
            setTimeout(() => {
                dispatch(updateRooms());
            }, 300);
        })
    }, [])

    const displayFirstRoom = (() => {
        axios.get("http://localhost:4000/chat/room/all")
            .then(async (param: any) => {
                if (param != undefined) {
                    const session = await getSession()
                    if (props.activ) {
                        for (let i = 0; i < param.data.response.length; i++) {
                            if (param.data.response[i].messagetype == "false") {
                                const url = "http://localhost:4000/chat/room/" + param.data.response[i].id;
                                axios.get(url)
                                    .then((res: any) => {
                                        dispatch(setRoomInfos({ id: res.data.response[0].id, roomname: res.data.response[0].name, infos: res.data.response }))
                                    })
                                    .catch((error: any) => {
                                        console.log(error);
                                    })

                                axios.get("http://localhost:4000/chat/room/messages/" + param.data.response[i].id)
                                    .then((msg: any) => {
                                        param.data.response[i].participants.forEach((part: any) => {
                                            if (part.user.id == session?.user?.id) {
                                                if (part.join) {

                                                    dispatch(setMessagesList(msg))
                                                    dispatch(updateMessages());
                                                }
                                            }
                                        })
                                    })
                                    .catch((error: any) => {
                                        console.log(error);
                                    })
                                return;
                            }
                        }
                    }
                }
            }
            )
            .catch((error: any) => {
                console.log(error);
            })
    })

    useEffect(() => {
        displayFirstRoom()
    }, [props.activ])

    return (
        <div className={styles.usersContent}>
            <div className={styles.chat}>
                Chat
            </div>
            <div className={styles.privatechannel} >
                <div className={props.privClass} id="private" onClick={props.handleprivate}>
                    Private
                </div>
                <div className={props.chanClass} onClick={props.handleprivate}>
                    Rooms
                </div>
            </div>
            <div className={styles.usersContainer}>
                {!props.activ && usersList.map((data: any, id: number) => (
                    data.messagetype == "privateRoom" && <Userbubble data={data} key={id} />
                )) || <Roombubble setReceiv={props.setReceiv} setIsMute={props.setIsMute} socket={props.socket} />
                }
            </div>
        </div>
    )
}

export default Users