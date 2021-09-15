import React, { useEffect } from "react";
import { setLocale } from "react-redux-i18n";
import { useDispatch } from "react-redux";
import { toggleTheme } from './redux/actions/app'
const EVENTS = {
  locale: "locale",
  theme: "theme",
};

const startSubscriber = () => {
  const dispatch = useDispatch();

  const handleLocale = (event) => {
    const { locale } = event.detail;
    dispatch(setLocale(locale));
  };

  const handleTheme = (event) => {
    const { theme } = event.detail;
    dispatch(toggleTheme(theme));
  };

  useEffect(() => {
    console.log('useEffect')
    window.addEventListener(EVENTS.locale, handleLocale);
    window.addEventListener(EVENTS.theme, handleTheme);

    return () => {
    console.log('useEffect remove')
      window.removeEventListener(EVENTS.locale, handleLocale);
      window.addEventListener(EVENTS.theme, handleTheme);
    };
  }, []);
};
export default startSubscriber;
