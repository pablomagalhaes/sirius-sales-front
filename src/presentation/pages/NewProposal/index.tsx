import React, { useState, useEffect } from 'react'
import { Button, FloatingMenu, Steps } from 'fiorde-fe-components'
import { Breadcrumbs, Link } from '@material-ui/core/'
import {
  ButtonContainer,
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
  const [clicked, setClicked] = useState({ id: '', clicked: false })
  const [hover, setHover] = useState({ id: '', hover: false })
  const steps = [
    { id: 'step1', label: I18n.t('pages.newProposal.step1.title'), completed: true },
    { id: 'step2', label: I18n.t('pages.newProposal.step2.title'), completed: true },
    { id: 'step3', label: I18n.t('pages.newProposal.step3.title'), completed: true },
    { id: 'step4', label: I18n.t('pages.newProposal.step4.title'), completed: false },
    { id: 'step5', label: I18n.t('pages.newProposal.step5.title'), completed: false }
  ]

  const handleClick = (clickState) => {
    setClicked(clickState);
  }

  const handleHover = (hoverState) => {
    setHover(hoverState);
  }

  const handleClickBreadcrumbs = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    event.preventDefault()
    console.info('You clicked a breadcrumb.')
  }

  const floatingButtonMenuItems = [
    {
      iconType: 'save',
      label: I18n.t('pages.newProposal.save'),
      onClick: () => { }
    }, {
      iconType: 'file',
      label: I18n.t('pages.newProposal.view'),
      onClick: () => { }
    }, {
      iconType: 'download',
      label: I18n.t('pages.newProposal.download'),
      onClick: () => { }
    }, {
      iconType: 'send',
      label: I18n.t('pages.newProposal.send'),
      onClick: () => { }
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
          <Link
            color="inherit"
            href="/"
            onClick={handleClickBreadcrumbs}
            className="breadcrumbInitial"
          >
            {I18n.t('pages.newProposal.proposal')}
          </Link>
          <span className="breadcrumbEnd">{I18n.t('pages.newProposal.newProposal')}</span>
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
          steps={steps}
          clicked={clicked}
          hover={hover}
          handleClick={handleClick}
          handleHover={handleHover}
        />
        <ButtonContainer>
          <Button
            onAction={() => { }}
            text={I18n.t('pages.newProposal.buttonFinish')}
            icon="arrow"
            position="right"
            backgroundGreen
            popover
          >
            <FloatingMenu menuItems={floatingButtonMenuItems} />
          </Button>
        </ButtonContainer>
      </TopContainer>
      <MainContainer>
        <div id="step1"><Step1 /></div>
        <div id="step2"><Step2 /></div>
        <div id="step3"><Step3 /></div>
        <div id="step4"><Step4 /></div>
        <div id="step5"><Step5 /></div>
      </MainContainer>
    </RootContainer>
  )
}

export default withTheme(NewProposal)
