import axios from 'axios'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../styles/chat/Channel.module.css'
import { updateRooms } from './store'

const Userban: NextPage<any> = (props) => {

    const id = props.user.id;
    const dispatch = useDispatch();

    const handleDeban = () => {
        axios.post("http://localhost:4000/chat/room/deban/" + id)
        .then((e) => dispatch(updateRooms()))
        .catch((err) => console.log(err));
       
    }
     
    return (
        <div className={styles.userBanContent}>
            <div className={styles.wrap}>
                <span>
                    {props.user.username}
                </span>
                {/* <label></label> */}
            </div>
            <div className={styles.minusIcone} onClick={handleDeban}>
                <Image src="/icone/minus.svg" width={20} height={20} />
            </div>
        </div>
    )
}

export default Userban
