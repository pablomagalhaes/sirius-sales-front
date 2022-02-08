import React from 'react'

import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Home, NewProposal, Proposal } from '../../pages'
import Wrapper from '../Wrapper'

const Routes = (): JSX.Element => (
  <BrowserRouter basename="/#/comercial">
    <Switch>
      <Route exact path="/">
        <Wrapper>
          <Home />
        </Wrapper>
      </Route>
      <Route exact path="/proposta">
        <Wrapper>
          <Proposal />
        </Wrapper>
      </Route>
      <Route exact path="/novaProposta">
        <Wrapper>
          <NewProposal />
        </Wrapper>
      </Route>
    </Switch>
  </BrowserRouter>
)
export default Routes
