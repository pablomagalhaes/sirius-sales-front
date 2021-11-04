import React from "react";
import { StyledThemeProvider, dark as libraryThemeDark, light as libraryThemeLight } from "fiorde-fe-components";
import { ThemeProvider } from "styled-components";
import { light, dark } from "../application/themes";
import Routes from "./components/Routes";
import { useSelector } from "react-redux";
import startSubscriber from '../application/Subscriber';

const App = () => {
  const state = useSelector((state: any) => state);
  const { theme } = state.app;
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