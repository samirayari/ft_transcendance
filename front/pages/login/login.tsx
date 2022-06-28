import type { NextPage } from 'next'
import styles from '../../styles/login/Login.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { getSession, signIn, useSession } from 'next-auth/react'
import router from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Login: NextPage = () => {
  
  const [responseMessage, setResponseMessage] = useState(<></>)
  
  const func = async () => {
    const session = await getSession();
    if (!session){
      return
    }
      if(session?.user?.isFirst == false){
        if (session?.user?.enable2FA){
          router.push("/enablepage")
        }
        else{
          await axios.post("http://localhost:4000/user/setAuth", {
            id: session?.user?.id,
          })
          router.push("/mainpage")
        }
      }
      else {
        await axios.post("http://localhost:4000/user/setAuth", {
          id: session?.user?.id,
        })
        router.push("/editpage")
      }
  }
  useEffect(() => {
    func()
  }, [])
  
  const signInCredentials = async (event:any) => {
    event.preventDefault();
    const {email, password} = event.target.elements;
    const response: any = await signIn("credentials", {
      email: email.value,
      password: password.value,
      callbackUrl: "http://localhost:3000/mainpage",
      redirect: false,
    })
    if (response?.error){
      setResponseMessage(<div className={styles.resMessage}>Wrong Login/Password !</div>)
    }
    else{
        axios.get("http://localhost:4000/user/findUserWithEmail/" + email.value)
        .then((param) => {
          const user = param.data.response
          if (!user.isFirst){
            if (user.enable2FA){
              router.push("/enablepage")
            }
            else{
              axios.post("http://localhost:4000/user/setAuth", {
                id: user.id,
              }).then(() => {

              })
              router.push(response.url)
            }
          }
          else {
            router.push("/editpage")
            axios.post("http://localhost:4000/user/setAuth", {
              id: user.id,
            }).then(() => {

            })
          }
        })
        .catch((error) => {
            console.log(error);
        }  )
    }
  }
  
  const loginWithFortyTwo = async () => {
    const response =  await signIn('42-school', {
      callbackUrl: "http://localhost:3000/mainpage",
    })
  }

  return (
  <div className={styles.allScreen}>
    <div className={styles.leftPart}>
      <div className={styles.formWrap}>
        <h1>Login</h1>
        {responseMessage}
        <form className={styles.form} onSubmit={signInCredentials}>
          <span className={styles.signUp}>
            <span>Not a member ? </span>
            <Link href="/registerpage">Sign-up now !</Link>
          </span>
          <label htmlFor="email">Email</label> 
          <input type="text" id="email"></input>
          <label htmlFor="password">Password</label> 
          <input type="password" id="password"></input>
          <button className={styles.signIn}  type="submit">Sign In</button>
        </form>
        <div className={styles.trait}>
          <span className={styles.or}>Or</span>
        </div>
        <div className={styles.ftContainer}>
          <div className={styles.icon}>
            <Image src="/icone/42.svg" width={40} height={40} alt="42"></Image>
          </div>
          <div className={styles.ftButton} onClick={loginWithFortyTwo}>Login with 42</div>
        </div>
      </div>
    </div>
    <div className={styles.rightPart}>
      <Image src="/cat_pong.gif" layout="responsive" width={100} height={100} alt="Catpong" priority ></Image>
    </div>
  </div>
  )
}

export default Login
