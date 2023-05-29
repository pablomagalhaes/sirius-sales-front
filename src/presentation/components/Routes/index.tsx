import React from 'react'

import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Home, NewProposal, Proposal, NewProposalExportation, Tariff } from '../../pages'
import Wrapper from '../Wrapper'
import { ProposalContextProvider } from '../../pages/NewProposal/context/ProposalContext'
import { TariffContextProvider } from '../../pages/Tariff/context/TariffContext'

const Routes = (): JSX.Element => (
  <ProposalContextProvider>
    <TariffContextProvider>
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
          <Route exact path="/novaPropostaExportacao">
            <Wrapper>
              <NewProposalExportation />
            </Wrapper>
          </Route>
          <Route exact path="/tarifario">
            <Wrapper>
              <Tariff />
            </Wrapper>
          </Route>
        </Switch>
      </BrowserRouter>
    </TariffContextProvider>
  </ProposalContextProvider>
)
export default Routes
