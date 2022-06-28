import type { GetServerSideProps, NextPage } from 'next'
import MainPage from './mainpage'
import { requireAuthentification } from './api/auth/requireAuthentification'
import Profile from './login/profile'

const Profilepage: NextPage = () => {
  return (
    <MainPage component={<Profile/>}/>
  )
}

export default Profilepage

export const getServerSideProps: GetServerSideProps = requireAuthentification(
    async (ctx) => {
      return {
        props: {},
      };
    }
  );