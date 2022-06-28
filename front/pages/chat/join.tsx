import axios from 'axios'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../styles/chat/Users.module.css'

const Join: NextPage<any> = (props) => {

    const { data: session } = useSession();
    const room = useSelector((state:any) => state.room)
    const dispatch = useDispatch();
   
    const handleJoin = async (e:any) => {
      
        const url = "http://localhost:4000/chat/room/" + props.id;
        await axios.get(url)
        .then((param) => {
            if (param.data.response[0].status == "private") {
                props.setPassBox(!props.passBox)
            }
            else {
                if (props.isBan == true) {
                    alert("You have been banned from this room!");
                }
                else {
                    const url = "http://localhost:4000/chat/room/join/"+ props.id;
                    axios.post(url, {userid:session?.user?.id})
                    .then(() => {props.setUpdate(!props.update);})
                    .catch((err) => console.log(err));
                }
            }
        })
        .catch((error) => {
            console.log(error);
        }  )

    }

    return (
        <>
            <div className={styles.enter} onClick={(e) => handleJoin(e)}>
                <Image src="/icone/enter2.svg" width={21} height={21}/>
            </div>
        </>
  )
}

export default Join
