import type { GetServerSideProps, NextPage } from 'next'
import Login from './login/login'
import { redirectAuthentification } from './api/auth/redirectAuthentification'

const Loginpage: NextPage = () => {
  return (
    <>
      <Login />
    </>
  )
}

export default Loginpage

export const getServerSideProps: GetServerSideProps = redirectAuthentification(
    async (ctx) => {
      return {
        props: {},
      };
    }
  );