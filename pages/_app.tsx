import type { AppProps } from 'next/app'
import { CSSReset, ChakraProvider } from '@chakra-ui/react'
import theme from '../styles/theme'
import Fonts from '../styles/fonts'
import ErrorBoundary from '../components/error_boundary'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Fonts />
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </ChakraProvider>
  )
}

export default MyApp
