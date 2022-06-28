import type { GetServerSideProps, NextPage } from 'next'
import MainPage from './mainpage'
import { requireAuthentification } from './api/auth/requireAuthentification'
import Enable from './login/enable'
import { redirectAuthentification } from './api/auth/redirectAuthentification'

const Enablepage: NextPage = () => {
  return (
    <Enable/>
  )
}

export default Enablepage

// export const getServerSideProps: GetServerSideProps = redirectAuthentification(
//     async (ctx) => {
//       return {
//         props: {},
//       };
//     }
//   );