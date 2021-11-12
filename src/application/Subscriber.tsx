import { useEffect } from 'react'

import { setLocale } from 'react-redux-i18n'
import { useDispatch } from 'react-redux'
import { toggleTheme } from './redux/actions/app'
const EVENTS = {
  locale: 'locale',
  theme: 'theme'
}

const startSubscriber = (): void => {
  const dispatch = useDispatch()

  const handleLocale = (event): void => {
    const { locale } = event.detail
    dispatch(setLocale(locale))
  }

  const handleTheme = (event): void => {
    const { theme } = event.detail
    dispatch(toggleTheme(theme))
  }

  useEffect(() => {
    window.addEventListener(EVENTS.locale, handleLocale)
    window.addEventListener(EVENTS.theme, handleTheme)

    return () => {
      window.removeEventListener(EVENTS.locale, handleLocale)
      window.addEventListener(EVENTS.theme, handleTheme)
    }
  }, [])
}
export default startSubscriber
