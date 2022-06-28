import type { GetServerSideProps, NextPage } from 'next'
import { requireAuthentification } from './api/auth/requireAuthentification'
import Countdown from './game/countdown'
import MainPage from './mainpage'

const Countdownpage: NextPage = () => {
  return (
    <MainPage component={<Countdown/>}/>
  )
}

export default Countdownpage

export const getServerSideProps: GetServerSideProps = requireAuthentification(
    async (ctx) => {
      return {
        props: {},
      };
    }
  );