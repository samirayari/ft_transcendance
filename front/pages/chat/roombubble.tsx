import type { NextPage } from 'next'
import Image from 'next/image'
import styles from '../../styles/chat/Users.module.css'
import { useEffect, useState } from 'react'
import Roomform from './roomform'
import Roomlist from './roomlist'

const Roombubble: NextPage<any> = (props) => {
    
    const [form, setForm] = useState(false);
    
    return (
        <div className={styles.Roombubble}>
            {form ? <Roomform setForm={setForm} form={form} socket={props.socket}/> 
                    : <Roomlist setReceiv={props.setReceiv} socket={props.socket} setIsMute={props.setIsMute} />}
            <div className={styles.topBar}>
                <div className={styles.addRoomBtn} id="add" onClick={() => setForm(!form)}>
                    <Image src="/icone/plus-btn.svg" width={14} height={14}/>
                    <span>
                        Create New
                    </span> 
                </div>
            </div>
        </div> 
  )
}

export default Roombubble