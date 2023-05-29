import React, { useEffect } from 'react'
import { StyledThemeProvider, dark as libraryThemeDark, light as libraryThemeLight } from 'fiorde-fe-components'
import { ThemeProvider } from 'styled-components'
import { light, dark } from '../application/themes'
import Routes from './components/Routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import startSubscriber from '../application/Subscriber'
import { withErrorBoundary } from 'react-error-boundary'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity
    }
  }
})

const App = (): JSX.Element => {
  const state = useSelector((state: any) => state)
  const { theme } = state.app
  startSubscriber()
  return (
    <QueryClientProvider
      client={queryClient}
    >
    <ThemeProvider theme={theme === 'light' ? light : dark}>
      <ToastContainer
        position="bottom-right"
        theme="colored"
        autoClose={false}
      />
      <StyledThemeProvider theme={theme === 'light' ? libraryThemeLight : libraryThemeDark}>
        <Routes />
      </StyledThemeProvider>
    </ThemeProvider>
    </QueryClientProvider>
  )
}

const ErrorFallback = ({ error }): JSX.Element => {
  useEffect(() => {
    toast.error(error.message)
  }, [])

  return <App/>
}

export default withErrorBoundary(App, {
  FallbackComponent: ({ error }) => <ErrorFallback error={error} />
})
