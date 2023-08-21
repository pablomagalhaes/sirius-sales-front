import React, { useState, useEffect, useContext, useRef } from 'react'
import { Button, FloatingMenu, Steps, Messages } from 'fiorde-fe-components'
import { Breadcrumbs, Link, Grid } from '@material-ui/core/'
import {
  ButtonContainer,
  Header,
  MainContainer,
  RootContainer,
  TopContainer,
  MessageContainer,
  ImportButtonDiv,
  AddButtonDiv
} from './style'
import { withTheme } from 'styled-components'
import { I18n } from 'react-redux-i18n'
import Step1 from './steps/Step1'
import Step2 from './steps/Step2'

import { useHistory,useLocation } from 'react-router-dom'
import { CreateStaggeredProposal } from '../../../domain/usecase'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { StaggeredProposalContext, StaggeredProposalProps , emptyStaggeredProposalValue } from '../StaggeredProposal/context/StaggeredProposalContext'

import TariffImportModal from '../StaggeredProposal/components/TariffImportModal/TariffImportModal'
import TariffImportHandsOnModal from '../StaggeredProposal/components/TariffImportModal/TariffImportHandsOnModal'
import ProposalDisplayModal from '../../components/ProposalDisplayModal/ProposalDisplayModal'

import {
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_LINK_HOME,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_BUTTON_SAVE,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_BUTTON_MODAL_IMPORT,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_BUTTON_MODAL_IMPORT_ON_HANDS,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_SPAN_MAINPAGE
} from '../../../ids'

import API from '../../../infrastructure/api'

type StaggeredProps = {
  theme: any
  newStaggeredProposal: CreateStaggeredProposal
}

const NewStaggeredProposal = ({ theme, newStaggeredProposal }: StaggeredProps): JSX.Element => {
  const { staggeredproposal, setStaggeredProposal }: StaggeredProposalProps = useContext(StaggeredProposalContext)

  const [clicked, setClicked] = useState({ id: '', clicked: false })
  const [hover, setHover] = useState({ id: '', hover: false })
  const [invalidInput, setInvalidInput] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [showSaveMessage, setShowSaveMessage] = useState(false)
  const [proposalRef, setProposalRef] = useState('')
  const [idProposal, setIdProposal] = useState('')

  const [openImport, setOpenImport] = useState(false)
  const [openDisplay, setOpenDisplay] = useState(false)
  const [openImportHandsOn, setOpenImportHandsOn] = useState(false)

  const [ShowList, setShowList] = useState<boolean>(false)

  const queryClient = useQueryClient()

  const history = useHistory()
  const location = useLocation()

  const [completed, setCompleted] = useState({
    step1: false,
    step2: false
  })

  const [filled, setFilled] = useState({
    step1: false,
    step2: false
  })

  const [stepLoaded, setStepLoaded] = useState({
    step1: false,
    step2: false
  })

  const steps = [
    {
      id: 'step1',
      label: I18n.t('pages.staggeredProposal.newStaggeredProposal.step1.title'),
      completed: completed.step1
    },
    {
      id: 'step2',
      label: I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.title'),
      completed: completed.step2
    }
  ]

  const handleClick = (clickState): void => {
    setClicked(clickState)
  }

  const handleHover = (hoverState): void => {
    setHover(hoverState)
  }

  const mutation = useMutation({
    mutationFn: async (newData: any) => {
      return await newStaggeredProposal.newStaggered(newData)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['updateStaggedProposal'])
      setShowSaveMessage(true)
      setProposalRef(data.referenceTariffProposal)
      setIdProposal(data.idTariffCustomer)
    }
  })

  const handleSave = (): void => {
    if (completed.step1 && staggeredproposal?.proposalTariff.length > 0 && completed.step2) {
      setInvalidInput(false)
      if (idProposal !== '') {
        const params = {
          idBusinessPartnerCustomer: staggeredproposal.idBusinessPartnerCustomer,
          tariffType: staggeredproposal.tariffType,
          idTariffProposalStatus: Number(1),
          dtValidity: staggeredproposal.dtValidity,
          dtValidityEnd: staggeredproposal.dtValidityEnd,
          proposalTariff: []
        }

        const newObject = staggeredproposal?.proposalTariff.map((obj) => {
          if (obj?.origin !== '') {
            return {
              ...obj,
              origin: obj.origin.split(' - ')[0],
              destination: obj.destination.split(' - ')[0],
              freightValues: obj.freightValues.map((item) => {
                if (item.buyOrSell === 'SELL') {
                  return {
                    vlMinimum: item.vlMinimum,
                    until45kg: item.until45kg.replace(/,/g, '.'),
                    until100kg: item.until100kg.replace(/,/g, '.'),
                    until300kg: item.until300kg.replace(/,/g, '.'),
                    until500kg: item.until500kg.replace(/,/g, '.'),
                    until1000kg: item.until1000kg.replace(/,/g, '.'),
                    buyOrSell: item.buyOrSell
                  }
                } else {
                  return item
                }
              })
            }
          }
          return { ...obj }
        })

        params.proposalTariff = newObject

        void (async function () {
          await API.putTariffProposal(idProposal, params)
            .then((response) => {
              setShowSaveMessage(true)
            })
            .catch((err) => console.log(err))
        })()
      } else {
        const params = {
          idBusinessPartnerCustomer: staggeredproposal.idBusinessPartnerCustomer,
          tariffType: staggeredproposal.tariffType,
          idTariffProposalStatus: Number(1),
          dtValidity: staggeredproposal.dtValidity,
          dtValidityEnd: staggeredproposal.dtValidityEnd,
          proposalTariff: []
        }

        const newObject = staggeredproposal?.proposalTariff.map((obj) => {
          if (obj?.origin !== '') {
            return {
              ...obj,
              origin: obj.origin.split(' - ')[0],
              destination: obj.destination.split(' - ')[0],
              freightValues: obj.freightValues.map((item) => {
                return {
                  vlMinimum: item.vlMinimum.replace(/,/g, '.'),
                  until45kg: item.until45kg.replace(/,/g, '.'),
                  until100kg: item.until100kg.replace(/,/g, '.'),
                  until300kg: item.until300kg.replace(/,/g, '.'),
                  until500kg: item.until500kg.replace(/,/g, '.'),
                  until1000kg: item.until1000kg.replace(/,/g, '.'),
                  buyOrSell: item.buyOrSell
                }
              })
            }
          }
          return { ...obj }
        })

        params.proposalTariff = newObject
        mutation.mutate(params)
      }
    } else {
      setInvalidInput(true)
    }
  }

  const floatingButtonMenuItems = [
    {
      iconType: 'save',
      label: I18n.t('pages.newProposal.save'),
      onClick: () => handleSave()
    }, {
      iconType: 'send',
      label: I18n.t('pages.newProposal.send'),
      onClick: () => { }
    }
  ]

  // Menu suspenso após proposta ter sido salva
  const floatingButtonMenuItemsAfterSaved = [
    {
      iconType: 'save',
      label: I18n.t('pages.newProposal.save'),
      onClick: () => handleSave()
    }, {
      iconType: 'file',
      label: I18n.t('pages.newProposal.viewDownload'),
      onClick: () => {
        setOpenDisplay(true)
      }
    },
    {
      iconType: 'send',
      label: I18n.t('pages.newProposal.send'),
      onClick: () => { }
    }
  ]

  const getProposalById = async (proposalId): Promise<void> => {
    await API.getTariffProposal(proposalId)
      .then((response) => {
        setStaggeredProposal(response)
        setProposalRef(response.referenceTariffProposal)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    const proposalId = location.state?.proposalId
    if (proposalId !== undefined && proposalId !== null) {
      setIdProposal(proposalId)
    }
    return () => {
      setStaggeredProposal(emptyStaggeredProposalValue)
      setShowSaveMessage(false)
      setProposalRef('')
      setIdProposal('')
    }
  }, [])

  useEffect(() => {
    if (idProposal !== '') getProposalById(idProposal)
  }, [idProposal])

  useEffect(() => {
    if (staggeredproposal?.idTariffProposalStatus !== null) {
      setEditMode(true)
      setShowList(true)
    } else setEditMode(false)
  }, [staggeredproposal])

  const divRef = useRef()

  return (
    <RootContainer>
      <Header>
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <Link
            id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_LINK_HOME}
            className="breadcrumbInitial"
            color="inherit"
            onClick={() => history.push('/')}
            style={{ cursor: 'pointer' }}
          >
            Home
          </Link>
          <span id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_SPAN_MAINPAGE} className="breadcrumbEnd">{I18n.t('pages.staggeredProposal.title')}</span>
        </Breadcrumbs>
      </Header>
      <TopContainer>
        <Steps
          clicked={clicked}
          handleClick={handleClick}
          handleHover={handleHover}
          hover={hover}
          offset={-270}
          steps={steps}
        />
        <ButtonContainer>
          <Button
            id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_BUTTON_SAVE}
            backgroundGreen
            disabled={false}
            icon="arrow"
            onAction={() => { }}
            popover
            position="right"
            text={I18n.t('pages.newProposal.buttonFinish')}
            tooltip={I18n.t('pages.newProposal.buttonFinish')}
          >
            <FloatingMenu menuItems={idProposal !== '' ? floatingButtonMenuItemsAfterSaved : floatingButtonMenuItems} />
          </Button>
        </ButtonContainer>
      </TopContainer>
      {/* {leavingPage && <MessageExitDialog />} */}
      {idProposal === '' &&
        <MainContainer ref={divRef}>
          <div id="step1">
            <Step1
              filled={filled}
              invalidInput={invalidInput}
              setCompleted={setCompleted}
              setFilled={setFilled}
              setStepLoaded={setStepLoaded}
            />
          </div>
          {stepLoaded.step1 && <>
            <div id="step2">
              <Step2
                invalidInput={invalidInput}
                setCompleted={setCompleted}
                setFilled={setFilled}
                ShowList={ShowList}
              />
            </div>
          </>
          }

          <Grid item xs={12} container direction="row" justify="flex-start">
            <Grid item xs={2}>
              <ImportButtonDiv>
                <Button
                  id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_BUTTON_MODAL_IMPORT}
                  onAction={() => {
                    setOpenImport(true)
                  }}
                  text={I18n.t('pages.staggeredProposal.newStaggeredProposal.ImportTariff')}
                  icon="tariff"
                  backgroundGreen={true}
                  tooltip={I18n.t('pages.staggeredProposal.newStaggeredProposal.ImportTariff')}
                  disabled={false}
                />
              </ImportButtonDiv>
            </Grid>
            <Grid item xs={2}>
              <AddButtonDiv>
                <Button
                  id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_BUTTON_MODAL_IMPORT_ON_HANDS}
                  onAction={() => {
                    setOpenImportHandsOn(true)
                  }}
                  text={I18n.t('pages.staggeredProposal.newStaggeredProposal.AddManual')}
                  icon="add"
                  backgroundGreen={false}
                  tooltip={I18n.t('pages.staggeredProposal.newStaggeredProposal.AddManual')}
                  disabled={false}
                />
              </AddButtonDiv>
            </Grid>
          </Grid>
          <TariffImportModal
            setClose={() => setOpenImport(false)}
            open={openImport}
            setShowList={() => setShowList(true)}
            />
          <TariffImportHandsOnModal
            setClose={() => setOpenImportHandsOn(false)}
            open={openImportHandsOn}
            setShowList={() => setShowList(true)}
          />
        </MainContainer>
      }
      {editMode &&
        <MainContainer ref={divRef}>
          <div id="step1">
            <Step1
              filled={filled}
              invalidInput={invalidInput}
              setCompleted={setCompleted}
              setFilled={setFilled}
              setStepLoaded={setStepLoaded}
            />
          </div>
          {stepLoaded.step1 && <>
            <div id="step2">
              <Step2
                invalidInput={invalidInput}
                setCompleted={setCompleted}
                setFilled={setFilled}
                ShowList={ShowList}
              />
            </div>
          </>
          }

          <Grid item xs={12} container direction="row" justify="flex-start" style={{ marginBottom: '100px' }}>
            <Grid item xs={2}>
              <ImportButtonDiv>
                <Button
                  id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_BUTTON_MODAL_IMPORT}
                  onAction={() => {
                    setOpenImport(true)
                  }}
                  text={I18n.t('pages.staggeredProposal.newStaggeredProposal.ImportTariff')}
                  icon="tariff"
                  backgroundGreen={true}
                  tooltip={I18n.t('pages.staggeredProposal.newStaggeredProposal.ImportTariff')}
                  disabled={false}
                />
              </ImportButtonDiv>
            </Grid>
            <Grid item xs={2}>
              <AddButtonDiv>
                <Button
                  id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_BUTTON_MODAL_IMPORT_ON_HANDS}
                  onAction={() => {
                    setOpenImportHandsOn(true)
                  }}
                  text={I18n.t('pages.staggeredProposal.newStaggeredProposal.AddManual')}
                  icon="add"
                  backgroundGreen={false}
                  tooltip={I18n.t('pages.staggeredProposal.newStaggeredProposal.AddManual')}
                  disabled={false}
                />
              </AddButtonDiv>
            </Grid>
          </Grid>
          <TariffImportModal
            setClose={() => setOpenImport(false)}
            open={openImport}
            setShowList={() => setShowList(true)}
            />
          <TariffImportHandsOnModal
            setClose={() => setOpenImportHandsOn(false)}
            open={openImportHandsOn}
            setShowList={() => setShowList(true)}
          />
          <ProposalDisplayModal
              open={openDisplay}
              setClose={() => setOpenDisplay(false)}
              idProposal={idProposal}
              downloadProposal={API.downloadStaggeredProposal}
            />
        </MainContainer>
      }
      {showSaveMessage &&
        <MessageContainer>
          <Messages
            buttonText={I18n.t('pages.staggeredProposal.newStaggeredProposal.saveMessage.buttonText')}
            closable={true}
            closeAlert={() => { setShowSaveMessage(false) } }
            closeMessage={I18n.t('pages.staggeredProposal.newStaggeredProposal.saveMessage.closeMessage')}
            goBack={() => { history.push('/propostaEscalonada') } }
            message={`${String(I18n.t('pages.staggeredProposal.newStaggeredProposal.saveMessage.message'))}, Ref: ${String(proposalRef)}.`}
            severity={'success'}
          />
        </MessageContainer>}
    </RootContainer>
  )
}

export default withTheme(NewStaggeredProposal)
