import React, { useState } from 'react'
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
import ScrollableAnchor, { goToAnchor } from 'react-scrollable-anchor'
import { HashLink } from 'react-router-hash-link';
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
    console.log('handleStep step.id = ', step);
    // <HashLink to='#step1' scroll={el => scrollWithOffset(el, 130)} > Step 1 </HashLink>
    // <HashLink to='#step2' scroll={el => scrollWithOffset(el, 565)} > Step 2 </HashLink>
    // <HashLink to='#step3' scroll={el => scrollWithOffset(el, 905)} > Step 3 </HashLink>
    // <HashLink to='#step4' scroll={el => scrollWithOffset(el, 0)} > Step 4 </HashLink>
    // <HashLink to='#step5' scroll={el => scrollWithOffset(el, 0)} > Step 5 </HashLink>
    // goToAnchor(step)
  }

  const handleClickBreadcrumbs = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    event.preventDefault()
    console.info('You clicked a breadcrumb.')
  }

  const scrollWithOffset = (el: any, offset: any) => {
    const elementPosition = el.offsetTop + offset;
    window.scroll({
      top: elementPosition,
      left: 0,
      behavior: "smooth"
    })
  }

  // const steps = [
  //   I18n.t('pages.newProposal.step1.title'),
  //   I18n.t('pages.newProposal.step2.title'),
  //   I18n.t('pages.newProposal.step3.title'),
  //   I18n.t('pages.newProposal.step4.title'),
  //   I18n.t('pages.newProposal.step5.title')
  // ]

  const steps = [
    { id: 'step1', label: I18n.t('pages.newProposal.step1.title'), renderStep: <Step1 /> },
    { id: 'step2', label: I18n.t('pages.newProposal.step2.title'), renderStep: <Step2 /> },
    { id: 'step3', label: I18n.t('pages.newProposal.step3.title'), renderStep: <Step3 /> },
    // { id: 'step4', label: I18n.t('pages.newProposal.step4.title'), renderStep: <Step4 /> },
    // { id: 'step5', label: I18n.t('pages.newProposal.step5.title'), renderStep: <Step5 /> }
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
          activeStep={activeStep}
          onChange={handleStep}
          steps={steps}
        />
        <div>
          {/* <a href='#step1' > Step 1 </a>
          <a href='#step2' > Step 2 </a>
          <a href='#step3' > Step 3 </a>
          <a href='#step4' > Step 4 </a>
          <a href='#step5' > Step 5 </a> */}
          <HashLink to='#step1' scroll={el => scrollWithOffset(el, 130)} > Step 1 </HashLink>
          <HashLink to='#step2' scroll={el => scrollWithOffset(el, 565)} > Step 2 </HashLink>
          <HashLink to='#step3' scroll={el => scrollWithOffset(el, 905)} > Step 3 </HashLink>
          <HashLink to='#step4' scroll={el => scrollWithOffset(el, 0)} > Step 4 </HashLink>
          <HashLink to='#step5' scroll={el => scrollWithOffset(el, 0)} > Step 5 </HashLink>
        </div>
        <ButtonContainer>
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
        </ButtonContainer>
      </TopContainer>
      <MainContainer>
        {/* {
          steps.map(step =>
            <ScrollableAnchor id={step.id}>
              {step.renderStep}
            </ScrollableAnchor>)
        } */}
        
        <div id="step1" style={{border: '1px solid pink'}}><Step1 /></div>
        <div id="step2" style={{border: '1px solid yellow'}}><Step2 /></div>
        <div id="step3" style={{border: '1px solid red'}}><Step3 /></div>
        <div id="step4" style={{border: '1px solid blue'}}><Step4 /></div>
        <div id="step5" style={{border: '1px solid green'}}><Step5 /></div>
        {/* <Step1 />
        <Step2 />
        <Step3 />
        <Step4 />
        <Step5 /> */}
          {/* <ScrollableAnchor id={'step1'}>
          <div style={{ height: 600 }}>HOME</div>
          </ScrollableAnchor>
          <ScrollableAnchor id={'step2'}>
          <div style={{ height: 600 }}>HOME</div>
          </ScrollableAnchor> */}
          {/* <ScrollableAnchor id={'step3'}>
            <div id='step3'><Step3 /></div>
          </ScrollableAnchor>
          <ScrollableAnchor id={'step4'}>
            <Step4 />
          </ScrollableAnchor>
          <ScrollableAnchor id={'step5'}>
            <Step5 />
          </ScrollableAnchor> */}
      </MainContainer>
    </RootContainer>
  )
}

export default withTheme(NewProposal)
