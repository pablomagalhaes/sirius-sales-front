import React, { useState, useEffect } from 'react'
import { Button, FloatingMenu } from 'fiorde-fe-components'
import { Breadcrumbs, Link, LinkBaseProps, Stepper, Step, StepButton, StepLabel } from '@material-ui/core/'
import {
  ButtonContainer,
  Header,
  MainContainer,
  RootContainer,
  TopContainer,
  UserContainer,
  Username
} from './style'
import styled, { withTheme } from 'styled-components'
import { I18n } from 'react-redux-i18n'
import IconComponent from '../../../application/icons/IconComponent'
import ScrollableAnchor, { goToAnchor } from 'react-scrollable-anchor'
import { HashLink } from 'react-router-hash-link'
import { Link as LinkS, scrollSpy, Events } from 'react-scroll'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import './index.css'

const Container = styled.div`
  width: 100%;
  margin-top: 100px;
`

const Progressbar = styled.ul`
  counter-reset: step;
`

const ProgressbarLi = styled.li`
  list-style-type: none;
  float: left;
  width: 33.33%;
  position: relative;
  text-align: center;
  font-weight: 600;

  &:before {
    content: counter(step);
    counter-increment: step;
    height: 30px;
    width: 30px;
    line-height: 30px;
    border: 2px solid #ddd;
    display:block;
    text-align: center;
    margin: 0 auto 10px auto;
    border-radius: 50%;
    background-color: white;
  }

  &:after {
    content:'';
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: #ddd;
    top: 15px;
    left: -50%;
    z-index: -1;
    background-color:#27ae60;
  }

  &:first-child:after {
    content:none;
  }

  active {
    color:#27ae60;
    background-color:#27ae60;
    &:before {
      border-color:#27ae60;
    }
  }
`

const Label = styled(StepLabel)`
    &.step-label-root {
        & > span.MuiStepLabel-iconContainer {
            & > svg.MuiStepIcon-root {
                color: ${(props: any) => props.theme?.fiorde?.stepper?.defaultColor};
            }
            & > svg.MuiStepIcon-active {
                color: ${(props: any) => props.theme?.fiorde?.stepper?.activeColor};
            }
        }
        & > span.MuiStepLabel-labelContainer {
            word-break: break-word;
        }
    }
    & .MuiStepLabel-label.MuiStepLabel-alternativeLabel {
        color: ${(props: any) => props.theme?.fiorde?.stepper?.fontColor};
    }
`

export interface NewProposalProps {
  theme: any
}

const Section = ({ label }) => {
  return (
    <div>
      <div>
        <span> {label} </span>
      </div>
    </div>
  )
}

const NewProposal = ({ theme }: NewProposalProps): JSX.Element => {
  const [activeStep, setActiveStep] = useState(0)
  const [clicked, setClicked] = useState({ id: '', clicked: false })
  const [hover, setHover] = useState({ id: '', hover: false })

  const handleStep = (step): void => {
    setActiveStep(step)
    console.log('handleStep step.id = ', step)
  }

  interface StepsProps {
    steps: any[]
    activeStep?: number
    onChange?: (args: any) => void
  }

  const RootContainer2 = styled.div`
    width: 50%;
    position: relative;
    overflow: auto;
    #stepper {
        background: ${(props: any) => props.theme?.fiorde?.stepper?.backgroundColor};
    }
    // border: 1px solid green;
    display: flex;
    justify-content: space-around;
    // height: 100px;
  `

  const Item = styled(LinkS)`
    padding-top: 10px; //era 10px
    width: 100px;
    height: 54px;
    // transition: 500ms;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // align-items: center;
    cursor: pointer;
    // border: 1px solid red;
    position: relative;
    overflow: hidden;
    // margin-left: 30px;
    // @media (max-width: 1366px) {
    //     margin-left: auto;
    // }
  //   &:after {
  //     // content: '';
  //     // position: absolute;
  //     // left: -50px;
  //     // top: '50px';
  //     width: 50px;
  //     border: 5px solid black;
  // }
`

  const StyledSpan = styled.span`
  // border: 1px solid purple;
  visibility: ${({ clicked, hover, step }) => clicked.clicked && clicked.id === step.id || hover.hover && hover.id === step.id ? 'visible' : 'hidden'};
  font-weight: normal;
  text-align: center;
  }`;

  const Circle = styled.div`
  // border: clicked.clicked && clicked.id === step.id ? '1px solid #1470CC' : '1px solid #C2C5D1',
    border: 1px solid #C2C5D1;
    // backgroundColor: clicked.clicked && clicked.id === step.id ? '#1470CC' : hover.hover && hover.id === step.id ? '#C2C5D1' : '',
    background-color: ${({ hover, step }) => hover.hover && hover.id === step.id ? '#C2C5D1' : ''};
    // width: clicked.clicked && clicked.id === step.id ? '24px' : '10px',
    // height: clicked.clicked && clicked.id === step.id ? '24px' : '10px',
    width: 10px;
    height: 10px;
    display: flex;
    border-radius: 50%;
    margin: 0 auto 10px auto; //era 30px no left
    // @media (max-width: 1366px) {
    //   margin-left: auto;
    // }
  `;

  useEffect(() => {
    Events.scrollEvent.register('begin', function (to, element) {
      console.log('begin', arguments)
    })

    Events.scrollEvent.register('end', function (to, element) {
      console.log('end', arguments)
    })

    scrollSpy.update()
    return () => {
      Events.scrollEvent.remove('begin')
      Events.scrollEvent.remove('end')
    }
  })

  const Steps2 = ({ steps }: StepsProps): JSX.Element => {
    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div
              className="collapse navbar-collapse"
              id="bs-example-navbar-collapse-1"
            >
              <ul style={{ listStyle: 'none' }}>
                {/* {steps.map(step =>
                <li style={{ float: "left", marginLeft: "10px" }}>
                  <LinkS
                    // className="step1"
                    to={step.id}
                    spy={true}
                    smooth={true}
                    duration={500}
                    offset={-98}
                    activeClass="active3"
                  >
                    {step.label}
                  </LinkS>
                </li>
              )} */}
                <li style={{ float: 'left', marginLeft: '10px' }}>
                  <LinkS
                    // className="step1"
                    to="step1"
                    spy={true}
                    smooth={true}
                    duration={500}
                    offset={-150}
                    activeClass="active3"
                  >
                    Teste 1
                  </LinkS>
                </li>
                <li style={{ float: 'left', marginLeft: '10px' }}>
                  <LinkS
                    to="step2"
                    spy={true}
                    smooth={true}
                    duration={500}
                    offset={-150}
                    activeClass="active3"
                  >
                    Test 2
                  </LinkS>
                </li>
                <li style={{ float: 'left', marginLeft: '10px' }}>
                  <LinkS
                    // className="step3"
                    to="step3"
                    spy={true}
                    smooth={true}
                    duration={500}
                    offset={-150}
                    activeClass="active3"
                  >
                    Test 3
                  </LinkS>
                </li>
                <li style={{ float: 'left', marginLeft: '10px' }}>
                  <LinkS
                    // activeClass="active3"
                    // className="step4"
                    to="step4"
                    spy={true}
                    smooth={true}
                    duration={500}
                    offset={-150}
                    activeClass="active3"
                  >
                    Test 4
                  </LinkS>
                </li>
                <li style={{ float: 'left', marginLeft: '10px' }}>
                  <LinkS
                    // activeClass="active3"
                    // className="step5"
                    to="step5"
                    spy={true}
                    smooth={true}
                    duration={500}
                    offset={-150}
                    activeClass="active3"
                  >
                    Test 5
                  </LinkS>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    )
  }

  const Connector = styled.div`
    width: 140%;
    left: 50%;
    border: 1px solid #C2C5D1;
    position: absolute;
    overflow: hidden;
    bottom: 48px;
    z-index: -10;
    margin-left: 10px;

    @media (max-width: 1700px) {
      width: 105%;
      left: 50%;
    }

    @media (max-width: 1500px) {
      width: 90%;
      left: 50%;
    }

    @media (max-width: 1300px) {
      width: 80%;
      left: 50%;
    }
  `;

  const Container = styled.div`
    position: relative;
    // overflow: hidden;
    // :after {
    //   width: 100%;
    //   height: 2px;
    //   content: '';
    //   position: absolute;
    //   background-color: #7d7d7d;
    //   bottom: 45px;
    //   left: 85%;
    //   z-index: -1;
    // }
  `;

  const Steps = ({ steps, activeStep, onChange }: StepsProps): JSX.Element => {
    return (
      <RootContainer2>
        {steps?.map((step, index) => (
          <Container>
            <Item
              // isSticky={true}
              to={step.id}
              offset={-184}
              key={step.id}
              smooth={true}
              // duration={500}
              spy={true}
              activeClass="active2"
              onClick={() => {
                setClicked({ id: step.id, clicked: true })
                console.log('Clicked = ', step.id)
              }}
              onSetActive={() => {
                console.log('Going to set Active')
              }}
              onSetInactive={() => {
                setClicked({ id: step.id, clicked: false })
                setHover({ id: step.id, hover: false })
                console.log('Going to set Inactive')
              }}
              onMouseEnter={() => {
                setHover({ id: step.id, hover: true })
                console.log('mouse enter')
              }}
              onMouseLeave={() => {
                setHover({ id: '', hover: false })
                console.log('mouse leave')
              }}
            >
              <Circle hover={hover} step={step} />
              <StyledSpan clicked={clicked} hover={hover} step={step}>{step.label}</StyledSpan>
            </Item>
            {index !== steps.length-1 ? <Connector clicked={clicked} step={step} /> : null}
            {/* <div style={{
              width: '100px',
              left: '120%',
              color: 'gray',
              border: '1px solid gray',
              position: 'absolute',
              overflow: 'hidden',
              bottom: '45px',
              zIndex: -10,
            }}></div> */}
            </Container>
        ))}
      </RootContainer2>
    )
  }

  const handleClickBreadcrumbs = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    event.preventDefault()
    console.info('You clicked a breadcrumb.')
  }

  const steps = [
    { id: 'step1', label: I18n.t('pages.newProposal.step1.title') },
    { id: 'step2', label: I18n.t('pages.newProposal.step2.title') },
    { id: 'step3', label: I18n.t('pages.newProposal.step3.title') },
    { id: 'step4', label: I18n.t('pages.newProposal.step4.title') },
    { id: 'step5', label: I18n.t('pages.newProposal.step5.title') }
  ]

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
          // activeStep={activeStep}
          // onChange={handleStep}
          steps={steps}
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
        <div id="step1" style={{ border: '1px solid pink' }}><Step1 /></div>
        {/* <div style={{ border: '1px solid green', height: '10px' }}></div> */}
        <div id="step2" style={{ border: '1px solid yellow' }}><Step2 /></div>
        {/* <div style={{ border: '1px solid green', height: '10px' }}></div> */}
        <div id="step3" style={{ border: '1px solid red' }}><Step3 /></div>
        {/* <div style={{ border: '1px solid green', height: '10px' }}></div> */}
        <div id="step4" style={{ border: '1px solid blue' }}><Step4 /></div>
        <div id="step5" style={{ border: '1px solid green' }}><Step5 /></div>
      </MainContainer>
    </RootContainer>
  )
}

export default withTheme(NewProposal)
