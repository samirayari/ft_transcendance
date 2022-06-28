import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import styles from '../../styles/chat/Chat.module.css'
import style from '../../styles/chat/Users.module.css'
import Users from './users'
import Channel from './channel'
import Profile from './profile'
import { io } from 'socket.io-client'
import { getSession, useSession } from 'next-auth/react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import Moment from 'moment';
import axios from 'axios'
import { setBlockInfos, setMessagesList, setPrivateRoomInfos, setRoomInfos, updateBlockInfos, updateRooms } from './store'
import { useRouter } from 'next/router'

const socket = io("http://localhost:4001", {transports: ['websocket']});
let msg = false;

const Chat: NextPage = (props:any) => {
    
    const [active, setActive] = useState(false);
    const [message, setMessage] = useState("");
    const {data: session} = useSession();
    const room = useSelector((state:any) => state.room)
    const messages = useSelector((state:any) => state.messages[0].data);
    const updateMessages = useSelector((state:any) => state.updateMessages);
    const [isMute, setIsMute] = useState(false);
    const [receiv, setReceiv] = useState([]);
    const updateBlockInfo = useSelector((state:any) => state.updateBlockInfos);
    const privateRoom = useSelector((state:any) => state.privateRoom);
    const dispatch = useDispatch();
    const router = useRouter();
    const data = router.query;
   
    useEffect(() => {
        const sendMessage = async () => {
            if (data.id) {
                const sess = await getSession();
                const sessionId = sess?.user?.id;
                socket.emit("privateRoom", {sessionId:sessionId, userId:data.id, type:"private"});
            }
        }
        sendMessage();
    }, [data])
    
    const handleSend = async () => {
        if (message) {
            if (room[0].infos[0] != undefined) {
                room[0].infos[0].participants.forEach((part:any, id:number) => {
                    if (part.user.id == session?.user?.id) {
                        if (part.mute || isMute) {
                            alert("You are muted from this Room.")
                            return ;
                        }
                        if (part.ban) {
                            alert("You are ban from this Room.")
                            return;
                        }
                        if (!part.join) {
                            return ;
                        }
                        else {
                            const currentDate = Moment(Moment()).format('MMMM Do , h:mm a')
                            socket.emit("msgToServer", {message:message, room:room[0].id, image:session?.user?.picture, username:session?.user?.username, date:currentDate});
                        }
                    }
                })
            }
            else if (privateRoom[0].id != -1) {
                const currentDate = Moment(Moment()).format('MMMM Do , h:mm a')
                socket.emit("msgToServer", {message:message, room:privateRoom[0].id, image:session?.user?.picture, username:session?.user?.username, date:currentDate});
            }
        }
    }
    
    useEffect(() => {
        const url = "http://localhost:4000/user/getBlockList/";
        axios.get(url)
        .then((param:any) => {
                dispatch(setBlockInfos(param.data));
        })
        .catch((error:any) => {
            console.log(error);
        }  )

    }, [updateBlockInfo])

    useEffect(() => {
        socket.off("msgToClient");
        socket.on("msgToClient", (e:any) => {
            axios.get("http://localhost:4000/chat/room/" + e.room)
            .then( async (param:any) => {
                const sess = await getSession()
                param.data.response[0].participants.forEach((part:any, id:number) => {
                    if (part.user.id == sess?.user?.id) {
                        if (part.join) {
                            if (e.room == room[0].id || e.room == privateRoom[0].id) {  
                                const info:any = {username:e.username, img:e.image, message:e.message, date:e.date}
                                let data:any = [...receiv];
                                data.push(info);
                                msg = true;
                                setReceiv(data);
                                dispatch(updateBlockInfos());
                                return ;
                            }
                        }
                    }   
                })   
            })
            .catch((error:any) => {
                console.log(error);
            }  )
        })
    }, [receiv])
    
    useEffect(() => {
        socket.off("mute");
        socket.on("mute", (e:any) => {
            if (session != undefined) {
                if (session?.user?.id == e.user.id && e.mute)
                    setIsMute(true);
            }
        })
    }, [])

    useEffect(() => {
        if (messages != undefined && msg == false) {
            setReceiv(messages.response);
        }
    }, [messages])

    useEffect(() => {
        if (messages != undefined)
            setReceiv(messages.response);
    }, [updateMessages])

    const handlePrivate = (event:any) => {
        if (event.target.id === "private") {
            dispatch(setRoomInfos({id:-1, roomname:"", infos:[]}));
            setReceiv([]);
            setActive(false);
        }
        else {
            dispatch(setPrivateRoomInfos({id:-1, userId:"", name:"", username:"", image:"", rank:""}));
            setReceiv([]);
            setActive(true);
        }
    }

    useEffect(() => {
        setReceiv([]);
        dispatch(setRoomInfos({id:-1, roomname:"", infos:[]}))
    }, [])

    useEffect(() => {
        socket.off("admin");
        socket.on("admin", (e:any) => {
            if (e) {

                if (e[0].id == room[0].id) {
                    const url = "http://localhost:4000/chat/room/" + e[0].id;
                    axios.get(url)
                    .then((param:any) => {
                        setTimeout(() => {
                            dispatch(setRoomInfos({id:e[0].id, roomname:e[0].name, infos:param.data.response}))
                        }, 300);
                    }).catch((er) => console.log(er))           
                }
            }
        })
    }, [room])

    var privateClass = active ? `${style.section}` : `${style.section} ${style.active}`;
    var channelClass = !active ? `${style.section}` : `${style.section} ${style.active}`;
    
    return (
        <div className={styles.chatContent}>
            <div className={`${styles.users} ${styles.disable}`}>
                <Users privClass={privateClass} chanClass={channelClass} handleprivate={handlePrivate} activ={active}
                     setIsMute={setIsMute} receiv={receiv} setReceiv={setReceiv} socket={socket}/>
            </div>
            <div className={`${styles.chat} ${styles.enable}`}>
                <Channel activ={active} setMessage={setMessage} handleSend={handleSend} receiv={receiv} /> 
            </div>
            <div className={styles.profile}>
                <Profile socket={socket} active={active} setActive={setActive} />
            </div>
        </div>
  )
}

export default Chat
