import axios from 'axios'
import type { NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../styles/chat/Channel.module.css'
import { updateBlockInfos } from './store'


const Usertopbar: NextPage<any> = (props) => {

    const [add, setAdd] = useState(false);
    const privateRoom = useSelector((state:any) => state.privateRoom);
    const dispatch = useDispatch()
    const [image, setImage] = useState("norank.png");

    const handleBlock = async () => {
        if (privateRoom[0].id != -1) {
            const sess = await getSession()
            const sessionId = sess?.user?.id;
            axios.post("http://localhost:4000/user/block", {
                idSession: sessionId,
                idToBlock : privateRoom[0].userId,
            }).then((e:any) => {
                alert("User blocked.");
                setTimeout(() => {
                    dispatch(updateBlockInfos());
                }, 300);
            }).catch((err:any) =>  console.log(err));
        }
    } 
    
      useEffect(() => {
          if (privateRoom[0].image)
            setImage(privateRoom[0].image);
      }, [privateRoom])

    return (
        <>
      
            <div className={styles.img} style={{backgroundImage: `url(${image})`}} />
            <div className={styles.name}>
                <span id={styles.username}>{privateRoom[0].name}</span>
            </div>
            {/* <div className={styles.options} ref={wrapperRef}>
                <div className={!add ? styles.opts : `${styles.opts} ${styles.optsactive}`} >
                    <div className={styles.block} onClick={handleBlock}>
                        <div>
                            <Image src="/icone/blockuser.svg" width={15} height={15}/>
                        </div>
                        <label style={{padding:"10px"}}>
                            Block {privateRoom[0].name}
                        </label>
                    </div>
                </div>
                <div className={styles.image} onClick={() => setAdd(!add)}>
                    <Image src="/icone/menu.svg" width={25} height={25}/>
                </div>
            </div> */}
        </>
  )
}

export default Usertopbar
