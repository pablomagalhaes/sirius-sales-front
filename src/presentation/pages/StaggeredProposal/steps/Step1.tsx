import React, { useEffect, useState, useContext, Fragment } from 'react'
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputAdornment,
  RadioGroup,
  MenuItem

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

import { UpdateStaggeredProposal } from '../../../../domain/usecase'

import { StaggeredProposalContext, StaggeredProposalProps } from '../context/StaggeredProposalContext'

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
  UpdateStaggeredProposal?: UpdateStaggeredProposal
}

const Step1 = ({
  theme,
  invalidInput,
  setCompleted,
  setFilled,
  filled,
  setStepLoaded,
  UpdateStaggeredProposal
}: Step1Props): JSX.Element => {
  const [vigencyDate, setVigencyDate] = React.useState([null, null])
  const [partnerList, setPartnerList] = useState<any[]>([])
  const [partner, setPartner] = useState<any>('')

  const { staggeredproposal, setStaggeredProposal }: StaggeredProposalProps = useContext(StaggeredProposalContext)

  // const [data, setData] = useState({
  //   idBusinessPartnerCustomer: null,
  //   operation: '',
  //   vigencyDate: vigencyDate,
  //   proposalValue: '',
  //   requester: ''
  // })

  const [data, setData] = useState({
    idBusinessPartnerCustomer: 1,
    tariffType: 'IMPORT',
    dtValidity: '2023-03-12T00:00-03:00',
    dtValidityEnd: '2023-03-15T00:00-03:00',
    proposalTariff: [
      {
        origin: 'ARBUE',
        destination: 'SSZ',
        idAgent: 1,
        idBusinessPartnerTransporter: 2,
        currency: 'ARS',
        frequency: 1,
        vlFrequency: 3,
        freightValues: [
          {
            vlMinimum: '90',
            until45kg: '4.56',
            until100kg: '4.57',
            until300kg: '4.58',
            until500kg: '50.01',
            until1000kg: '1000.52',
            buyOrSell: 'BUY'
          },
          {
            vlMinimum: '90',
            until45kg: '4.56',
            until100kg: '4.57',
            until300kg: '4.58',
            until500kg: '50.01',
            until1000kg: '1000.52',
            buyOrSell: 'SELL'
          }
        ]
      }
    ]
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

  // useEffect(() => {
  //   setData({ ...data, vigencyDate: vigencyDate })
  // }, [vigencyDate])

  useEffect(() => {
    if (data.idBusinessPartnerCustomer !== null && data.tariffType !== '') {
      setCompleted((currentState) => ({ ...currentState, step1: true }))
    } else {
      setCompleted((currentState) => ({ ...currentState, step1: false }))
    }
    if (data.idBusinessPartnerCustomer !== null || data.tariffType !== '') {
      setFilled((currentState) => {
        return { ...currentState, step1: true }
      })
    } else {
      setFilled((currentState) => {
        return { ...currentState, step1: false }
      })
    }
  }, [data])

  const handleClient = (newValue): any => {
    setPartner(newValue)
    const client = partnerList.filter((ptn) => ptn.businessPartner.simpleName === newValue)[0]?.businessPartner.id
    setData({ ...data, idBusinessPartnerCustomer: Number(client) })

    setStaggeredProposal({
      ...staggeredproposal,
      idBusinessPartnerCustomer: Number(client)
    })
  }


  
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
            error={data.idBusinessPartnerCustomer === null && invalidInput}
          >
            {I18n.t('pages.staggeredProposal.step1.client')}:
            <RedColorSpan> *</RedColorSpan>
          </FormLabel>
          <Autocomplete
            freeSolo
            onChange={(e, newValue) => { handleClient(newValue) }}
            options={partnerList.map((item) => item.businessPartner.simpleName)}
            value={partner}
            renderInput={(params) => (
              <div ref={params.InputProps.ref}>
                <ControlledInput
                  {...params}
                  id="search-client"
                  toolTipTitle={I18n.t('components.itemModal.requiredField')}
                  invalid={data.idBusinessPartnerCustomer === null && invalidInput}
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
                    )
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
            error={invalidInput && data.tariffType.length === 0}
          >
            {I18n.t('pages.staggeredProposal.step1.operation')}
            {<RedColorSpan> *</RedColorSpan>}
          </FormLabel>
          <ControlledSelect
            value={data.tariffType}
            onChange={(e) => setData({ ...data, tariffType: e.target.value })}
            displayEmpty
            disableUnderline
            invalid={invalidInput && data.tariffType.length === 0}
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
            error={invalidInput && data.tariffType.length === 0}
          >
            {I18n.t('pages.staggeredProposal.step1.vigencyDate')}
            {<RedColorSpan> *</RedColorSpan>}
          </FormLabel>
          <div style={{ marginTop: '-8px' }}>
            {/* <PickerDateRange
              defaultValue={data.vigencyDate}
              endDateLabel="Data Final"
              inputFormat=""
              language="pt-br"
              onChange={setVigencyDate}
              placeHolderLabel="Periodo"
              widthTx="250px"
            /> */}
          </div>
        </Grid>
      </Grid>
    </Separator>
  )
}

export default withTheme(Step1)
