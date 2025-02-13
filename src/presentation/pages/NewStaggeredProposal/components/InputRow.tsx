import React, { useEffect, useState, useContext, Fragment } from 'react'
import {
  MenuItem,
  FormLabel,
  Grid,
  Popover
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import {
  SelectSpan,
  TextCell,
  TextInnerGreyCell,
  TextInnerCell
} from '../steps/StepsStyles'

import { withTheme } from 'styled-components'

import ControlledSelect from '../../../components/ControlledSelect'
import ControlledInput from '../../../components/ControlledInput'
import API from '../../../../infrastructure/api'
import { MenuIconCell, FloatingMenu } from 'fiorde-fe-components'

import RemoveIcon from '../../../../application/icons/RemoveIcon'

import {
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_AGENT,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_CIAAREA,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_COIN,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_VMINIMUM,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL45KG,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL100KG,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL300KG,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL500KG,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL1000KG,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_INPUT_UNTIL45KG,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_INPUT_UNTIL100KG,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_INPUT_UNTIL300KG,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_INPUT_UNTIL500KG,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_INPUT_UNTIL1000KG,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_BUTTON_DELETE,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_INPUT_FREQUENCY,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_SELECT_VLFREQUENCY,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_BUTTON_REMOVEDUPLICATE
} from '../../../../ids'

import { NumberInput, FormLabelInner, ButtonInner, RedText } from './styles'
import FormatNumber from '../../../../application/utils/formatNumber'
import { usePartnerList, useBusinessPartnerByType } from '../../../hooks'

import { StaggeredProposalContext, StaggeredProposalProps } from '../../StaggeredProposal/context/StaggeredProposalContext'

import { CurrencytemsTypes } from '../../../../application/enum/currencyEnum'

import { LocaleTypes } from '../../../../application/enum/enum'

interface InputRowProps {
  invalidInput?: boolean
  setCompleted?: (completed: any) => void
  setFilled?: (filled: any) => void
  theme: any
  item?: any
  chave?: any
}

interface Frequency {
  id: number
  description: string
}

const InputRow = ({
  invalidInput,
  setCompleted,
  setFilled,
  item,
  chave
}: InputRowProps): JSX.Element => {
  const { staggeredproposal, setStaggeredProposal }: StaggeredProposalProps = useContext(StaggeredProposalContext)

  const { partnerList: agentsList } = usePartnerList()
  const { airPartners } = useBusinessPartnerByType()
  const initialData = {
    until45kg: null,
    until100kg: null,
    until300kg: null,
    until500kg: null,
    until1000kg: null,
    frequency: null,
    vlFrequency: null
  }
  const [data, setData] = useState(initialData)

  const floatingButtonMenuItems = [
    {
      label: 'Excluir tarifa',
      onClick: (e) => {
        handleRemove()
      }
    }
  ]

  const MaxLenth = {
    maxLength: 13
  }

  const [state, setState] = useState({ anchorEl: null, currentKey: null })

  const handleClick = (event: any, key: any): void => {
    setState({ anchorEl: event.currentTarget, currentKey: key })
  }

  const handleClose = (): void => {
    setState({ anchorEl: null, currentKey: null })
  }

  const { anchorEl } = state
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const valuesFrequency = (e): any => {
    let value = parseInt(e.target.value, 10)
    if (value > 99) value = 99
    if (value < 1) value = 1
    setData({ ...data, frequency: value })
  }

  const [frequencyList, setFrequencyList] = useState<Frequency[]>([])

  useEffect(() => {
    void (async function () {
      await API.getFrequency()
        .then((response) => setFrequencyList(response))
        .catch((err) => console.log(err))
    })()
    if (item.freightValues[1] !== undefined) {
      setData({
        until45kg: { value: FormatNumber.convertNumberToString(item.freightValues[1]?.until45kg !== null ? item.freightValues[1]?.until45kg : null) },
        until100kg: { value: FormatNumber.convertNumberToString(item.freightValues[1]?.until100kg !== null ? item.freightValues[1]?.until100kg : null) },
        until300kg: { value: FormatNumber.convertNumberToString(item.freightValues[1]?.until300kg !== null ? item.freightValues[1]?.until300kg : null) },
        until500kg: { value: FormatNumber.convertNumberToString(item.freightValues[1]?.until500kg !== null ? item.freightValues[1]?.until500kg : null) },
        until1000kg: { value: FormatNumber.convertNumberToString(item.freightValues[1]?.until1000kg !== null ? item.freightValues[1]?.until1000kg : null) },
        frequency: item.frequency || null,
        vlFrequency: item.vlFrequency || null
      })
    }
    return () => {
      setData(initialData)
    }
  }, [])

  useEffect(() => {
    if (
      (data.until45kg !== null && String(data.until45kg) !== 'NaN') &&
      (data.until100kg !== null && String(data.until100kg) !== 'NaN') &&
      (data.until300kg !== null && String(data.until300kg) !== 'NaN') &&
      (data.until500kg !== null && String(data.until500kg) !== 'NaN') &&
      (data.until1000kg !== null && String(data.until1000kg) !== 'NaN') &&
      (data.frequency !== null && String(data.frequency) !== 'NaN') &&
      data.vlFrequency !== null && !item.duplicate) {
      setCompleted((currentState) => ({ ...currentState, step2: true }))
    } else {
      setCompleted((currentState) => ({ ...currentState, step2: false }))
    }
    if (data.until45kg !== null || data.until100kg !== null || data.until300kg !== null || data.until500kg !== null || data.until1000kg || data.frequency !== null || data.vlFrequency !== null) {
      setFilled((currentState) => {
        return { ...currentState, step2: true }
      })
    } else {
      setFilled((currentState) => {
        return { ...currentState, step2: false }
      })
    }
  }, [data])

  const rgxFloat = /^[0-9]*,?[0-9]*$/
  const validateFloatInput = (value: string): RegExpMatchArray | null => {
    return value.match(rgxFloat)
  }

  const handleValues = (e, key): void => {
    setData(
      {
        ...data,
        [key]: e.target.value
      }
    )
  }

  const handleRemove = (): void => {
    const staggered = staggeredproposal?.proposalTariff
    const newArr = staggered.filter((item, index) => index !== state.currentKey)
    setStaggeredProposal({
      ...staggeredproposal,
      proposalTariff: newArr
    })
    setData(initialData)
  }

  const handleRemoveDuplicated = (chave): any => {
    const staggered = staggeredproposal?.proposalTariff
    const newArr = staggered.filter((item, index) => index !== chave)
    setStaggeredProposal({
      ...staggeredproposal,
      proposalTariff: newArr
    })
    setData(initialData)
  }

  useEffect(() => {
    const originalData = staggeredproposal?.proposalTariff

    if (data.until45kg !== null || data.until100kg !== null || data.until300kg !== null || data.until500kg !== null || data.until1000kg !== null) {
      const updatedData = originalData.map((obj, index: number) => {
        if (index === chave) {
          return {
            ...obj,
            frequency: data.frequency,
            vlFrequency: data.vlFrequency,
            freightValues: [
              obj?.freightValues[0],
              {
                ...obj?.freightValues[1],
                vlMinimum: obj?.freightValues[0].vlMinimum,
                until45kg: data.until45kg?.value !== undefined ? data.until45kg.value : String(data.until45kg),
                until100kg: data.until100kg?.value !== undefined ? data.until100kg.value : String(data.until100kg),
                until300kg: data.until300kg?.value !== undefined ? data.until300kg.value : String(data.until300kg),
                until500kg: data.until500kg?.value !== undefined ? data.until500kg.value : String(data.until500kg),
                until1000kg: data.until1000kg?.value !== undefined ? data.until1000kg.value : String(data.until1000kg),
                buyOrSell: 'SELL'
              }
            ]
          }
        } else {
          return obj
        }
      })

      setStaggeredProposal({
        ...staggeredproposal,
        proposalTariff: updatedData
      })
    }
  }, [data])

  const getAgentName = (id): void => {
    const { simpleName } = agentsList.find((item: any) => item.id === id)
    return simpleName
  }

  const getBusinessPartnerName = (id): string => {
    const getObj = airPartners?.find((item: any) => item.businessPartner.id === id)
    const simpleName = getObj?.businessPartner?.simpleName
    return simpleName || ''
  }

  const checkNumber = (value): any => {
    if (typeof value === 'number' && !isNaN(value)) {
      return FormatNumber.convertNumberWithInterCoin(LocaleTypes.PT_BR, CurrencytemsTypes.BRL, Number(value))
    } else {
      return value
    }
  }

  return (
    <>
      <Grid
        container
        spacing={1}
      >
        <Grid item xs={2}>
          <FormLabelInner component="legend" id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_AGENT}>
            <TextCell>{getAgentName(item?.idAgent)}</TextCell>
          </FormLabelInner>
        </Grid>

        <Grid item xs={2}>
          <FormLabelInner component="legend" id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_CIAAREA}>
            {getBusinessPartnerName(item?.idBusinessPartnerTransporter)}
          </FormLabelInner>
        </Grid>

        <Grid item xs={1}>
          <FormLabelInner id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_COIN} component="legend">{item?.currency}</FormLabelInner>
        </Grid>

        {item?.freightValues?.map((line, index: number) => {
          if (line?.buyOrSell !== 'SELL') {
            return (
              <Fragment key={index}>
                  <Grid key={index} item xs={1}>
                    <FormLabelInner component="legend" id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_VMINIMUM}>
                      {checkNumber(line.vlMinimum)}
                    </FormLabelInner>
                  </Grid>
                  <Grid item xs={1}>
                    <FormLabelInner component="legend" center id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL45KG}>
                      {checkNumber(line.until45kg)}
                    </FormLabelInner>
                  </Grid>
                  <Grid item xs={1}>
                    <FormLabelInner component="legend" center
                    id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL100KG}>
                    {checkNumber(line.until100kg)}
                    </FormLabelInner>
                  </Grid>
                  <Grid item xs={1}>
                    <FormLabelInner component="legend" center
                    id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL300KG}
                    >
                     {checkNumber(line.until300kg)}
                    </FormLabelInner>
                  </Grid>
                  <Grid item xs={1}>
                    <FormLabelInner component="legend" center
                    id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL500KG}
                    >
                     {checkNumber(line.until500kg)}
                    </FormLabelInner>
                  </Grid>
                  <Grid item xs={1}>
                    <FormLabelInner component="legend" center
                    id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL1000KG}
                    >
                    {checkNumber(line.until1000kg)}
                    </FormLabelInner>
                  </Grid>
                  <Grid item xs={1}>
                  {item.duplicate
                    ? (
                        <FormLabelInner component="legend" center style={{ cursor: 'pointer' }}>
                          <RemoveIcon
                          id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_BUTTON_REMOVEDUPLICATE} onClick={() => handleRemoveDuplicated(chave)} />
                        </FormLabelInner>
                      )
                    : (
                        <>
                          <ButtonInner id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_BUTTON_DELETE} aria-describedby={id} onClick={(e) => handleClick(e, chave)}>
                            <MenuIconCell />
                          </ButtonInner>
                            <Popover
                              id={id}
                              open={open}
                              anchorEl={anchorEl}
                              onClose={handleClose}
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center'
                              }}
                              transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center'
                              }}
                            >
                                <FloatingMenu menuItems={floatingButtonMenuItems} />
                            </Popover>
                        </>
                      )}
                  </Grid>
              </Fragment>
            )
          }
          return <Fragment key={index}></Fragment>
        })}

      </Grid>

      <Grid
        container
        spacing={1}
        style={{
          padding: '10px 0px 0px 0px'
        }}
      >
        <Grid item xs={2}>
        </Grid>
        <Grid item xs={2}>
        </Grid>
        <Grid item xs={2}
            style={{
              background: '#F0F1F5'
            }}
        >
         <TextInnerGreyCell
          invalid={invalidInput && (data.until45kg === null || data.until100kg === null || data.until300kg === null || data.until500kg === null || data.until1000kg === null)}
          >
            Tarifas para venda:
          </TextInnerGreyCell>
        </Grid>
        <Grid item xs={1} style={{
          background: '#F0F1F5'
        }}>
          <NumberInput
            id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_INPUT_UNTIL45KG}
            decimalSeparator={','}
            thousandSeparator={'.'}
            decimalScale={2}
            format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
            customInput={ControlledInput}
            toolTipTitle=""
            invalid={invalidInput && (data.until45kg === null || String(data.until45kg) === 'NaN')}
            value={data.until45kg != null ? data.until45kg.value : ''}
            onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'until45kg') }}
            variant="outlined"
            size="small"
            modal
            style={{ marginRight: '3px' }}
            inputProps={MaxLenth}
          />
        </Grid>
        <Grid item xs={1} style={{
          background: '#F0F1F5'
        }}>
          <NumberInput
            id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_INPUT_UNTIL100KG}
            decimalSeparator={','}
            thousandSeparator={'.'}
            decimalScale={2}
            format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
            customInput={ControlledInput}
            toolTipTitle=""
            invalid={invalidInput && (data.until100kg === null || String(data.until100kg) === 'NaN')}
            value={data.until100kg != null ? data.until100kg.value : ''}
            onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'until100kg') }}
            variant="outlined"
            size="small"
            modal
            style={{ marginRight: '3px' }}
            inputProps={MaxLenth}
          />
        </Grid>
        <Grid item xs={1} style={{
          background: '#F0F1F5'
        }}>
          <NumberInput
            id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_INPUT_UNTIL300KG}
            decimalSeparator={','}
            thousandSeparator={'.'}
            decimalScale={2}
            format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
            customInput={ControlledInput}
            toolTipTitle=""
            invalid={invalidInput && (data.until300kg === null || String(data.until300kg) === 'NaN')}
            value={data.until300kg != null ? data.until300kg.value : ''}
            onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'until300kg') }}
            variant="outlined"
            size="small"
            modal
            style={{ marginRight: '3px' }}
            inputProps={MaxLenth}
          />
        </Grid>
        <Grid item xs={1} style={{
          background: '#F0F1F5'
        }} >
          <NumberInput
            id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_INPUT_UNTIL500KG}
            decimalSeparator={','}
            thousandSeparator={'.'}
            decimalScale={2}
            format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
            customInput={ControlledInput}
            toolTipTitle=""
            invalid={invalidInput && (data.until500kg === null || String(data.until500kg) === 'NaN')}
            value={data.until500kg != null ? data.until500kg.value : ''}
            onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'until500kg') }}
            variant="outlined"
            size="small"
            modal
            style={{ marginRight: '3px' }}
            inputProps={MaxLenth}
          />
        </Grid>
        <Grid item xs={1} style={{
          background: '#F0F1F5'
        }} >
          <NumberInput
            id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_INPUT_UNTIL1000KG}
            decimalSeparator={','}
            thousandSeparator={'.'}
            decimalScale={2}
            format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
            customInput={ControlledInput}
            toolTipTitle=""
            invalid={invalidInput && (data.until1000kg === null || String(data.until1000kg) === 'NaN')}
            value={data.until1000kg != null ? data.until1000kg.value : ''}
            onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'until1000kg') }}
            variant="outlined"
            size="small"
            modal
            style={{ marginRight: '3px' }}
            inputProps={MaxLenth}
          />
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>

      <Grid
        container
        spacing={1}
        style={{
          padding: '10px 0px 10px 0px'
        }}
      >
        <Grid item xs={2}>
        </Grid>
        <Grid item xs={2}>
        </Grid>
        <Grid item xs={2}>
          <TextInnerCell invalid={invalidInput && (data.frequency === null || data.vlFrequency === null)}>Frequência*:</TextInnerCell>
        </Grid>
        <Grid item xs={1}>
          <ControlledInput
            id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_INPUT_FREQUENCY}
            toolTipTitle={I18n.t('components.itemModal.requiredField')}
            invalid={invalidInput && data.frequency === null}
            variant="outlined"
            value={data.frequency || ''}
            size="small"
            InputProps={{
              inputProps: {
                max: 99,
                min: 1
              }
            }}
            type="number"
            // onChange={(e) => setData({ ...data, frequency: e.target.value })}
            onChange={(e) => {
              valuesFrequency(e)
            }}
          />
        </Grid>
        <Grid item xs={1} style={{ marginTop: '15px' }}>
          <FormLabel component="span" style={{ margin: '0 0 0 10px' }}>
            {I18n.t('pages.newProposal.step4.times')}
          </FormLabel>
        </Grid>
        <Grid item xs={3}>
            <ControlledSelect
              labelId="frequency-label"
              id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_SELECT_VLFREQUENCY}
              value={data.vlFrequency || ''}
              onChange={(e) => setData({ ...data, vlFrequency: e.target.value })}
              displayEmpty
              disableUnderline
              invalid={invalidInput && data.vlFrequency === null}
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
            >
              <MenuItem disabled value={data.vlFrequency}>
                <SelectSpan placeholder={1}>
                  {I18n.t('pages.newProposal.step4.choose')}
                </SelectSpan>
              </MenuItem>
              {frequencyList.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  <SelectSpan>{item.description}</SelectSpan>
                </MenuItem>
              ))}
            </ControlledSelect>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
      {item.duplicate && (
        <Grid
          container
          spacing={1}
          style={{
            padding: '10px 0px 10px 0px'
          }}
        >
          <Grid item xs={6}>
            <RedText>
              {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.duplicateTariffText')}
            </RedText>
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default withTheme(InputRow)
