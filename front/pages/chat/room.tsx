
import axios from 'axios'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../styles/chat/Users.module.css'
import Join from './join'
import Quit from './quit'
import {  setMessagesList, setRoomInfos, updateMessages } from './store'

const Room: NextPage<any> = (props) => {
    
    const [isJoin, setIsjoin] = useState(props.isJoined);
    const [pass, setPass] = useState("");
    const [passBox, setPassBox] = useState(false);
    const { data: session } = useSession();
    const dispatch = useDispatch();
    const room = useSelector((state:any) => state.room)
    const [update, setUpdate] = useState(false)
    const [isBan, setIsBan] = useState(false);
    const [id, setId] = useState(props.id);
    const updateRoom = useSelector((state:any) => state.updateRooms)
    
    const getRoomInfos = () => {
        const url = "http://localhost:4000/chat/room/" + id;
        axios.get(url)
        .then((param:any) => {
            props.setIsMute(false);
            dispatch(setRoomInfos({id:id, roomname:props.name, infos:param.data.response}))
        })
        .catch((error:any) => {
            console.log(error);
        }  )
        if (!isJoin) {
            props.setReceiv([])
            return;
        }
        axios.get("http://localhost:4000/chat/room/messages/" + id)
        .then((param:any) => {
            dispatch(setMessagesList(param))
            dispatch(updateMessages());
        })
        .catch((error:any) => {
            console.log(error);
        }  )
    }

    useEffect(() => {
        if (id == room[0].id)
            getRoomInfos()
    }, [update, updateRoom])

    useEffect(() => {
        setIsjoin(props.isJoined);
    }, [updateRoom])
    
    const handleclikQuitJoin = () => {
            if (isJoin)
                setIsjoin(!isJoin);
    }

    const handleSendPass = () => {
        const url = "http://localhost:4000/chat/room/checkpass";
        axios.post(url, {id:id, password:pass})
        .then((param:any) => {
            if (param.data.response == true) {
                if (isBan == true)
                    alert("You have been banned from this room!")
                else {
                    const url = "http://localhost:4000/chat/room/join/"+ id;
                    axios.post(url, {userid:session?.user?.id})
                    .then(() => setUpdate(!update))
                    .catch((err:any) => console.log(err));
                    setIsjoin(!isJoin);
                    setPassBox(!passBox);
                }
            }
            else {
                alert("Wrong password!");
                setIsjoin(false);
            }
        }).catch((error:any) => {console.log(error)})
    }

    useEffect(() => {
      const url = "http://localhost:4000/chat/room/" + props.id;
      axios.get(url)
      .then((param:any) => {
          param.data.response[0].participants.forEach((part:any, id:number) => {
              if (part.user.id == session?.user?.id) {
                  if (part.join)
                    setIsjoin(true);
                  else
                    setIsjoin(false);  
                  if (part.ban == true)
                      setIsBan(true);
                  else
                      setIsBan(false);
              }
          })
      })
      .catch((error:any) => {
          console.log(error);
      }  )

    }, [updateRoom, room])

    return (
        <>
            {(!props.visibility || props.visibility && isJoin) && <div className={styles.channelsList} onClick={(e) => getRoomInfos()} >
                <div className={styles.roomName} >
                    {props.name}
                    {passBox && <div className={styles.passwordBox}>
                        <input type="password" onChange={(e) => setPass(e.target.value)} maxLength={13}/>
                        <div className={styles.OkBtn} onClick={handleSendPass}>ok</div>
                    </div>}
                </div>
                {props.status == "private" && <div className={styles.padlock}>
                    {!isJoin ? <Image src="/icone/lock.svg" width={15} height={15} /> :
                        <Image src="/icone/unlock.svg" width={15} height={15}/>}
                </div> 
                || props.visibility && <div className={styles.padlock}>
                    <Image src="/icone/eye.svg" width={15} height={15} /> 
                </div>}
                <div className={styles.quitBtn} onClick={(e) => handleclikQuitJoin(e)} >
                    {!isJoin ? <Join passBox={passBox} update={update} setUpdate={setUpdate} setIsjoin={setIsjoin} isBan={isBan} setIsBan={setIsBan} setPassBox={setPassBox} id={props.id}/> 
                        : <Quit update={update} setUpdate={setUpdate} id={props.id}/>}
                </div>
            </div>}
        </>
  )
}

export default Room

