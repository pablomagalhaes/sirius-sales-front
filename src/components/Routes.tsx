import React from "react";

import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Home, Proposal } from "../pages";
import Wrapper from "./Wrapper";

const Routes = () => (
  <BrowserRouter basename="/plataformasirius/#/comercial">
    <Switch>
      <Route exact path="/proposta">
        <Wrapper>
          <Proposal />
        </Wrapper>
      </Route>
      <Route exact path="/teste">
        <Wrapper>
          <span>test</span>
        </Wrapper>
      </Route>
      <Route exact path="/">
        <Wrapper>
          <Home />
        </Wrapper>
      </Route>
    </Switch>
  </BrowserRouter>
);
export default Routes;
