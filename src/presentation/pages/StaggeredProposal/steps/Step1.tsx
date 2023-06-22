import React, { useEffect, useState } from 'react'
import {
  MenuItem,
  FormLabel,
  Grid,
  InputAdornment
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import {
  Title,
  Subtitle,
  SelectSpan,
  Separator
} from '../style'

import IconComponent from '../../../../application/icons/IconComponent'
import { withTheme } from 'styled-components'

import ControlledSelect from '../../../components/ControlledSelect'
import ControlledInput from '../../../components/ControlledInput'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
import API from '../../../../infrastructure/api'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { StyledPaper } from './StepsStyles'
import { PickerDateRange } from 'fiorde-fe-components'

export interface Filled {
  step2: boolean
}
export interface Step1Props {
  theme?: any
  invalidInput: boolean
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  filled: Filled
  setStepLoaded: (steps: any) => void
}

const Step1 = ({
  theme,
  invalidInput,
  setCompleted,
  setFilled,
  filled,
  setStepLoaded
}: Step1Props): JSX.Element => {
  const [vigencyDate, setVigencyDate] = React.useState([null, null]);
  const [partnerList, setPartnerList] = useState<any[]>([]);
  const [data, setData] = useState({
    operation: '',
    vigencyDate: vigencyDate,
    proposalValue: '',
    requester: ''
  })

  const operationList = [
    {
      id: 1,
      operation: 'Importação'
    },
    {
      id: 2,
      operation: 'Exportação'
    }
  ]

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getPartners = new Promise<void>((resolve) => {
      API.getPartner()
        .then((response) => {
          setPartnerList(response)
          resolve()
        })
        .catch((err) => console.log(err))
    })
    setStepLoaded((currentState) => ({ ...currentState, step1: true }))
  }, [])

  useEffect(() => {
    setData({ ...data, vigencyDate: vigencyDate })
  }, [vigencyDate])

  useEffect(() => {
    if (data.proposalValue !== '' && data.operation !== '') {
      setCompleted((currentState) => ({ ...currentState, step1: true }));
    } else {
      setCompleted((currentState) => ({ ...currentState, step1: false }));
    }
    if (data.proposalValue !== '' || data.operation !== '') {
      setFilled((currentState) => {
        return { ...currentState, step1: true }
      })
    } else {
      setFilled((currentState) => {
        return { ...currentState, step1: false }
      })
    }
  }, [data])

  console.log('data step1', data)

  return (
    <Separator>
      <Title>
        1. {I18n.t('pages.staggeredProposal.step1.title')}
        <Subtitle>{I18n.t('pages.staggeredProposal.step1.subtitle')}</Subtitle>
      </Title>
      <Grid container spacing={5}>
        <Grid item xs={6}>
          <FormLabel
            component="legend"
            error={data.proposalValue === '' && invalidInput}
          >
            {I18n.t('pages.staggeredProposal.step1.client')}:
            <RedColorSpan> *</RedColorSpan>
          </FormLabel>
          <Autocomplete
            freeSolo
            onChange={(e, newValue) =>
              setData({ ...data, proposalValue: String(newValue) })
            }
            options={partnerList.map((item) => item.businessPartner.simpleName)}
            value={data.proposalValue}
            renderInput={(params) => (
              <div ref={params.InputProps.ref}>
                <ControlledInput
                  {...params}
                  id="search-client"
                  toolTipTitle={I18n.t('components.itemModal.requiredField')}
                  invalid={data.proposalValue === '' && invalidInput}
                  variant="outlined"
                  size="small"
                  placeholder={I18n.t(
                    'pages.staggeredProposal.step1.searchClient'
                  )}
                  $space
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconComponent
                          name="search"
                          defaultColor={
                            theme?.commercial?.pages?.newProposal?.subtitle
                          }
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            )}
            PaperComponent={(params: any) => <StyledPaper {...params} />}
          />
        </Grid>
        <Grid item xs={2}>
          <FormLabel
            component="legend"
            error={invalidInput && data.operation.length === 0}
          >
            {I18n.t('pages.staggeredProposal.step1.operation')}
            {<RedColorSpan> *</RedColorSpan>}
          </FormLabel>
          <ControlledSelect
            value={data.operation}
            onChange={(e) => setData({ ...data, operation: e.target.value })}
            displayEmpty
            disableUnderline
            invalid={invalidInput && data.operation.length === 0}
            toolTipTitle={I18n.t('components.itemModal.requiredField')}
          >
            <MenuItem disabled value="">
              <SelectSpan placeholder={1}>
                {I18n.t('pages.staggeredProposal.step1.choose')}
              </SelectSpan>
            </MenuItem>
            {operationList.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                <SelectSpan>{item.operation}</SelectSpan>
              </MenuItem>
            ))}
          </ControlledSelect>
        </Grid>
        <Grid item xs={2}>
          <FormLabel
            component="legend"
            error={invalidInput && data.operation.length === 0}
          >
            {I18n.t('pages.staggeredProposal.step1.vigencyDate')}
            {<RedColorSpan> *</RedColorSpan>}
          </FormLabel>
          <div style={{ marginTop: '-8px' }}>
            <PickerDateRange
              defaultValue={data.vigencyDate}
              endDateLabel="Data Final"
              inputFormat=""
              language="pt-br"
              onChange={setVigencyDate}
              placeHolderLabel="Periodo"
              widthTx="250px"
            />
          </div>
        </Grid>
      </Grid>
    </Separator>
  )
}

export default withTheme(Step1)
