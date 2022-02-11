import type { AppProps } from 'next/app'
import { CSSReset, ChakraProvider } from '@chakra-ui/react'
import theme, { GlobalStyles } from '../styles/theme'
import Fonts from '../styles/fonts'
import ErrorBoundary from '../components/error_boundary'
import 'focus-visible/dist/focus-visible'
import { Global } from '@emotion/react'
import { SWRConfig } from 'swr'
import { authenticatedFetcher } from '../lib/auth'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Global styles={GlobalStyles} />
      <CSSReset />
      <Fonts />
      <ErrorBoundary>
        <SWRConfig value={{ fetcher: authenticatedFetcher }}>
          <Component {...pageProps} />
        </SWRConfig>
      </ErrorBoundary>
    </ChakraProvider>
  )
}

export default MyApp
