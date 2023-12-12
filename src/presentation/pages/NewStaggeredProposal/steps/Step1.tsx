import React, { useEffect, useState, useContext } from 'react'
import {
  FormLabel,
  Grid,
  InputAdornment,
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
import { StyledPaper, DateRange } from './StepsStyles'
import { PickerDateRange } from 'fiorde-fe-components'
import moment from 'moment'

import {
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP1_INPUT_CLIENT,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP1_SELECT_TARIFFTYPE
} from '../../../../ids'

import { CreateStaggeredProposal } from '../../../../domain/usecase'

import { StaggeredProposalContext, StaggeredProposalProps } from '../../StaggeredProposal/context/StaggeredProposalContext'

import { AcitivityTypes, OperationTypes } from '../../../../application/enum/enum'

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
  NewStaggeredProposal?: CreateStaggeredProposal
}

const Step1 = ({
  theme,
  invalidInput,
  setCompleted,
  setFilled,
  filled,
  setStepLoaded,
  NewStaggeredProposal
}: Step1Props): JSX.Element => {
  const [vigencyDate, setVigencyDate] = React.useState([null, null])
  const [partnerList, setPartnerList] = useState<any[]>([])
  const [partner, setPartner] = useState<any>('')
  const [operation, setOperation] = useState<any>('')

  const { staggeredproposal, setStaggeredProposal }: StaggeredProposalProps = useContext(StaggeredProposalContext)
  const initialData = {
    idTariffProposalStatus: null,
    idBusinessPartnerCustomer: null,
    tariffType: '',
    dtValidity: '',
    dtValidityEnd: '',
    vigencyDate: vigencyDate,
    proposalTariff: [
      {
        origin: '',
        destination: '',
        idAgent: null,
        idBusinessPartnerTransporter: null,
        currency: '',
        frequency: null,
        vlFrequency: null,
        freightValues: []
      }
    ]
  }
  const [data, setData] = useState(initialData)

  const operationList = [
    {
      id: 1,
      operation: I18n.t('pages.staggeredProposal.newStaggeredProposal.step1.import')
    },
    {
      id: 2,
      operation: I18n.t('pages.staggeredProposal.newStaggeredProposal.step1.export')
    }
  ]

  useEffect(() => {
    if (data.idBusinessPartnerCustomer !== null && data.tariffType !== '' && data.vigencyDate[0] !== '' && data.vigencyDate[1] !== '' && data.vigencyDate[0] !== null && data.vigencyDate[1] !== null) {
      setCompleted((currentState) => ({ ...currentState, step1: true }))
    } else {
      setCompleted((currentState) => ({ ...currentState, step1: false }))
    }
    if (data.idBusinessPartnerCustomer !== null || data.tariffType !== '' || data.vigencyDate[0] !== '' || data.vigencyDate[1] !== '' || data.vigencyDate[0] !== null || data.vigencyDate[1] !== null) {
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

  useEffect(() => {
    const TarifType = data?.tariffType
    setStaggeredProposal({
      ...staggeredproposal,
      tariffType: String(TarifType)
    })
  }, [data.tariffType])

  useEffect(() => {
    setStaggeredProposal({
      ...staggeredproposal,
      dtValidity: moment(vigencyDate[0]).format(),
      dtValidityEnd: moment(vigencyDate[1]).format()
    })
    setData({
      ...data,
      vigencyDate,
      dtValidity: moment(vigencyDate[0]).format(),
      dtValidityEnd: moment(vigencyDate[1]).format()
    })
  }, [vigencyDate])

  useEffect(() => {
    setData({
      idTariffProposalStatus: staggeredproposal.idTariffProposalStatus,
      idBusinessPartnerCustomer: staggeredproposal.idBusinessPartnerCustomer,
      tariffType: staggeredproposal.tariffType,
      dtValidity: staggeredproposal.dtValidity,
      dtValidityEnd: staggeredproposal.dtValidityEnd,
      vigencyDate: vigencyDate,
      proposalTariff: [...staggeredproposal.proposalTariff]
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getPartners = new Promise<void>((resolve) => {
      API.getPartner()
        .then((response) => {
          setPartnerList(response)
          resolve()
          const client = response.filter((ptn) => ptn.businessPartner.id === staggeredproposal.idBusinessPartnerCustomer)[0]?.businessPartner.simpleName
          setPartner(client)
          if (staggeredproposal.tariffType === AcitivityTypes.Import) setOperation(OperationTypes.Import)
          if (staggeredproposal.tariffType === AcitivityTypes.Export) setOperation(OperationTypes.Export)
          setVigencyDate([staggeredproposal.dtValidity, staggeredproposal.dtValidityEnd])
        })
        .catch((err) => console.log(err))
    })
    setStepLoaded((currentState) => ({ ...currentState, step1: true }))
    return () => {
      setData(initialData)
      setPartner('')
      setOperation('')
      setVigencyDate([null, null])
    }
  }, [])

  const handleTariffType = (newValue): any => {
    setOperation(newValue)
    if (newValue === 1) {
      setData({ ...data, tariffType: 'IMPORT' })
    } else {
      setData({ ...data, tariffType: 'EXPORT' })
    }
  }

  return (
    <Separator>
      <Title>
        1. {I18n.t('pages.staggeredProposal.newStaggeredProposal.step1.title')}
        <Subtitle>{I18n.t('pages.staggeredProposal.newStaggeredProposal.step1.subtitle')}</Subtitle>
      </Title>
      <Grid container spacing={5}>
        <Grid item xs={6}>
          <FormLabel
            component="legend"
            error={data.idBusinessPartnerCustomer === null && invalidInput}
          >
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step1.client')}:
            <RedColorSpan> *</RedColorSpan>
          </FormLabel>
          <Autocomplete
            onChange={(e, newValue) => { handleClient(newValue) }}
            options={partnerList.map((item) => item.businessPartner.simpleName)}
            value={partner}
            renderInput={(params) => (
              <div ref={params.InputProps.ref}>
                <ControlledInput
                  {...params}
                  data-testid="search-client"
                  id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP1_INPUT_CLIENT}
                  toolTipTitle={I18n.t('components.itemModal.requiredField')}
                  invalid={data.idBusinessPartnerCustomer === null && invalidInput}
                  variant="outlined"
                  size="small"
                  placeholder={I18n.t(
                    'pages.staggeredProposal.newStaggeredProposal.step1.searchClient'
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
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step1.operation')}
            {<RedColorSpan> *</RedColorSpan>}
          </FormLabel>
          <ControlledSelect
            id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP1_SELECT_TARIFFTYPE}
            data-testid="tariffType"
            value={operation}
            // onChange={(e) => setData({ ...data, tariffType: e.target.value })}
            onChange={(e) => handleTariffType(e.target.value)}
            displayEmpty
            disableUnderline
            invalid={invalidInput && data.tariffType.length === 0}
            toolTipTitle={I18n.t('components.itemModal.requiredField')}
          >
            <MenuItem disabled value={data?.tariffType}>
              <SelectSpan placeholder={1}>
                {I18n.t('pages.staggeredProposal.newStaggeredProposal.step1.choose')}
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
            error={invalidInput && (data.vigencyDate[0] === '' || data.vigencyDate[0] === null || data.vigencyDate[1] === '' || data.vigencyDate[1] === null)}
          >
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step1.vigencyDate')}
            {<RedColorSpan> *</RedColorSpan>}
          </FormLabel>
          <DateRange invalid={invalidInput && (data.vigencyDate[0] === '' || data.vigencyDate[0] === null || data.vigencyDate[1] === '' || data.vigencyDate[1] === null)}>
            <PickerDateRange
              data-testid="vigency"
              defaultValue={vigencyDate}
              endDateLabel="Data Final"
              inputFormat=""
              language="pt-br"
              onChange={setVigencyDate}
              placeHolderLabel="Periodo"
              widthTx="250px"
            />
            {(invalidInput && (data.vigencyDate[0] === '' || data.vigencyDate[0] === null || data.vigencyDate[1] === '' || data.vigencyDate[1] === null)) && <RedColorSpan>Campo obrigatório</RedColorSpan>}
          </DateRange>
        </Grid>
      </Grid>
    </Separator>
  )
}

export default withTheme(Step1)
