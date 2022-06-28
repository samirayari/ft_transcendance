import styles from '../../styles/login/User.module.css'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import router from 'next/router';
import { updateBlockInfos } from '../chat/store';
import { useDispatch } from 'react-redux'

const User = (props: any) => {

    const [arrow, setArrow] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [responseAdd, setResponseAdd] = useState(<></>)
    const [isBlock, setIsBlock] = useState(false);
    const [responseBlock, setResponseBlock] = useState(<></>)
    const dispatch = useDispatch();
    const userId = props.user.id

    const handleAdd = async () => {
        const sess = await getSession()
        const sessionId = sess?.user?.id;
        setIsFriend(true);
        axios.post("http://localhost:4000/user/addFriend", {
            sessionId: sessionId,
            friendToAdd: props.user.id
        }).then(() => {
            props.getAllUser()
            props.getFriends()
        })

    }

    const handleRemove = async () => {
        const sess = await getSession()
        const sessionId = sess?.user?.id;
        setIsFriend(false);
        axios.post("http://localhost:4000/user/isFriend", {
            idSession: sessionId,
            idFriend: props.user.id,
        }).then((response) => {
            if (response.data.response) {
                axios.post("http://localhost:4000/user/removeFriend", {
                    id: response.data.response.id,
                }).then(() => {
                    props.getAllUser()
                    props.getFriends()
                })
            }
        })
    }

    const checkIsFriend = async () => {
        const sess = await getSession()
        const sessionId = sess?.user?.id;
        axios.post("http://localhost:4000/user/isFriend", {
            idSession: sessionId,
            idFriend: props.user.id,
        }).then((response) => {
            if (response.data.response)
                setIsFriend(true)
            else
                setIsFriend(false)
        })

    }

    const handleBlock = async () => {
        setIsBlock(true);
        const sess = await getSession()
        const sessionId = sess?.user?.id;
        axios.post("http://localhost:4000/user/block", {
            idSession: sessionId,
            idToBlock: userId,
            block: true,
        }).then(() => {
            setTimeout(() => {
                dispatch(updateBlockInfos());
            }, 300);
        }).catch((err) => console.log(err));
    }

    const handleDeblock = async () => {
        setIsBlock(false)
        const sess = await getSession()
        const sessionId = sess?.user?.id;
        axios.post("http://localhost:4000/user/block", {
            idSession: sessionId,
            idToBlock: userId,
            block: false,
        }).then(() => {
            setTimeout(() => {
                dispatch(updateBlockInfos());
            }, 300);
        }).catch((err) => console.log(err));
    }

    const checkIsBlock = async () => {
        const sess = await getSession()
        const sessionId = sess?.user?.id;
        axios.get("http://localhost:4000/user/getBlockList").then((response) => {
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].userWhoBlock == sessionId && response.data[i].userToBlock.id == props.user.id) {
                    setIsBlock(true)
                    return ;
                }
            }
            setIsBlock(false)
        }).catch((err) => { console.log(err) })
    }


    useEffect(() => {
        if (isFriend == true) {
            setResponseAdd(
                <div className={styles.cancelButton} onClick={handleRemove} title="cancel">
                    <Image src="/icone/cancel.svg" width={20} height={20} alt="Cancel"></Image>
                </div>
            )
        }
        else {
            setResponseAdd(
                <div className={styles.addedButton} onClick={handleAdd} title="add">
                    <Image src="/icone/added.svg" width={20} height={20} alt="Added"></Image>
                </div>
            )
        }
    }, [isFriend])

    useEffect(() => {
        if (!isBlock) {
            setResponseBlock(
                <div className={styles.blockButton} onClick={handleBlock} title="block">
                    <Image src="/icone/blockuser.svg" width={20} height={20} alt="blockuser"></Image>
                </div>
            )
        }
        else {
            setResponseBlock(
                <div className={styles.deblockButton} onClick={handleDeblock} title="deblock">
                    <Image src="/icone/deblock.svg" width={20} height={20} alt="deblockuser"></Image>
                </div>
            )
        }
    }, [isBlock])

    useEffect(() => {
        checkIsFriend()
        checkIsBlock()
    }, [])

    const goToProfile = () => {
        router.push({
            pathname: '/profileuserpage',
            query: {id : props.user.id},
        })
    }

    const handleSendMessage = () => {
        router.push({
            pathname: '/chatpage',
            query: props.user,
        }, "chatpage")
    }

    return (
        <div className={styles.userRaw}>
            <div className={styles.pictureBox}>
                <div className={styles.pictureRaw} style={{ backgroundImage: `url(${props.user.picture})`, }}></div>
            </div>
            <div className={styles.pictureAndName}>{props.user.username} </div>
            <div className={styles.sendMessage} title="message">
                <div className={styles.sendMessageBtn} onClick={handleSendMessage}>
                    <Image src="/icone/msg.svg" width={20} height={20} ></Image>
                </div>
            </div>
            <div className={styles.profileField} title="profile">
                <div className={styles.profileButton} onClick={goToProfile}>
                    <Image src="/icone/profile.svg" width={20} height={20} alt="profile"></Image>
                </div>
            </div>
            <div className={styles.addedField}>
                {responseAdd}
            </div>
            <div className={styles.blockField}>
                {responseBlock}
            </div>
        </div>
    )
}
export default User;