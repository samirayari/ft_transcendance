import type { GetServerSideProps, NextPage } from 'next'
import { requireAuthentification } from './api/auth/requireAuthentification'
import Game from './game/game'
import MainPage from './mainpage'
import { store } from './game/gamestore'
import { Provider } from 'react-redux'

const Gamepage: NextPage = () => {
  return (
    <Provider store={store}>
      <MainPage component={<Game />} />
    </Provider>
  )
}

export default Gamepage

export const getServerSideProps: GetServerSideProps = requireAuthentification(
  async () => {
    return {
      props: {},
    };
  }
);