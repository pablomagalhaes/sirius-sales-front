import React, { useEffect, useState, useContext } from 'react'
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

import IconComponent from '../../../../application/icons/IconComponent'
import { withTheme } from 'styled-components'

import ControlledSelect from '../../../components/ControlledSelect'
import ControlledInput from '../../../components/ControlledInput'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
import API from '../../../../infrastructure/api'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { MenuIconCell, FloatingMenu } from 'fiorde-fe-components'

import { NumberInput, FormLabelInner, ButtonInner } from './styles'
import FormatNumber from '../../../../application/utils/formatNumber'

import { StaggeredProposalContext, StaggeredProposalProps } from '../../StaggeredProposal/context/StaggeredProposalContext'
import { LineSeparator } from '../../NewProposalExportation/steps/StepsStyles'

interface InputRowProps {
  invalidInput?: boolean
  setCompleted?: (completed: any) => void
  setFilled?: (filled: any) => void
  theme: any
  item?: any
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
  item
}: InputRowProps): JSX.Element => {
  const { staggeredproposal, setStaggeredProposal }: StaggeredProposalProps = useContext(StaggeredProposalContext)

  const [data, setData] = useState({
    until45kg: null,
    until100kg: null,
    until300kg: null,
    until500kg: null,
    until1000kg: null,
    frequency: null,
    vlFrequency: null
  })

  // const [open, setOpen] = useState(false);

  const floatingButtonMenuItems = [
    {
      label: 'Excluir tarifa',
      onClick: () => {
        handleRemove()
        // console.log('Item removido')
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
  }, [])

  // const decimalToString = (value: number | null | undefined): string => {
  //   if (value !== null && value !== undefined) { return String(value?.toFixed(2)).replace('.', ',') }
  //   return ''
  // }

  const rgxFloat = /^[0-9]*,?[0-9]*$/
  const validateFloatInput = (value: string): RegExpMatchArray | null => {
    return value.match(rgxFloat)
  }

  const handleValues = (e, key): void => {
    setData(
      {
        ...data,
        [key]: parseInt(e.target.value)
      }
    )
  }

  const handleRemove = (): void => {
    const tariff = item.idProposalTariff
    const staggered = staggeredproposal?.proposalTariff
    const newArr = staggered.filter((obj) => obj.idProposalTariff !== tariff)

    setStaggeredProposal({
      ...staggeredproposal,
      proposalTariff: newArr
    })
  }

  useEffect(() => {
    console.log('handleValues staggeredproposal', staggeredproposal)
    console.log('handleValues data', data)

    const id = item.idProposalTariff
    const originalData = staggeredproposal?.proposalTariff

    const updatedData = originalData.map((obj, index) => {
      if (obj.idProposalTariff === id) {
        return {
          ...obj,
          frequency: data.frequency,
          vlFrequency: data.vlFrequency,
          freightValues: [
            {
              vlMinimum: obj?.freightValues[index].vlMinimum,
              until45kg: data.until45kg !== null ? String(data.until45kg) : obj.freightValues[index].until45kg,
              until100kg: data.until100kg !== null ? String(data.until100kg) : obj.freightValues[index].until100kg,
              until300kg: data.until300kg !== null ? String(data.until300kg) : obj.freightValues[index].until300kg,
              until500kg: data.until500kg !== null ? String(data.until500kg) : obj.freightValues[index].until500kg,
              until1000kg: data.until1000kg !== null ? String(data.until1000kg) : obj.freightValues[index].until1000kg,
              buyOrSell: obj?.freightValues[index].buyOrSell
            }
          ]
        }
      }
    })

    console.log('updatedData', updatedData)
    
  }, [data])

  console.log('item', item)

  return (
    <>
      <Title>2.1 De {item?.origin} - {item?.destination}</Title>
      <Grid
        container
        spacing={1}
      >
        <Grid item xs={2}>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.agent')}:
          </FormLabel>
        </Grid>
        <Grid item xs={2}>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.ciaArea')}
          </FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.coin')}
          </FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.minValue')}
          </FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.45')}
          </FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.100')}
          </FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.300')}
          </FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.500')}
          </FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.1ton')}
          </FormLabel>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
      <Divider />
      <Grid
        container
        spacing={1}
      >
        <Grid item xs={2}>
          <FormLabelInner component="legend">
            <TextCell>{item?.nmAgent}</TextCell>
          </FormLabelInner>
        </Grid>

        <Grid item xs={2}>
          <FormLabelInner component="legend">{item?.dsBusinessPartnerTransporter}</FormLabelInner>
        </Grid>
        <Grid item xs={1}>
          <FormLabelInner component="legend">{item?.currency}</FormLabelInner>
        </Grid>

        {item?.freightValues?.map((line, index: number) => {
          return (
              <>
                <Grid item xs={1}>
                  <FormLabelInner component="legend">
                    {FormatNumber.rightToLeftFormatter(line.vlMinimum, 2)}
                  </FormLabelInner>
                </Grid>
                <Grid item xs={1}>
                  <FormLabelInner component="legend">
                    {FormatNumber.rightToLeftFormatter(line.until45kg, 2)}
                  </FormLabelInner>
                </Grid>
                <Grid item xs={1}>
                  <FormLabelInner component="legend">
                    {FormatNumber.rightToLeftFormatter(line.until100kg, 2)}
                  </FormLabelInner>
                </Grid>
                <Grid item xs={1}>
                  <FormLabelInner component="legend">
                    {FormatNumber.rightToLeftFormatter(line.until300kg, 2)}
                  </FormLabelInner>
                </Grid>
                <Grid item xs={1}>
                  <FormLabelInner component="legend">
                    {FormatNumber.rightToLeftFormatter(line.until500kg, 2)}
                  </FormLabelInner>
                </Grid>
                <Grid item xs={1}>
                  <FormLabelInner component="legend">
                    {FormatNumber.rightToLeftFormatter(line.until1000kg, 2)}
                  </FormLabelInner>
                </Grid>
                <Grid item xs={1}>
                  <ButtonInner aria-describedby={id} onClick={handleClick}>
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
              </>
          )
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
            decimalSeparator={','}
            thousandSeparator={'.'}
            decimalScale={2}
            format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
            customInput={ControlledInput}
            toolTipTitle={I18n.t('components.tariffModal.requiredField')}
            invalid={invalidInput && data.until300kg === null}
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
            decimalSeparator={','}
            thousandSeparator={'.'}
            decimalScale={2}
            format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
            customInput={ControlledInput}
            toolTipTitle={I18n.t('components.tariffModal.requiredField')}
            invalid={invalidInput && data.until1000kg === null}
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
                id="frequency"
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={invalidInput && data.frequency.length === 0}
                variant="outlined"
                value={data.frequency}
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
              id="vlFrequency"
              value={data.vlFrequency}
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
