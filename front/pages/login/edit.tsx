import styles from '../../styles/login/Edit.module.css'
import Image from 'next/image'
import axios from 'axios'
import { useEffect, useState } from 'react';
import Typewriter from 'typewriter-effect';
import { getSession, useSession } from 'next-auth/react';
const Edit = () => {

    const [enableParams, setEnableParams] = useState(false);
    const [image, setImage] = useState<any>(null);
    const { data: session } = useSession();
    const [createObjectURL, setCreateObjectURL] = useState("");
    const [rightPartCode, setRightPartCode] = useState(<></>)
    const [enableToggle, setEnableToggle] = useState(<></>)

    useEffect(() => {
        funcEnable();
    }, [enableToggle])
    
    useEffect(() => {
        setCreateObjectURL(session?.user?.picture)

    }, [session])


    const funcEnable = async () => {

        const sess = await getSession();
        if (!sess?.user?.enable2FA) {
            setEnableToggle(
                <div className={styles.enableField}>
                    <span>Enable 2FA</span>
                    <div className={styles.enableButton} onClick={handleSwitch}><Image src="/icone/off.svg" width={15} height={15} alt="pencil"></Image></div>
                </div>)
        }
        else {
            setEnableToggle(
                <div className={styles.enableField}>
                    <span>Disable 2FA</span>
                    <div className={styles.disableButton} onClick={handleSwitch}><Image src="/icone/off.svg" width={15} height={15} alt="pencil"></Image> </div>
                </div>)
        }


    }
    const handleSubmit = async (event: any) => {

        event.preventDefault();
        const getter = await getSession()
        const { username, email, password } = event.target.elements
        let file = image;
        const body = new FormData();
        body.append('image', file);

        let idNumber = getter?.user?.id;
        if (idNumber)
            body.append('id', idNumber.toString())
        body.append('username', username.value)
        body.append('email', email.value)
        body.append('password', password.value)
        axios({ method: "post", url: "http://localhost:4000/user/upload", data: body })
            .then((response) => {
                if (response.data.response.error){
                    alert(response.data.response.string)
                }
                else{
                    updateSession()
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleSwitch = async () => {
        enableParams ? setEnableParams(false) : setEnableParams(true)
        const sess = await getSession();

        if (!sess?.user?.enable2FA) {
            const response = await axios.post("http://localhost:4000/user/qrCode", {
                id: session?.user?.id,
            })
            setRightPartCode(<div className={styles.qrcodeClass}>
                <div className={styles.qrContainer}>
                    <span className={styles.titleQR}>Scan your QRCode</span>
                    <img className={styles.imageQR} src={response.data.response}></img>
                </div>
            </div>)

        }
        else {
            const response = await axios.post("http://localhost:4000/user/disable2FA", {
                id: session?.user?.id,
            })
            setRightPartCode(<></>)
        }
    }

    const handleFile = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];

            setImage(i);
            setCreateObjectURL(URL.createObjectURL(i));
        }
    };

    const updateSession = () => {
        const event = new Event("visibilitychange")
        document.dispatchEvent(event)
    }

    const handleUpload = async (event: any) => {
        const body = new FormData();
        body.append("image", image);
        const response = await fetch("http://localhost:4000/user/upload", {
            method: "POST",
            body
        });
    }

    return (
        <div className={styles.allWrap}>
            <div className={styles.leftPart}>
                <div className={styles.container}>
                    <div className={styles.title}>My Profile</div>
                    <div className={styles.pictureBox}>
                        <div className={styles.pictureWrap}>
                            <div className={styles.picture} style={{ backgroundImage: `url(${createObjectURL})`, }}></div>
                            <button className={styles.modifyButton}>
                                <input type="file" name="myImage" onChange={handleFile} className={styles.uploadInput} />
                                <Image src="/icone/pencil.svg" width={20} height={20} alt="pencil"></Image>
                            </button>
                        </div>
                    </div>
                    <div className={styles.formBox}>
                        <form className={styles.formulary} onSubmit={handleSubmit}>
                            <div className={styles.usernameField}>
                                <label htmlFor="username">Username</label>
                                <input type="text" id="username" name="username"></input>
                            </div>
                            <div className={styles.emailField}>
                                <label htmlFor="email">Email</label>
                                <input type="text" id="email" name="email"></input>
                            </div>
                            <div className={styles.passwordField}>
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" name="password"></input>
                            </div>
                            {enableToggle}
                            <div className={styles.applyField}>
                                <button className={styles.applyButton} type="submit">
                                    <span>Apply</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className={styles.rightPart}>
                {rightPartCode != <></> && rightPartCode}
                <div className={styles.typing}>
                    <Typewriter options={{
                        delay: 0.1
                    }}
                        onInit={(typewriter) => {
                            typewriter.typeString(' Pong was the first game developed by Atari.After producing Computer Space, Bushnell decided to form a company to produce more games by licensing ideas to other companies. The first contract was with Bally Manufacturing Corporation for a driving game.Soon after the founding, Bushnell hired Allan Alcorn because of his experience with electrical engineering and computer science; Bushnell and Dabney also had previously worked with him at Ampex. Prior to working at Atari, Alcorn had no experience with video games.Bushnell had originally planned to develop a driving video game, influenced by Chicago Coin\'s Speedway (1969) which at the time was the biggest-selling electro-mechanical game at his amusement arcade.')
                                .callFunction(() => {
                                })
                                .changeDelay(1000)
                                .start();
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
export default Edit;