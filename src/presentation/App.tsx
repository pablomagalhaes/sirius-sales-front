import React, { useEffect } from 'react'
import { StyledThemeProvider, dark as libraryThemeDark, light as libraryThemeLight } from 'fiorde-fe-components'
import { ThemeProvider } from 'styled-components'
import { light, dark } from '../application/themes'
import Routes from './components/Routes'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { useSelector } from 'react-redux'
import startSubscriber from '../application/Subscriber'
import { withErrorBoundary } from 'react-error-boundary'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 60 * 2
    }
  }
})

const persister = createSyncStoragePersister({
  storage: window.localStorage
})

const App = (): JSX.Element => {
  const state = useSelector((state: any) => state)
  const { theme } = state.app
  startSubscriber()
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
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
    </PersistQueryClientProvider>
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
