import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { useEffect, useState } from 'react';

function App({ Component, pageProps }: AppProps) {

  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(null)
  }, []);

  if (pageProps.protected && !user) {
    return (
      <div>Loading...</div>
    )
  }

  return (
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
  )
}
export default App