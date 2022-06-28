import type { GetServerSideProps, NextPage } from 'next'
import MainPage from './mainpage'
import { requireAuthentification } from './api/auth/requireAuthentification'
import Edit from './login/edit'

const Editpage: NextPage = () => {
  return (
    <MainPage component={<Edit/>}/>
  )
}

export default Editpage

export const getServerSideProps: GetServerSideProps = requireAuthentification(
    async (ctx) => {
      return {
        props: {},
      };
    }
  );