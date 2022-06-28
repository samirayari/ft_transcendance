import axios from 'axios'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../styles/chat/Channel.module.css'
import { updateRooms } from './store'
import Userban from './userban'
import React, { useRef} from "react";

const Channeltopbar: NextPage<any> = (props:any) => {
    
    let isAdmin = false;
    let isOwner = false;
    const [add, setAdd] = useState(false);
    const [banlist, setBanlist] = useState(true);
    const [editForm, setEditForm] = useState(false);
    const [status, setStatus] = useState(false);
    const [newRoomName, setNewRoomname] = useState("");
    const [newPass, setNewPass] = useState("");
    const room = useSelector((state:any) => state.room);
    const dispatch = useDispatch();
    const banList:any = [];
    const {data : session} = useSession();
  
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);
    
    function useOutsideAlerter(ref:any) {
        useEffect(() => {
          function handleClickOutside(event:any) {
            if (ref.current && !ref.current.contains(event.target)) {
                setAdd(false);
                setBanlist(true);
                setEditForm(false);
            }
          }
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [ref]);
      }

        room.forEach((room:any, id:number) => {
            if (room.roomname != "") {
                const participants = room.infos[0].participants;
                for (var i = 0; i < participants.length; i++) {
                    if (participants[i].ban) {
                        const infos = {id:participants[i].id, username:participants[i].user.username}
                        banList.push(infos);
                    }
                    if (participants[i].user.id == session?.user?.id) {
                        if (participants[i].admin == true)
                            isAdmin = true;
                        if (participants[i].owner == true)
                            isOwner = true;
                    }
                }
            }
        })
    
    const handleSend = async () => {
        if (newRoomName && newRoomName.length <= 3) {
            alert("The Roomname must exceed 3 characters.");
            return ;
        }
        if (newRoomName || newPass || status) {
            const url = "http://localhost:4000/chat/room/edit/"+ room[0].id;
            await axios.post(url, {newName:newRoomName, newPass:newPass, status:status})
            .then((e) => {
                if (e.data.response.passError)
                    alert(e.data.response.passError);
                else
                    dispatch(updateRooms()); 
            })
            .catch((err) =>  {console.log(err); alert("room name already exist");});
            const inputs = Array.from(document.querySelectorAll('input'))
            inputs.forEach((input, i) => { input.value = "" });
            setEditForm(!editForm);
            setNewRoomname("");
            if (status)
                setStatus(!status)
            setNewPass("");
        }
    }
    
    return (
        <>
            <div className={styles.roomBar}>
                {room[0].roomname}
            </div>
            {isAdmin && <div className={styles.options} ref={wrapperRef}>
                <div className={!add ? styles.optsRoom : `${styles.optsRoom} ${styles.optsactive}`} >
                    {isOwner && <div className={styles.editRoomTitle}>
                        Edit your Room
                        <span className={styles.arrowIcone} onClick={() => { setEditForm(!editForm); setBanlist(true)}}>
                            {!editForm ? <Image src="/icone/arrowdown.svg" width={13} height={13}/> : 
                                <Image src="/icone/arrowup.svg" width={13} height={13}/>}
                        </span>
                    </div>}
                    <div className={styles.banListTitle} >
                        Show the Banlist
                        <span className={styles.arrowIcone} onClick={() => { setBanlist(!banlist); setEditForm(false)}}>
                            {banlist ? <Image src="/icone/arrowdown.svg" width={13} height={13}/> : 
                                    <Image src="/icone/arrowup.svg" width={13} height={13}/>}
                        </span>
                    </div>
                    <div className={banlist ? styles.banList : `${styles.banList} ${styles.banListactive}`}>
                        <div className={styles.userBanContainer}>
                            {banList.map((user:any, id:number) => (
                                <Userban user={user} key={id}/> ))} 
                        </div>
                    </div>
                    <div className={!editForm ? styles.editRoom : `${styles.editRoom} ${styles.editRoomActive}`}>
                        <div className={styles.namePassword}>
                            <div className={styles.namebox}>
                                <input type="text"  maxLength={7} onChange={(e) => setNewRoomname(e.target.value)}/>
                                <label>Name</label>
                            </div>
                            {(room[0].infos[0].status == "private" && !status|| room[0].infos[0].status == "public" && status) && <div className={styles.namebox}>
                                <input type="password" minLength={6} maxLength={12} onChange={(e) => setNewPass(e.target.value)}/>
                                <label>Password</label>
                            </div>}
                        </div>
                        <span className={styles.separateur}></span>
                        <div className={styles.enableDesable}>
                            <div className={styles.visible}>
                                {room[0].infos[0].status == "private" ? "Public" : "Private"}
                                <label className={styles.switch}>
                                    <input type="checkbox"/>
                                    <span className={styles.slider} onClick={(e) => {setStatus(!status)}}></span>
                                </label>
                            </div>
                            <div className={styles.btn}>
                                <span onClick={handleSend}>Send</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.image} onClick={() => setAdd(!add)}>
                    <Image src="/icone/menu.svg" width={25} height={25}/>
                </div>
            </div>}
        </>
  )
}

export default Channeltopbar