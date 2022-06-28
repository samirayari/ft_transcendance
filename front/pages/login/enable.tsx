import styles from '../../styles/login/Enable.module.css'
import Image from 'next/image'
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import axios from 'axios';
const Enable = () => {

    const router = useRouter();
    const {data: session} = useSession();
    const [error, setError] = useState(<></>); 

    const handleSubmit = (event:any) => {
        event.preventDefault();
        const code = event.target.elements.code.value;
        const response = axios.post("http://localhost:4000/user/checkCode", {
            id : session?.user?.id,
            code : code,
        }).then((response) => {
            if(response.data.response) {
                axios.post("http://localhost:4000/user/setAuth", {
                id: session?.user?.id,
                }).then(() => {
                    router.push("/mainpage")
                })
            }
            else [
                setError(<div className={styles.errorMessage}>
                    Wrong code, try again !
                </div>)
            ]
        })
    }

    const handleCancel = () => {
        signOut()
    }
    return (
        <div className={styles.allwrap}>
            <div className={styles.container}>
                <div className={styles.logo}>
				    <Image src= "/icone/shield.svg" width={150} height={150} alt="pencil"></Image> 
                </div>
                <div className={styles.title}>
                    <span>
                        Authenticate Your Account
                    </span>
                    {error}
                </div>
                <div className={styles.form}>
                    {/* <input type="password" className={styles.inputOne}></input> */}
                    <form className={styles.inputWrap} onSubmit={handleSubmit}>
                        <input className={styles.inputOne} type="number" id="code" name="code" />
                        <div className={styles.buttonWrap}>
                            <div className={styles.buttonBack} onClick={handleCancel}>
                                Cancel
                            </div>
                            <button className={styles.buttonSubmit} type="submit">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Enable;