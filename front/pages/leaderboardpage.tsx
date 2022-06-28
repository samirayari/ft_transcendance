import type { GetServerSideProps, NextPage } from 'next'
import { requireAuthentification } from './api/auth/requireAuthentification'
import LeaderBoard from './game/leaderboard'
import MainPage from './mainpage'

const Leaderboard: NextPage = () => {
  return (
    <MainPage component={<LeaderBoard />} />
  )
}

export default Leaderboard

export const getServerSideProps: GetServerSideProps = requireAuthentification(
  async () => {
    return {
      props: {},
    };
  }
);