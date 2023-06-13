import React from 'react'

import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Home, Proposal, Tariff } from '../../pages'
import Wrapper from '../Wrapper'
import { ProposalContextProvider } from '../../pages/NewProposal/context/ProposalContext'
import { MakeNewProposalFactory } from '../../../main/factories/pages/new-proposal/new-proposal-factory'
import { MakeNewProposalExportationFactory } from '../../../main/factories/pages/new-proposal-exportation/new-proposal-exportation-factory'

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
            <MakeNewProposalFactory />
          </Wrapper>
        </Route>
        <Route exact path="/novaPropostaExportacao">
          <Wrapper>
            <MakeNewProposalExportationFactory />
          </Wrapper>
        </Route>
        <Route exact path="/tarifario">
          <Wrapper>
            <Tariff />
          </Wrapper>
        </Route>
      </Switch>
    </BrowserRouter>
  </ProposalContextProvider>
)
export default Routes
