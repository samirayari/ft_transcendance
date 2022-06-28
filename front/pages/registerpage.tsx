import type { GetServerSideProps, NextPage } from 'next'
import Register from './login/register'
import { redirectAuthentification } from './api/auth/redirectAuthentification'

const Registerpage: NextPage = () => {
  return (
   <Register/>
  )
}

export default Registerpage

export const getServerSideProps: GetServerSideProps = redirectAuthentification(
    async (ctx) => {
      return {
        props: {},
      };
    }
  );