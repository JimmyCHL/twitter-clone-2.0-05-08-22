import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const AnyComponent = Component as any
  return (
    <SessionProvider session={session}>
      <AnyComponent {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
