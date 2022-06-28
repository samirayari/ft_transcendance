import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Sidebar.module.css'


const Sidebar: NextPage = () => {
    
    return (
        <div className={styles.sidebarContent}>
            <div className={styles.sidebarTopMenu}>
                <Link href='/mainpage' passHref>
                    <div className={styles.topButton}>
                        <Image src="/icone/maison.svg" width={30} height={30} alt="Home" />
                    </div>
                </Link>
                <Link href='/chatpage' passHref>
                    <div className={styles.topButton}>
                        <Image src="/icone/message.svg" width={30} height={30} alt="Message" />
                    </div>
                </Link>
                <Link href='/gamepage' passHref>
                    <div className={styles.topButton}>
                        <Image src="/icone/fusee.svg" width={30} height={30} alt="Rocket" />
                    </div>
                </Link>
            </div>
            <div className={styles.sidebarBottomMenu}>
                <Link href='/leaderboardpage' passHref>
                    <div className={styles.bottomButton}>
                        <Image src="/icone/trophee.svg" width={30} height={30} alt="Trophy" />
                    </div>
                </Link>
                <Link href='/profilepage' passHref>
                    <div className={styles.bottomButton}>
                        <Image src="/icone/engrenage.svg" width={30} height={30} alt="Settings" />
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Sidebar