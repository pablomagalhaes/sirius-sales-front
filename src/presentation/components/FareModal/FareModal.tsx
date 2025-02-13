import React, { useState, useEffect, useContext } from 'react'
import { MenuItem, Modal, Box } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import CloseIcon from '../../../application/icons/CloseIcon'
import { I18n } from 'react-redux-i18n'
import {
  ButtonDiv,
  CloseIconContainer,
  Form,
  HeaderDiv,
  Label,
  ModalContainer,
  PlaceholderDiv,
  PlaceholderSpan,
  RedColorSpan,
  RowDiv,
  RowReverseDiv,
  Title
} from '../StyledComponents/modalStyles'
import ControlledSelect from '../ControlledSelect'
import { Input } from '../CostModal/CostModalStyles'
import { Button } from 'fiorde-fe-components'
import ControlledToolTip from '../ControlledToolTip/ControlledToolTip'
import { Container, MenuItemContent } from './FareModalStyles'
import API from '../../../infrastructure/api'
import { ItemModalData } from '../ItemModal/ItemModal'
import { NumberInput, StyledPaper } from '../../pages/NewProposal/steps/StepsStyles'
import FormatNumber from '../../../application/utils/formatNumber'
import { ProposalContext, ProposalProps } from '../../../presentation/pages/NewProposal/context/ProposalContext'
import { ModalTypes, SpecificationsType } from '../../../application/enum/enum'
import { FareItemsTypes } from '../../../application/enum/costEnum'
import { useCalculationTypes } from '../../hooks/index'

export interface FareModalData {
  idCost?: number | null
  idProposal?: number | null
  id: number | null
  saleCurrency: string
  saleValue: string
  minimumValue: string
  expense: string | null
  selectedContainer: string | null
  selectedAgent?: string | null
  type: string
  totalItem?: string
  agent?: any
  idCalculationType?: number | null
}

interface FareModalProps {
  dataProp: FareModalData
  action: (item) => void
  open: boolean
  setClose: () => void
  title: string
  modal: string
  specifications: string
  containerItems: ItemModalData[]
  currency: any
  AllAgents?: any[]
}

export const initialState = {
  type: '',
  expense: null,
  agent: {
    agent: '',
    id: null,
    idBusinessPartnerAgent: null,
    shippingCompany: '',
    idBusinessPartnerTransportCompany: null
  },
  selectedAgent: '',
  saleValue: '',
  minimumValue: '',
  saleCurrency: 'BRL',
  selectedContainer: null,
  id: null,
  idCalculationType: null
}

const FareModal = ({
  dataProp,
  action,
  open,
  setClose,
  title,
  modal,
  specifications,
  containerItems,
  currency,
  AllAgents
}: FareModalProps): JSX.Element => {
  const [data, setData] = useState<FareModalData>(initialState)
  const [invalidInput, setInvalidInput] = useState(false)
  const [typeList, setTypeList] = useState<object[]>([])
  const [serviceList, setServiceList] = useState<any[]>([])
  const [currencyList, setCurrencyList] = useState<any[]>([])
  const [agentList, setAgentList] = useState<any[]>([])
  const { proposal }: ProposalProps = useContext(ProposalContext)

  const { data: calculationTypes = [] } = useCalculationTypes()

  const verifyContainerItems = (): void => {
    if (containerItems.length === 1) {
      setData({ ...data, selectedContainer: containerItems[0].type })
    } else {
      setData({ ...data, selectedContainer: '' })
    }
  }

  useEffect(() => {
    verifyContainerItems()
  }, [containerItems])

  const rgxFloat = /^[0-9]*,?[0-9]*$/

  const validateFloatInput = (value: string): RegExpMatchArray | null => {
    return value.match(rgxFloat)
  }

  const isValid = (): boolean => {
    return !(
      data.idCalculationType === null ||
      data.saleValue.length === 0 ||
      data.saleCurrency.length === 0 ||
      (data.expense === null || data.expense?.length === 0)
    )
  }

  const saleValueHandler = (e): void => {
    const validatedInput = validateFloatInput(e.target.value)
    if (validatedInput !== null) {
      setData({ ...data, saleValue: validatedInput[0] })
    }
  }

  const minimumValueHandler = (e): void => {
    const validatedInput = validateFloatInput(e.target.value)
    if (validatedInput !== null) {
      setData({ ...data, minimumValue: validatedInput[0] })
    }
  }

  const handleOnClose = (): void => {
    setData(initialState)
    setInvalidInput(false)
    setClose()
  }

  const handleAction = (): void => {
    if (isValid()) {
      const newData = data
      newData.agent = agentList.find(a => a.agent === newData.selectedAgent)
      action(newData)
      handleOnClose()
    } else {
      setInvalidInput(true)
    }
  }

  const getAgents = (): any => {
    const proposalAgentsidBusinessPartnerAgent = proposal.agents.map(a => a.idBusinessPartnerAgent)
    const getSomeAgents = AllAgents?.map(a => proposalAgentsidBusinessPartnerAgent.includes(a?.businessPartner?.id)
      ? ({
          idBusinessPartnerAgent: a?.businessPartner?.id,
          agent: a?.businessPartner?.simpleName,
          idBusinessPartnerTransportCompany: proposal.agents.find(find => find.idBusinessPartnerAgent === a?.businessPartner?.id)?.idBusinessPartnerTransportCompany
        })
      : null)
    return getSomeAgents?.filter(f => f != null)
  }

  useEffect(() => {
    if (dataProp !== initialState) {
      setData({ ...dataProp })
    } else if (proposal.agents.length === 1 && AllAgents !== undefined && currency.length !== 0) {
      setData({ ...data, selectedAgent: getAgents()[0]?.agent, saleCurrency: currency })
    }
  }, [open])

  useEffect(() => {
    void (async function () {
      await API.getCurrencies()
        .then((response) => setCurrencyList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    void (async function () {
      await API.getService()
        .then((response) => setServiceList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    if (AllAgents !== undefined) {
      setAgentList(getAgents())
    }
  }, [proposal, AllAgents])

  useEffect(() => {
    let newTypeList = []

    if (calculationTypes?.length > 0) {
      switch (true) {
        case modal === ModalTypes.Sea && specifications === SpecificationsType.Fcl:
          newTypeList = calculationTypes.filter(item => item.txCalculationType === FareItemsTypes.Container || item.txCalculationType === FareItemsTypes.Bl)
            .map(item => ({ name: item.txCalculationType, value: item.idCalculationType }))
          break
        case (modal === ModalTypes.Sea && specifications === SpecificationsType.Lcl) ||
             (modal === ModalTypes.Sea && specifications === SpecificationsType.BreakBulk) ||
             (modal === ModalTypes.Sea && specifications === SpecificationsType.Roro):
          newTypeList = calculationTypes.filter(item => item.txCalculationType === FareItemsTypes.Ton || item.txCalculationType === FareItemsTypes.Bl)
            .map(item => ({ name: item.txCalculationType, value: item.idCalculationType }))
          break
        case modal === ModalTypes.Air:
          newTypeList = calculationTypes
            .filter(item => item.txCalculationType === FareItemsTypes.Kilo || item.txCalculationType === FareItemsTypes.Fixed || item.txCalculationType === FareItemsTypes.Cw)
            .map(item => ({ name: item.txCalculationType, value: item.idCalculationType }))
          break
        case modal === ModalTypes.Land:
          newTypeList = calculationTypes
            .filter(item => item.txCalculationType === FareItemsTypes.Fixed)
            .map(item => ({ name: item.txCalculationType, value: item.idCalculationType }))
          break
        default:
          newTypeList = []
      }

      setTypeList(newTypeList)
    }
  }, [modal, specifications, calculationTypes])

  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalContainer>
        <HeaderDiv>
          <Title>{title}</Title>
          <RowReverseDiv>
            <CloseIconContainer>
              <CloseIcon onClick={handleOnClose} />
            </CloseIconContainer>
          </RowReverseDiv>
        </HeaderDiv>
        <Form>
          <RowDiv>
            <Label width="350px" color={invalidInput && (data.expense === null || data.expense?.length === 0) ? 'red' : ''}>
              {I18n.t('components.fareModal.expense')}
              <RedColorSpan> *</RedColorSpan>
            </Label>
            <Label width="113px" paddingLeft="10px" color={invalidInput && (data.type === null || data.type.length === 0) ? 'red' : ''}>
              {I18n.t('components.fareModal.type')}
              <RedColorSpan> *</RedColorSpan>
            </Label>
          </RowDiv>

          <RowDiv margin={true}>
            <Container width="350px" height="32px">
              <Autocomplete
                onChange={(e, newValue) => setData({ ...data, expense: newValue })}
                options={serviceList.map((option) => option.service)}
                value={data.expense}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <Input
                      {...params.inputProps}
                      toolTipTitle={I18n.t('components.itemModal.requiredField')}
                      invalid={invalidInput && (data.expense === null || data.expense?.length === 0)}
                      filled={data.expense}
                      placeholder={I18n.t('components.fareModal.choose')}
                      style={{ width: '350px' }}
                    />
                    <Box {...params.inputProps} className="dropdownCustom">
                      <ArrowDropDownIcon />
                    </Box>
                  </div>
                )}
                PaperComponent={(params: any) => <StyledPaper {...params} />}
              />
            </Container>
            <Container width="150px" height="32px" margin="0 0 5px 10px">
              <ControlledSelect
                onChange={(e) => setData({ ...data, idCalculationType: e.target.value })}
                displayEmpty
                value={data.idCalculationType}
                disableUnderline
                placeholder={data.idCalculationType}
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={invalidInput && (data.idCalculationType === null)}
              >
                <MenuItem disabled value="">
                  <MenuItemContent>
                    {I18n.t('components.fareModal.choose')}
                  </MenuItemContent>
                </MenuItem>
                {typeList.map((item: any) => {
                  return (
                    <MenuItem key={item.value} value={item.value}>
                      <MenuItemContent>{item.name}</MenuItemContent>
                    </MenuItem>
                  )
                })}
              </ControlledSelect>
            </Container>
          </RowDiv>

          {agentList?.length > 0 && (
            <> <RowDiv>
                <Label width="513px" color={invalidInput && (data.agent?.agent === '' || data.agent?.agent === null) ? 'red' : ''}>
                  {I18n.t('components.fareModal.agent')}
                  <RedColorSpan> *</RedColorSpan>
                </Label>
              </RowDiv>

              <RowDiv margin={true}>
                <Container width="513px" height="32px">
                  <Autocomplete
                    onChange={(e, newValue) => setData({ ...data, selectedAgent: newValue })}
                    options={agentList.map(agent => agent.agent)}
                    value={data.selectedAgent}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <Input
                          {...params.inputProps}
                          filled={data.selectedAgent}
                          toolTipTitle={I18n.t('components.itemModal.requiredField')}
                          invalid={invalidInput && (data.agent?.agent === '' || data.agent?.agent === null)}
                          placeholder={I18n.t('components.fareModal.choose')}
                          style={{ width: '513px' }}
                        />
                        <Box {...params.inputProps} className="dropdownCustom">
                          <ArrowDropDownIcon />
                        </Box>
                      </div>
                    )}
                    PaperComponent={(params: any) => <StyledPaper {...params} />}
                  />
                </Container>
              </RowDiv></>
          )}

          {specifications === 'fcl' && (
            <><RowDiv>
              <Label width="100%">
                {I18n.t('components.costModal.container')}
                <RedColorSpan> *</RedColorSpan>
              </Label>
            </RowDiv>
              <RowDiv style={{ position: 'relative' }} margin={true}>
                <Autocomplete
                  options={containerItems.map((item) => item.type)}
                  value={data.selectedContainer}
                  onChange={(e, newValue) => setData({ ...data, selectedContainer: newValue })}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <Input
                        {...params.inputProps}
                        filled={data.selectedContainer}
                        placeholder={I18n.t('components.costModal.choose')}
                        toolTipTitle={I18n.t('components.itemModal.requiredField')}
                        invalid={invalidInput && data.selectedContainer === ''}
                        style={{ width: '513px' }}
                      />
                      <Box {...params.inputProps} className="dropdownContainer">
                        <ArrowDropDownIcon />
                      </Box>
                    </div>
                  )}
                  PaperComponent={(params: any) => <StyledPaper {...params} />}
                />
              </RowDiv></>
          )}
          <RowDiv>
            <Label width="263px" color={invalidInput && data.saleValue.length === 0 ? 'red' : ''} >
              {I18n.t('components.fareModal.saleValue')}
              <RedColorSpan> *</RedColorSpan>
            </Label>
            <Label>
              {I18n.t('components.fareModal.minimum')}
            </Label>
          </RowDiv>
          <RowDiv>
            <Container style={{ position: 'relative', marginRight: '14px' }}>
              <Autocomplete
                value={currency}
                options={currencyList.map((option) => option.id)}
                disabled={true}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <Input
                      {...params.inputProps}
                      width="84px"
                      placeholder={data.saleCurrency}
                      toolTipTitle={I18n.t('components.itemModal.requiredField')}
                      invalid={invalidInput && data.saleCurrency.length === 0}
                      disabled={true}
                    />
                    <Box className="dropdown">
                      <ArrowDropDownIcon />
                    </Box>
                  </div>
                )}
                PaperComponent={(params: any) => <StyledPaper {...params} />}
              />
            </Container>
            <ControlledToolTip
              title={I18n.t('components.itemModal.requiredField')}
              open={invalidInput && data.saleValue.length === 0}
            >
              <PlaceholderDiv>
                <label>
                  {data.saleValue.length === 0 && (
                    <PlaceholderSpan>
                      {I18n.t('components.fareModal.value')}
                    </PlaceholderSpan>
                  )}
                  <NumberInput
                    decimalSeparator={','}
                    thousandSeparator={'.'}
                    decimalScale={2}
                    customInput={Input}
                    format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                    onChange={saleValueHandler}
                    value={data.saleValue}
                    filled={data.saleValue}
                    invalid={invalidInput && data.saleValue.length === 0}
                  />
                </label>
              </PlaceholderDiv>
            </ControlledToolTip>
            <PlaceholderDiv>
              <label>
                {data.minimumValue.length === 0 && (
                  <PlaceholderSpan>
                    {I18n.t('components.fareModal.value')}
                  </PlaceholderSpan>
                )}
                <NumberInput
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  customInput={Input}
                  format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                  onChange={minimumValueHandler}
                  value={data.minimumValue}
                  filled={data.minimumValue}
                />
              </label>
            </PlaceholderDiv>
          </RowDiv>
          <RowDiv>
            <ButtonDiv>
              <Button
                disabled={false}
                text={I18n.t('components.itemModal.save')}
                backgroundGreen={true}
                icon=""
                onAction={handleAction}
                tooltip={I18n.t('components.itemModal.save')}
              />
            </ButtonDiv>
          </RowDiv>
        </Form>
      </ModalContainer>
    </Modal>
  )
}
export default FareModal
