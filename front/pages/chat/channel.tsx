import type { NextPage } from 'next'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import styles from '../../styles/chat/Channel.module.css'
import Channeltopbar from './channeltopbar'
import Usertopbar from './usertopbar'
import { useSession } from 'next-auth/react'
import Messageleft from './messageleft'
import Messageright from './messageright'


const Channel: NextPage<any> = (props) => {
    
    const { data: session} = useSession();
    const messagesEndRef = useRef<any | HTMLElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth'})
    }

    const handleKeyDown = (e:any) => {
        if  (e.code == "Enter" || e.code == "NumpadEnter" || e.target.id == "send") {
            props.handleSend();
            const inputs = Array.from(document.querySelectorAll('input'));
            inputs.forEach((input) => 
                input.value = ""
            )
            props.setMessage("");
        }
    }
    
    useEffect(() => {
        scrollToBottom();
    }, [props.receiv])

    

    return (
        <div className={styles.channelContent}>
            <div className={styles.userName}>
                {!props.activ ? <Usertopbar/> : <Channeltopbar/>}
            </div>
            <div className={styles.channelBar}>
                <div className={styles.textContainer}>
                    {props.receiv.map((msg:any, id:number) => (
                        msg.username != session?.user?.username ?
                            <Messageleft sessionId={session?.user?.id} key={id} username={msg.username} message={msg.message} date={msg.date} image={msg.img}/> :
                                <Messageright key={id} message={msg.message} date={msg.date} image={msg.img}/>
                        ))}
                        <div ref={messagesEndRef} style={{float:"right"}} />
                </div>
                <div className={styles.messageContent}>
                    <input type="text" maxLength={50} onChange={(e) => {props.setMessage(e.target.value);}} className={styles.message} placeholder="Write a message..." 
                        onKeyDown={e => {handleKeyDown(e)}}></input>
                    <button className={styles.sendBtn}   onClick={e => handleKeyDown(e)} >
                        <Image id="send" src="/icone/send.svg" width={25} height={25}/>
                    </button>
                </div>
            </div>
        </div>
  )
}

export default Channel