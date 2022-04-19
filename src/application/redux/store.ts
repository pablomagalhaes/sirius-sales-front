import { createStore, applyMiddleware } from 'redux'
import {
  loadTranslations,
  setLocale,
  syncTranslationWithStore
} from 'react-redux-i18n'
import { composeWithDevTools } from 'redux-devtools-extension'
import translations from '../i18n'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
)

syncTranslationWithStore(store)
store.dispatch(loadTranslations(translations))

const locale = localStorage.getItem('locale')
if (locale != null) {
  store.dispatch(setLocale(locale))
} else {
  store.dispatch(setLocale('pt'))
}

export default store
