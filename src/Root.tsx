import React, { useState } from 'react'

import { Provider } from 'react-redux'
import App from './presentation/App'
import store from './application/redux/store'
import { Item, StoreProvider } from './application/store/StoreContext'

const Root = ({ children }): JSX.Element => {
  const [items, setItems] = useState<Item | any>('')
  return (
    <Provider store={store}>
      <StoreProvider.Provider value={{ items, setItems }}>
        <App />
       </StoreProvider.Provider>
    </Provider>
  )
}

export default Root
