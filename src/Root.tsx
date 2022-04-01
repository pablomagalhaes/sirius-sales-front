import React from 'react'

import { Provider } from 'react-redux'
import App from './presentation/App'
import store from './application/redux/store'

const Root = (): JSX.Element => {
  return (
    <Provider store={store}>
        <App />
    </Provider>
  )
}

export default Root
