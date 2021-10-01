import React from "react";
import { StyledThemeProvider, dark as libraryThemeDark, light as libraryThemeLight } from "fiorde-fe-components";
import { ThemeProvider } from "styled-components";
import { light, dark } from "./themes";
import Routes from "./components/Routes";
import { useSelector } from "react-redux";
import startSubscriber from './Subscriber';
import { APP_URL } from './constants';

const App = () => {
  const state = useSelector((state: any) => state);
  const { theme } = state.app;
  console.log('SALES-FE:', APP_URL);
  startSubscriber();
  return (
    <ThemeProvider theme={theme === "light" ? light : dark}>
      <StyledThemeProvider theme={theme === "light" ? libraryThemeLight : libraryThemeDark}>
        <Routes />
      </StyledThemeProvider>
    </ThemeProvider>
  );
};

export default App;