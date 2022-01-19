import React, { useState } from 'react'
import { Button, FloatingMenu } from 'fiorde-fe-components'
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
import { Stepper, Step, StepButton } from '@material-ui/core';
import { HashLink } from 'react-router-hash-link';
import { Link as LinkS } from 'react-scroll';
import styled from 'styled-components';
import { StepLabel } from '@material-ui/core';
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'

const Container = styled.div`
  width: 100%;
  margin-top: 100px;
`;

const Progressbar = styled.ul`
  counter-reset: step;
`;

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
`;

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
`;

export interface NewProposalProps {
  theme: any
}

const Section = ({label}) => {
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
  const [clicked, setClicked] = useState({ id: '', clicked: false });
  const [hover, setHover] = useState({ id: '', hover: false });

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

  interface StepsProps {
    steps: any[];
    activeStep: number;
    onChange(args: any): void;
  }

  const RootContainer2 = styled.div`
    width: 100%;
    #stepper {
        background: ${(props: any) => props.theme?.fiorde?.stepper?.backgroundColor};
    }
    border: 1px solid green;
    display: flex;
    justify-content: space-around;
    // height: 100px;
  `;

  const Item = styled(LinkS)`
    // width: 10px;
    height: 54px;
    // transition: 500ms;
    display: inline-block;
    justify-content: flex-end;
    // align-items: center;
    cursor: pointer;
    border: 1px solid red;
`;

   // {/* <Stepper id="stepper" alternativeLabel nonLinear activeStep={activeStep}>
            //     {steps?.map((step, index) => (
            //         // <Step id={step.id} key={step.label}>
            //           <LinkS
            //           to={step.id}
            //           offset={-65}
            //           key={'step3'}
            //           smooth={true}
            //           duration={500}
            //           spy={true}
            //           >
            //               <StepButton id={`step-button-${index}`} onClick={() => onChange(step.id)}>
            //                   <Label id={`step-label-${index}`} classes={{ root: 'step-label-root' }}>
            //                       {step.label}
            //                   </Label>
            //               </StepButton>
            //             </LinkS>
            //         // </Step>
            //     ))}
            // </Stepper> */}

  const Steps = ({ steps, activeStep, onChange }: StepsProps): JSX.Element => {
    return (
        <RootContainer2>
          {steps?.map((step, index) => (
          // <div style={{border: '1px solid purple', textAlign: 'center',
          // alignItems: 'center',
          // justifyContent: 'center',

          // }}>
            <Item
              // isSticky={true}
              to={step.id}
              offset={-85}
              key={step.id}
              smooth={true}
              duration={500}
              spy={true}
              onClick={() => {
                setClicked({ id: step.id, clicked: true })
                console.log('Clicked = ', step.id);
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
              <div style={{
                border: clicked.clicked && clicked.id === step.id ? '1px solid #1470CC' : '1px solid #C2C5D1',
                backgroundColor: clicked.clicked && clicked.id === step.id ? '#1470CC' : hover.hover && hover.id === step.id ? '#C2C5D1' : '',
                width: clicked.clicked && clicked.id === step.id ? '24px' : '10px',
                height: clicked.clicked && clicked.id === step.id ? '24px' : '10px',
                display: 'flex',
                borderRadius: '50%',
                margin: '0 auto 10px auto'
                }}
                // onClick={() => setClicked(true)}
                >
                </div>
                <span style={{
                  border: '1px solid purple',
                  visibility: (clicked.clicked && clicked.id === step.id) || (hover.hover && hover.id === step.id) ? 'visible' : 'hidden',
                }}
                  >
                    {step.label}
                  </span>
            </Item>
            
          // </div>
        ))}
        </RootContainer2>
    );
};

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
    { id: 'step4', label: I18n.t('pages.newProposal.step4.title'), renderStep: <Step4 /> },
    { id: 'step5', label: I18n.t('pages.newProposal.step5.title'), renderStep: <Step5 /> }
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

  const renderSection = (step) => {
    // const props = {...section, sections}

    return (
      <div key={step.id}>
        <ScrollableAnchor id={step.id}>
          <Section label={step.label}/>
        </ScrollableAnchor>
        <div style={{height: '200px', backgroundColor: 'white'}}/>
      </div>
    )
  }

  const renderSectionNav = (section) => {
    return (
      <div key={section.id}>
        <a href={`#${section.id}`}> {section.label} </a>
      </div>
    )
  }

  const renderHeader = (sections) => {
    return (
      <div>
        <div>
          { sections.map(section => renderSectionNav(section)) }
        </div>
      </div>
    )
  }

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
        {/* <div>
          <HashLink to='#step1' scroll={el => scrollWithOffset(el, 130)} > Step 1 </HashLink>
          <HashLink to='#step2' scroll={el => scrollWithOffset(el, 565)} > Step 2 </HashLink>
          <HashLink to='#step3' scroll={el => scrollWithOffset(el, 905)} > Step 3 </HashLink>
          <HashLink to='#step4' scroll={el => scrollWithOffset(el, 0)} > Step 4 </HashLink>
          <HashLink to='#step5' scroll={el => scrollWithOffset(el, 0)} > Step 5 </HashLink>
        </div> */}
        {/* <div>
          { steps.map(step => renderSection(step)) }
        </div> */}
        {/* <LinkS
            // isSticky={isSticky}
            key={'step2'}
            to={'step2'}
            smooth={true}
            duration={500}
            spy={true}
            offset={-65}
        >
           Step 2
        </LinkS>
        <LinkS
            // isSticky={isSticky}
            key={'step3'}
            to={'step3'}
            smooth={true}
            duration={500}
            spy={true}
            offset={-65}
        >
           Step 3
        </LinkS> */}
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
      {/* <div>
        { renderHeader(steps) }
        <div style={{marginTop: '60px'}}>
          { steps.map(step => renderSection(step)) }
        </div>
      </div> */}
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
