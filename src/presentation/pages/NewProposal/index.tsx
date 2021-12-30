import React, { useState } from 'react'
import { Button, FloatingMenu, Steps } from 'fiorde-fe-components'
import { Breadcrumbs, Link } from '@material-ui/core/'
import {
  Header,
  MainContainer,
  RootContainer,
  TopContainer,
  UserContainer,
  Username
} from './style'
import { withTheme } from 'styled-components'
import { I18n } from 'react-redux-i18n'
import IconComponent from '../../../application/icons/IconComponent'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'

export interface NewProposalProps {
  theme: any
}

const NewProposal = ({ theme }: NewProposalProps): JSX.Element => {
  const [activeStep, setActiveStep] = useState(0)

  const handleStep = (step): void => {
    setActiveStep(step)
  }

  const handleClickBreadcrumbs = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    event.preventDefault()
    console.info('You clicked a breadcrumb.')
  }

  const steps = [
    'Serviço',
    'Origem/Destino',
    'Carga',
    'Proposta',
    'Custos origem e destino',
    'Tarifas frete'
  ]

  const floatingButtonMenuItems = [
    {
      iconType: 'save',
      label: I18n.t('pages.newProposal.save'),
      onClick: () => {}
    }, {
      iconType: 'file',
      label: I18n.t('pages.newProposal.view'),
      onClick: () => {}
    }, {
      iconType: 'download',
      label: I18n.t('pages.newProposal.download'),
      onClick: () => {}
    }, {
      iconType: 'send',
      label: I18n.t('pages.newProposal.send'),
      onClick: () => {}
    }
  ]

  return (
    <RootContainer>
      <Header>
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <Link
            color="inherit"
            href="/"
            onClick={handleClickBreadcrumbs}
            className="breadcrumbInitial"
          >
            Home
          </Link>
          <span className="breadcrumbEnd">Propostas</span>
        </Breadcrumbs>
        <UserContainer>
          {I18n.t('pages.newProposal.encharged')}
          <IconComponent name="user" defaultColor={theme?.commercial?.pages?.newProposal?.subtitle} />
          <Username>
            Cristina Alves
          </Username>
        </UserContainer>
      </Header>
      <TopContainer>
        <Steps
          activeStep={activeStep}
          onChange={handleStep}
          steps={steps}
        />
        <div style={{ height: '36px' }}>
          <Button
            onAction={() => {}}
            text={I18n.t('pages.newProposal.buttonFinish')}
            icon="arrow"
            position="right"
            backgroundGreen
            popover
          >
            <FloatingMenu menuItems={floatingButtonMenuItems} />
          </Button>
        </div>
      </TopContainer>
      <MainContainer>
        <Step1 />
        <Step2 />
        <Step3 />
        <Step4 />
        <Step5 />
      </MainContainer>
    </RootContainer>
  )
}

export default withTheme(NewProposal)
