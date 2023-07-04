import React from 'react'

import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Home, NewProposal, Proposal, NewProposalExportation, Tariff, StaggeredProposal, NewStaggeredProposal } from '../../pages'
import Wrapper from '../Wrapper'
import { ProposalContextProvider } from '../../pages/NewProposal/context/ProposalContext'
import { TariffContextProvider } from '../../pages/Tariff/context/TariffContext'
import { StaggeredProposalContextProvider } from '../../pages/StaggeredProposal/context/StaggeredProposalContext'

// import { makeAdminDetail } from '../../../main/factories/pages/staggered-proposal/update-staggered-proposal-factory'

import { makeRemoteUpdateStaggeredProposal } from '../../../main/factories/usecases/remote-update-staggered-proposal-factory'

const Routes = (): JSX.Element => (
  <ProposalContextProvider>
    <TariffContextProvider>
      <StaggeredProposalContextProvider>
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
            <Route exact path="/novaPropostaEscalonada">
              <Wrapper>
                <NewStaggeredProposal updateStaggeredProposal={makeRemoteUpdateStaggeredProposal()}/>
              </Wrapper>
            </Route>
          </Switch>
        </BrowserRouter>
      </StaggeredProposalContextProvider>
    </TariffContextProvider>
  </ProposalContextProvider>
)
export default Routes
