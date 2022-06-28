import type { NextPage } from 'next'
import styles from '../../styles/login/Register.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import router from 'next/router'


const Register: NextPage = () => {

    const [responseMessage, setResponseMessage] = useState(<></>)

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const { name, username, email, password } = event.target.elements

        axios.post("http://localhost:4000/user/register", {
            name: name.value,
            username: username.value,
            email: email.value,
            password: password.value
        }).then((res:any) => {
            if (res.data.response.type == 'error') {
                setResponseMessage(<div className={styles.errorMessage}>{res.data.response.string}</div>)
            }
            else {
                setResponseMessage(<div className={styles.resMessage}>{res.data.message}</div>)
                event.target.reset();
                setTimeout(() => {
                    router.push("loginpage")
                }, 1500)
            }
        }).catch((e:any) => {
            console.log(e)
        })
    }

    const signUpWithFortyTwo = async () => {
        const response = await signIn('42-school', {
            callbackUrl: "http://localhost:3000/mainpage",
        })
    }

    return (
        <div className={styles.allScreen}>
            <div className={styles.leftPart}>
                <Image src="/table.jpeg" layout="responsive" width={100} height={100} alt="Table"></Image>
            </div>
            <div className={styles.rightPart}>
                <form className={styles.formWrap} onSubmit={handleSubmit}>
                    <div>
                        <h1>Sign Up</h1>
                        {responseMessage != <></> && responseMessage}
                    </div>
                    <div className={styles.usernameWrap}>
                        <div className={styles.nameInput}>
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name"></input>
                        </div>
                        <div className={styles.userInput}>
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" name="username"></input>
                        </div>
                    </div>
                    <div className={styles.emailInput}>
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" name="email"></input>
                    </div>
                    <div className={styles.passwordInput}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password"></input>
                    </div>
                    <div className={styles.spaceRegister}>
                        <button className={styles.createAccount} type="submit">Create Account</button>
                        <div className={styles.signUpWith42} onClick={signUpWithFortyTwo}>
                            <span>Sign Up w/</span>
                            <Image className={styles.imageft} src="/icone/42.svg" width={40} height={40} alt="42"></Image></div>
                    </div>
                    <div className={styles.already}>
                        <p>Already a member?
                            <Link href="/loginpage"> Sign in</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register