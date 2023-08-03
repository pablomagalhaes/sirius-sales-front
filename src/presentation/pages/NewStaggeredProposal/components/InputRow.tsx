import React, { useEffect, useState, useContext, Fragment } from 'react'
import {
  MenuItem,
  FormLabel,
  Grid,
  Divider,
  Popover
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import {
  Title,
  SelectSpan,
  TextCell,
  InputContainer,
  TextInnerGreyCell,
  TextInnerCell
} from '../steps/StepsStyles'

import { withTheme } from 'styled-components'

import ControlledSelect from '../../../components/ControlledSelect'
import ControlledInput from '../../../components/ControlledInput'
import API from '../../../../infrastructure/api'
import { MenuIconCell, FloatingMenu } from 'fiorde-fe-components'

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
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_SELECT_VLFREQUENCY
} from '../../../../ids'

import { NumberInput, FormLabelHeader, FormLabelInner, ButtonInner } from './styles'
import FormatNumber from '../../../../application/utils/formatNumber'
import { usePartnerList, useBusinessPartnerByType } from '../../../hooks'

import { StaggeredProposalContext, StaggeredProposalProps } from '../../StaggeredProposal/context/StaggeredProposalContext'

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
  theme,
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
      onClick: () => {
        handleRemove()
      }
    }
  ]

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: any, chave: number): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (): void => {
    setAnchorEl(null)
  }

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
        until45kg: { value: item.freightValues[1]?.until45kg },
        until100kg: { value: item.freightValues[1]?.until100kg },
        until300kg: { value: item.freightValues[1]?.until300kg },
        until500kg: { value: item.freightValues[1]?.until500kg },
        until1000kg: { value: item.freightValues[1]?.until1000kg },
        frequency: item.frequency || null,
        vlFrequency: item.vlFrequency || null
      })
    }
    return () => {
      setData(initialData)
    }
  }, [])

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
    const newArr = staggered.filter((item, index) => index !== chave)
    setStaggeredProposal({
      ...staggeredproposal,
      proposalTariff: newArr
    })
  }

  useEffect(() => {
    const originalData = staggeredproposal?.proposalTariff

    if (data.until45kg !== null || data.until100kg !== null || data.until300kg !== null || data.until500kg !== null || data.until1000kg !== null) {
      const updatedData = originalData.map((obj, index) => {
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

  return (
    <>
      <Title>2.{(Number(chave) + 1)} De {item?.origin} - {item?.destination}</Title>
      <Grid
        container
        spacing={1}
        alignItems="center"
      >
        <Grid item xs={2}>
          <FormLabelHeader component="legend" id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_AGENT}>
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.agent')}:
          </FormLabelHeader>
        </Grid>
        <Grid item xs={2}>
          <FormLabelHeader component="legend" id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_CIAAREA}>
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.ciaArea')}
          </FormLabelHeader>
        </Grid>
        <Grid item xs={1}>
          <FormLabelHeader component="legend" id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_COIN}>
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.coin')}
          </FormLabelHeader>
        </Grid>
        <Grid item xs={1}>
          <FormLabelHeader component="legend" id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_VMINIMUM}>
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.minValue')}
          </FormLabelHeader>
        </Grid>
        <Grid item xs={1}>
          <FormLabelHeader component="legend" center id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL45KG}>
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.45')}
          </FormLabelHeader>
        </Grid>
        <Grid item xs={1}>
          <FormLabelHeader component="legend" center id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL100KG}>
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.100')}
          </FormLabelHeader>
        </Grid>
        <Grid item xs={1}>
          <FormLabelHeader component="legend" center id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL300KG}>
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.300')}
          </FormLabelHeader>
        </Grid>
        <Grid item xs={1}>
          <FormLabelHeader component="legend" center id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL500KG}>
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.500')}
          </FormLabelHeader>
        </Grid>
        <Grid item xs={1}>
          <FormLabelHeader component="legend" center id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL1000KG}>
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.1ton')}
          </FormLabelHeader>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
      <Divider />
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
                      {line.vlMinimum !== null ? Number(line.vlMinimum.toString().replace(',', '.')).toFixed(2).replace('.', ',') : '-'}
                    </FormLabelInner>
                  </Grid>
                  <Grid item xs={1}>
                    <FormLabelInner component="legend" center id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL45KG}>
                      {line.until45kg !== null ? Number(line.until45kg.toString().replace(',', '.')).toFixed(2).replace('.', ',') : '-'}
                    </FormLabelInner>
                  </Grid>
                  <Grid item xs={1}>
                    <FormLabelInner component="legend" center
                    id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL100KG}>
                      {line.until100kg !== null ? Number(line.until100kg.toString().replace(',', '.')).toFixed(2).replace('.', ',') : '-'}
                    </FormLabelInner>
                  </Grid>
                  <Grid item xs={1}>
                    <FormLabelInner component="legend" center
                    id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL300KG}
                    >
                      {line.until300kg !== null ? Number(line.until300kg.toString().replace(',', '.')).toFixed(2).replace('.', ',') : '-'}
                    </FormLabelInner>
                  </Grid>
                  <Grid item xs={1}>
                    <FormLabelInner component="legend" center
                    id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL500KG}
                    >
                      {line.until500kg !== null ? Number(line.until500kg.toString().replace(',', '.')).toFixed(2).replace('.', ',') : '-'}
                    </FormLabelInner>
                  </Grid>
                  <Grid item xs={1}>
                    <FormLabelInner component="legend" center
                    id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL1000KG}
                    >
                      {line.until1000kg !== null ? Number(line.until1000kg.toString().replace(',', '.')).toFixed(2).replace('.', ',') : '-'}
                    </FormLabelInner>
                  </Grid>
                  <Grid item xs={1}>
                    <ButtonInner id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_BUTTON_DELETE} aria-describedby={id} onClick={handleClick}>
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
                  </Grid>
              </Fragment>
            )
          }
          return <></>
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
         <TextInnerGreyCell>Tarifas para venda:</TextInnerGreyCell>
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
            toolTipTitle={I18n.t('components.tariffModal.requiredField')}
            invalid={invalidInput && data.until45kg === null}
            value={data.until45kg != null ? data.until45kg.value : ''}
            onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'until45kg') }}
            variant="outlined"
            size="small"
            modal
            style={{ marginRight: '3px' }}
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
            toolTipTitle={I18n.t('components.tariffModal.requiredField')}
            invalid={invalidInput && data.until100kg === null}
            value={data.until100kg != null ? data.until100kg.value : ''}
            onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'until100kg') }}
            variant="outlined"
            size="small"
            modal
            style={{ marginRight: '3px' }}
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
            toolTipTitle={I18n.t('components.tariffModal.requiredField')}
            invalid={invalidInput && data.until300kg.value === null}
            value={data.until300kg != null ? data.until300kg.value : ''}
            onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'until300kg') }}
            variant="outlined"
            size="small"
            modal
            style={{ marginRight: '3px' }}
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
            toolTipTitle={I18n.t('components.tariffModal.requiredField')}
            invalid={invalidInput && data.until500kg === null}
            value={data.until500kg != null ? data.until500kg.value : ''}
            onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'until500kg') }}
            variant="outlined"
            size="small"
            modal
            style={{ marginRight: '3px' }}
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
            toolTipTitle={I18n.t('components.tariffModal.requiredField')}
            invalid={invalidInput && data.until1000kg.value === null}
            value={data.until1000kg != null ? data.until1000kg.value : ''}
            onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'until1000kg') }}
            variant="outlined"
            size="small"
            modal
            style={{ marginRight: '3px' }}
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
          <TextInnerCell>Frequência:</TextInnerCell>
        </Grid>
        <Grid item xs={1}>
            <InputContainer>
              <ControlledInput
                id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_INPUT_FREQUENCY}
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={invalidInput && data.frequency.length === 0}
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
            </InputContainer>
        </Grid>
        <Grid item xs={1} style={{ alignSelf: 'center' }}>
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
              invalid={invalidInput && data.vlFrequency.length === 0}
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
    </>
  )
}

export default withTheme(InputRow)
