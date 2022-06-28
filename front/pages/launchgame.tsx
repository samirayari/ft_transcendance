import type { GetServerSideProps, NextPage } from 'next'
import { requireAuthentification } from './api/auth/requireAuthentification'
import Launcher from './game/launcher'
import MainPage from './mainpage'
import { store } from './game/gamestore'
import { Provider } from 'react-redux'

const Launchpage: NextPage = () => {
  return (
    <Provider store={store}>
      <MainPage component={<Launcher/>}/>
    </Provider>
  )
}

export default Launchpage

export const getServerSideProps: GetServerSideProps = requireAuthentification(
    async (ctx) => {
      return {
        props: {},
      };
    }
  );