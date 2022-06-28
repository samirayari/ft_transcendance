import type { GetServerSideProps, NextPage } from 'next'
import MainPage from './mainpage'
import { requireAuthentification } from './api/auth/requireAuthentification'
import ProfileUser from './login/profileUser'

const ProfileUserpage: NextPage = () => {
  return (
    <MainPage component={<ProfileUser/>}/>
  )
}

export default ProfileUserpage

export const getServerSideProps: GetServerSideProps = requireAuthentification(
    async (ctx) => {
      return {
        props: {},
      };
    }
  );