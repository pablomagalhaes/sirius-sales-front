import React from 'react'

import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Home, NewProposal, Proposal } from '../../pages'
import Wrapper from '../Wrapper'
import { ProposalContextProvider } from '../../pages/NewProposal/context/ProposalContext'

const Routes = (): JSX.Element => (
  <ProposalContextProvider>
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
  </ProposalContextProvider>
)
export default Routes
