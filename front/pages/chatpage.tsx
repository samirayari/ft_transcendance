import type { GetServerSideProps, NextPage } from 'next'
import MainPage from './mainpage'
import Chat from './chat/chat'
import { requireAuthentification } from './api/auth/requireAuthentification'
import { Provider } from 'react-redux'
import { store } from './chat/store'


const Chatpage: NextPage = () => {

  return (
    <Provider store={store}>
      <MainPage component={<Chat />}/>
    </Provider>
  )
}

export default Chatpage

export const getServerSideProps: GetServerSideProps = requireAuthentification(
    async () => {
      return {
        props: {},
      };
    }
  );