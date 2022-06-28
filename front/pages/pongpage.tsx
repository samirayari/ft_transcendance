import type { GetServerSideProps, NextPage } from 'next'
import { Provider } from 'react-redux'
import { requireAuthentification } from './api/auth/requireAuthentification'
import Pong from './game/pong'
import MainPage from './mainpage'
import { store } from './game/gamestore'

const Pongpage: NextPage = () => {
  return (
    <Provider store={store}>
      <MainPage component={<Pong />}/>
    </Provider>
  )
}

export default Pongpage

export const getServerSideProps: GetServerSideProps = requireAuthentification(
  async () => {
    return {
      props: {},
    };
  }
);