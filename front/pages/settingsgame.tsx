import type { NextPage } from 'next'
import MainPage from './mainpage'
import Settings from './game/settings'

const SettingsGame: NextPage = () => {
  return (
    <MainPage component={<Settings/>}/>
  )
}

export default SettingsGame