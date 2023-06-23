import React from 'react'

import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Home, NewProposal, Proposal, NewProposalExportation, Tariff, StaggeredProposal } from '../../pages'
import Wrapper from '../Wrapper'
import { ProposalContextProvider } from '../../pages/NewProposal/context/ProposalContext'
import { TariffContextProvider } from '../../pages/Tariff/context/TariffContext'
import { StaggeredProposalProvider } from '../../pages/StaggeredProposal/context/StaggeredProposalContext'

const Routes = (): JSX.Element => (
  <ProposalContextProvider>
    <TariffContextProvider>
      <StaggeredProposalProvider>
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
            <Route exact path="/propostaEscalonada">
              <Wrapper>
                <StaggeredProposal />
              </Wrapper>
            </Route>
          </Switch>
        </BrowserRouter>
      </StaggeredProposalProvider>
    </TariffContextProvider>
  </ProposalContextProvider>
)
export default Routes
