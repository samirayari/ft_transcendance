import type { NextPage } from 'next'
import styles from '../../styles/chat/Channel.module.css'

const Messageright: NextPage<any> = (props) => {
    
    return (
         <div className={styles.messageRight} >
             <div className={styles.textRight}>
                 {props.message}
                 <div className={styles.timeRight}>
                    {props.date}
                 </div>
             </div>
             <div className={styles.profileImg} style={{backgroundImage: `url(${props.image})`}}></div>
         </div>
  )
}

export default Messageright