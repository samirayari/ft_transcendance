import axios from 'axios'
import Moment from 'moment'
import type { NextPage } from 'next'
import { getSession, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TimeField from 'react-simple-timefield'
import styles from '../../styles/chat/Profile.module.css'
import { setRoomInfos, updateBlockInfos } from './store'

const User: NextPage<any> = (props) => {

    let blocked;
    const [arrow, setArrow] = useState(false);
    const [toggleAdminIcone, setToggleAdminIcone] = useState(false);
    const [mute, setMute] = useState(props.participant.isMuted);
    const room = useSelector((state:any) => state.room);
    const [isBlock, setIsBlock] = useState(false);
    const dispatch = useDispatch();
    const partId = props.participant.id;
    const userId = props.participant.userId;
    const [time, setTime] = useState("")
    const [timeBox, setTimeBox] = useState(false);
    const router = useRouter();
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    const unmute = () => {
        const currentTime = Moment(Moment()).format('h:mm:s')
        axios.post("http://localhost:4000/chat/room/unmute"
        , {currentTime:currentTime})
        .then()
        .catch((err) => console.log(err));
    }

    useEffect(() => {
        unmute();
    }, [room])

    function useOutsideAlerter(ref:any) {
        useEffect(() => {
          function handleClickOutside(event:any) {
            if (ref.current && !ref.current.contains(event.target)) {
                setArrow(false);
            }
          }
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [ref]);
    }
    
    const handleArrow = () => {
        setArrow(!arrow)
    }
    
    const handleBan = async (e:any) => {
        const sess = await getSession()
        const sessionId = sess?.user?.id;
        props.socket.emit("ban", {user:props.participant, roomname:room[0].roomname, sessionId:sessionId});
        setArrow(false)
    }
    
    const handleBlock = async () => {
        const sess = await getSession()
        const sessionId = sess?.user?.id;
        if (isBlock)
            blocked = false;
        else
            blocked = true;
        axios.post("http://localhost:4000/user/block", {
            idSession: sessionId,
            idToBlock : userId,
            block: blocked,
        }).then((e) => {
            setTimeout(() => {
                dispatch(updateBlockInfos());
            }, 300);
        }).catch((err:any) =>  console.log(err));
        setIsBlock(!isBlock)
        setArrow(false)
    }

    const checkIsBlock = async () => {
        const sess = await getSession()
        const sessionId = sess?.user?.id;
        axios.get("http://localhost:4000/user/getBlockList").then((response) => {
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].userWhoBlock == sessionId && response.data[i].userToBlock.id == userId) {
                    setIsBlock(true)
                    return ;
                }
            }
            setIsBlock(false)
        }).catch((err) => { console.log(err) })
    }

    useEffect(() => {
        checkIsBlock()
    }, [ props.participant.id])

    useEffect(() => {
        if (props.participant.isMuted)
            setMute(true);
        else
            setMute(false);
    }, [props.participant.id])


    const handleMute = () => {
        if (mute) {
            props.socket.emit("mute", {id:partId, isMuted:true});
            setMute(!mute);
        }
        else
            setTimeBox(!timeBox);
    }

    const handleAdmin = () => {
        props.socket.emit("admin", {id:partId, roomid:room[0].id, toggleAdminIcone:toggleAdminIcone});
        setToggleAdminIcone(!toggleAdminIcone)
        setArrow(false)
    }

    const handlePrivateMessage = async () => {
        dispatch(setRoomInfos({id:-1, roomname:"", infos:[]}));
        setArrow(false);
        props.setActive(!props.active);
        const sess = await getSession();
        const sessionId = sess?.user?.id;
        props.socket.emit("privateRoom", {sessionId:sessionId, userId:userId, type:"private"});
    }

    useEffect(() => {
        if (props.owner && props.participant.isAdmin)
            setToggleAdminIcone(!toggleAdminIcone)
        else
            setToggleAdminIcone(false);
    }, [props.participant.id])

    const handleMuteTime = async () => {
        const sess = await getSession()
        const sessionId = sess?.user?.id;
        axios.post("http://localhost:4000/chat/room/participant", {id:partId})
        .then((param:any) => {
            if((!param.data.response.owner && sessionId != param.data.response.user.id) 
                || (!param.data.response.owner && !param.data.response.admin)) {
                const currentTime = Moment(Moment()).format('h:mm:s')
                props.socket.emit("mute", {id:partId, isMuted:false, time:time, currentTime:currentTime});
                setMute(!mute);
                setTimeBox(!timeBox);
            }
            else {
                if (param.data.response.owner)
                    alert(param.data.response.user.username + " is Owner, you can't mute him.")
                else
                    alert("You can't mute yourself.")
                setTimeBox(false);
                setTime("");
            }
        }).catch((err) => console.log(err))
    }

    const inviteToPlay = async () => {
        const sess = await getSession()
        const sessionId = sess?.user?.id;
        if (sessionId != userId) {
            router.push({
                pathname: "/launchgame",
                query: {
                    inviter: true,
                    id: userId,
                }
            }, "launchgame")
        }
    }

    return (
        <>
            <div className={styles.user}>
                <div className={styles.img}>
                    <div className={styles.img}>
                        <div className={styles.userimage} style={{ backgroundImage: `url(${props.participant.image})`, }}>
                        </div>
                        <p>{props.participant.username}</p>
                        {props.participant.isOwner && <div className={styles.status}>Owner</div>
                            || (props.participant.isAdmin && <div className={styles.status}>Admin</div>)}
                    </div>
                </div>
                {timeBox && <div className={styles.muteTime}>
                    <span className={styles.limitTime}>Time limit</span>
                    <TimeField className={styles.Timefield} style={{display:"flex",
                    width:"38px", height:"20px"}} value={time} onChange={(event,value) => setTime(value)}/>
                    <div className={styles.OkBtn} onClick={handleMuteTime}>ok</div> 
                </div>}
                    <div className={styles.arrow} onClick={handleArrow} ref={wrapperRef}>
                        {arrow ? <Image src="/icone/angledroit.svg" width={13} height={13}/>  : <Image src="/icone/anglegauche.svg" width={13} height={13}/>}
                    </div>
                <div className={!arrow ? styles.icones : `${styles.icones} ${styles.iconeshow}`} >
                    <div className={styles.msg} title="Send private message" onClick={handlePrivateMessage}>
                        <Image src="/icone/msg.svg" width={16} height={16}/>
                    </div>
                    {props.admin && <div className={styles.kick} title="Ban" onClick={handleBan}>
                        <Image src="/icone/removeuser.svg" width={16} height={16} />
                    </div>}
                    <div className={styles.kick} title="Block/Deblock" onClick={handleBlock}>
                        {!isBlock ? <Image src="/icone/blockuser.svg" width={16} height={16}/> :
                            <Image src="/icone/deblock.svg" width={16} height={16}/>}

                    </div>
                    {props.admin && <div className={styles.kick} title="Mute" onClick={handleMute}>
                        {!mute ? <Image src="/icone/mute.svg" width={16} height={16}/> :
                            <Image src="/icone/muteoff.svg" width={16} height={16}/>}
                    </div>}
                    {props.owner && <div className={styles.admin} title="Admin" onClick={handleAdmin}>
                        {!toggleAdminIcone ? <Image src="/icone/admin.svg" width={20} height={20}/> 
                            : <Image src="/icone/user.svg" width={16} height={16}/>}
                    </div>}
                    <div className={styles.admin} title="Invit to play" onClick={inviteToPlay}>
                        <Image className={styles.icon} src="/icone/gamepad.svg" width={18} height={18}/ >
                    </div>
                </div>
            </div>
            <div className={styles.trait}></div>
        </>


  )
}

export default User