import axios from 'axios'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import styles from '../../styles/chat/Users.module.css'

const Quit: NextPage<any> = (props) => {

    const { data: session, status } = useSession();
    const dispatch = useDispatch();

    const handleQuit = (e:any) => {
        const url = "http://localhost:4000/chat/room/quit/"+ props.id;
        axios.post(url, {userid:session?.user?.id})
        .then((e) => {props.setUpdate(!props.update);})
        .catch((err) => console.log(err));
    }
    
    return (
        <div className={styles.leave} onClick={(e) => handleQuit(e)}>
            <Image src="/icone/cross.svg" width={23} height={23}/>
        </div>
     
  )
}

export default Quit

