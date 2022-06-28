import type { NextPage } from 'next'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import styles from '../../styles/chat/Users.module.css'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import router from 'next/router'
import Alert from 'react-bootstrap/esm/Alert'
import { useDispatch } from 'react-redux'
import { updateRooms } from './store'

const Roomform: NextPage<any> = (props:any) => {
    
    let i = 0;
    let roomStatus = "public";
    const [privateRoom, setPrivateRoom] = useState(false);
    const [roomMode, setRoomMode] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [roomPass, setRoomPass] = useState("");
    const { data: session } = useSession();
    const dispatch = useDispatch();

    const handleSubmit = (event:any) => {
        if (roomName.length > 3) {
            if (roomPass)
                roomStatus = "private";
            axios.post("http://localhost:4000/chat/room/create",
            {userid:session!.user!.id, name:roomName, visibility:roomMode, messagetype:"false", status:roomStatus, password:roomPass})
            .then((param:any) =>  {
                    if (!param.data.response)
                        alert("room name already exist");
                    else if (param.data.response.passError) {
                        alert(param.data.response.passError);
                    }
                    else
                        dispatch(updateRooms());
                    props.setForm(!props.form);
                }).catch((err:any) => { });
            }
        else {
            alert("The Roomname must exceed 3 characters.")
        }
    }

    return (
        <div className={styles.formbox}>
            <h2>Create your Room!</h2>
                <div className={styles.namebox}>
                    <input type="text" onChange={(e) => setRoomName(e.target.value)}/>
                    <label>Name</label>
                </div>
                <div className={!privateRoom ? styles.passbox : `${styles.passbox} ${styles.passboxactive}`}>
                    <input type="password" onChange={(e) => setRoomPass(e.target.value)}/>
                    <label>Password</label>
                </div>
                <div className={styles.privatebox}>
                    <label className={styles.private}>Private</label>                    
                    <label className={styles.switch}  >
                        <input type="checkbox"/>
                        <span className={styles.slider} onClick={() => {setPrivateRoom(!privateRoom);}} id="slider" ></span>
                    </label>
                </div>
                <div className={styles.invisiblebox}>
                    <div className={styles.invisible}>Invisible</div>  
                    <label className={styles.switch}>
                        <input type="checkbox"/>
                        <span className={styles.slider} onClick={() => {setRoomMode(!roomMode);}} ></span>
                    </label>
                </div>
                <a href="#" id="submit" onClick={handleSubmit}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Submit
                </a>
        </div>
  )
}

export default Roomform