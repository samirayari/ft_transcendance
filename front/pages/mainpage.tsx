import type { GetServerSideProps, NextPage } from 'next'
import styles from '../styles/Index.module.css'
import { requireAuthentification } from './api/auth/requireAuthentification'
import Homepage from './homepage/homepage'
import Navbar from './navbar'
import Sidebar from './sidebar'

const MainPage: NextPage<any> = (props) => {

  return (
    <div className={styles.container}>
      <div id="nav" className={styles.navBar}>
        <Navbar/>
      </div>
      <div className={styles.sideBar}>
        <Sidebar/>
      </div>
      <div className={styles.content}>
        {!props.component ? <Homepage/> : props.component}
      </div>
    </div>
  )
}

export default MainPage

export const getServerSideProps: GetServerSideProps = requireAuthentification(
    async (ctx) => {
      return {
        props: {},
      };
    }
  );