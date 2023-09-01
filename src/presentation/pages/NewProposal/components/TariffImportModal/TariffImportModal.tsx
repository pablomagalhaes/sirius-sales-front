import {
  Modal,
  Grid,
  FormLabel,
  InputAdornment,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  Radio
} from '@material-ui/core'
import React, { useState, useContext, useEffect } from 'react'
import CloseIcon from '../../../../../application/icons/CloseIcon'
import Autocomplete, {
  createFilterOptions
} from '@material-ui/lab/Autocomplete'
import ControlledInput from '../../../../components/ControlledInput'
import IconComponent from '../../../../../application/icons/IconComponent'
import {
  StyledPaper,
  CloseButtonDiv,
  ModalDiv,
  MainDiv,
  TableBodyCell,
  PaginationContainer,
  PaginationMainContainer,
  CheckboxCell,
  NoBreakLine
} from './TariffImportModalStyles'
import { I18n } from 'react-redux-i18n'
import {
  HeaderDiv,
  RedColorSpan,
  RowReverseDiv,
  Title,
  CloseIconContainer
} from '../../../../components/StyledComponents/modalStyles'
import { Button, Pagination } from 'fiorde-fe-components'
import { usePartnerList, useOriginDestination } from '../../../../hooks'
import { OriginDestinyTypes } from '../../../../../application/enum/enum'
import { TariffContext } from '../../../Tariff/context/TariffContext'
import useTariffsByCountry from '../../../../hooks/tariff/useTariffsByCountry'
import { TariffItemsTypes } from '../../../../../application/enum/tariffEnum'
import FormatNumber from '../../../../../application/utils/formatNumber'
import getClosestNumber from '../../../../../application/helpers/getClosestNumber'


import { ProposalContext, ProposalProps } from '../../context/ProposalContext'

import {
  TARIFF_IMPORT_MODAL_INPUT_ORIGIN,
  TARIFF_IMPORT_MODAL_INPUT_DESTINATION,
  TARIFF_IMPORT_MODAL_INPUT_AGENT,
  TARIFF_IMPORT_MODAL_BUTTON_SEARCH,
  TARIFF_IMPORT_MODAL_BUTTON_ADD,
  TARIFF_IMPORT_MODAL_BUTTON_CANCEL,
  TARIFF_IMPORT_MODAL_CHECKBOX_ITEM
} from '../../../../../ids'

// import { StaggeredProposalContext, StaggeredProposalProps } from '../../context/StaggeredProposalContext'

interface AgentType {
  name: string
  id: number | null | undefined
}
export interface TariffUploadData {
  agent: AgentType
  origin: string
  destiny: string
}

interface TariffUploadProps {
  theme?: any
  open: boolean
  setClose: () => void
  setShowList: () => void
  cwSale: number
}

export const initialState = {
  agent: { name: '', id: null },
  origin: '',
  destiny: ''
}

const TariffImportModal = ({
  theme,
  open,
  setClose,
  setShowList,
  cwSale
}: TariffUploadProps): JSX.Element => {
  const { partnerList: agentsList } = usePartnerList()
  const { data: originDestinationList = [] } = useOriginDestination()
  const { setFilter, filter }: any = useContext(TariffContext)
  const { content: tariffData, totalElements: totalTariffList, setParams } = useTariffsByCountry()

  //  const { staggeredproposal, setStaggeredProposal }: StaggeredProposalProps = useContext(StaggeredProposalContext)

  const { proposal, setProposal }: ProposalProps = useContext(ProposalContext)


  const [data, setData] = useState<TariffUploadData>(initialState)
  const [selecteds, setSelecteds] = useState<string[]>([])
  const [invalidInput, setInvalidInput] = useState(false)

  const [selectedValue, setSelectedValue] = useState(null)

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 500
  })

  const handleOnClose = (): void => {
    setData(initialState)
    setInvalidInput(false)
    setClose()
  }

  const validateData = (): boolean => {
    return !(
      (data.origin?.length === 0) ||
      (data.destiny?.length === 0)
    )
  }

  useEffect(() => {
    if (open) {
      setInvalidInput(false)
      const tariffModalType = 'AIR'
      const tariffType = 'IMPORT'
      const validityTariff = 'VALID'

      const idOrig = originDestinationList.filter((item) => item.id === proposal.originDestiny[0].idOrigin).map((item) => { return item.id })
      const idDest = originDestinationList.filter((item) => item.id === proposal.originDestiny[0].idDestination).map((item) => { return item.id })
      const proposalAgent = proposal.agents[0].idBusinessPartnerAgent

      setFilter((filter: any) => ({
        ...filter,
        size: 3,
        tariffModalType: tariffModalType,
        validityTariff: validityTariff,
        tariffType: tariffType,
        idBusinessPartnerAgent: proposalAgent,
        idOrigin: idOrig[0],
        idDestination: idDest[0]
      }))
    }
  }, [open])

  useEffect(() => {
    setParams(filter)
  }, [filter])


  const getOrigin = (): string[] => {
    const actualList: string[] = []
    const filterList = originDestinationList.filter((item) => item.id === proposal.originDestiny[0].idOrigin)
    filterList?.forEach((item: any): void => {
      if (item.type === OriginDestinyTypes.Airport) {
        actualList.push(`${String(item.id)} - ${String(item.name)}`)
      }
    })
    return actualList
  }

  const getDest = (): string[] => {
    const actualList: string[] = []
    const filterList = originDestinationList.filter((item) => item.id === proposal.originDestiny[0].idDestination)
    filterList?.forEach((item: any): void => {
      if (item.type === OriginDestinyTypes.Airport) {
        actualList.push(`${String(item.id)} - ${String(item.name)}`)
      }
    })
    return actualList
  }

  const getTariffValue = (type: string, tariff: any): number => {
    const tariffValue = tariff.tariffTypeValues.find(each => each.tariffType.description === type)
    return tariffValue?.value
  }

  const createTable = (): any => {
    const tariffs: any = []
    tariffData.forEach((tariff: any) => {
      tariffs.push({
        id: tariff.idTariff,
        airCompany: tariff.dsBusinessPartnerTransporter,
        agent: tariff.nmAgent,
        dtValidity: new Date(tariff.validityDate).toLocaleDateString('pt-BR'),
        currency: tariff.currency,
        minValue: getTariffValue(TariffItemsTypes.Minimun, tariff),
        weight1: getTariffValue(TariffItemsTypes.Until45, tariff),
        weight2: getTariffValue(TariffItemsTypes.Until100, tariff),
        weight3: getTariffValue(TariffItemsTypes.Until300, tariff),
        weight4: getTariffValue(TariffItemsTypes.Until500, tariff),
        weight5: getTariffValue(TariffItemsTypes.Until1000, tariff)
      })
    })


    // var closest = counts.reduce(function(prev, curr) {
    //   return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
    // });
    // console.log(closest);

    return tariffs
  }

  useEffect(() => {
    if (tariffData.length > 0) {
      const counts = tariffData[0].tariffTypeValues?.map((item) => {
        return item.value
      })

      const result = getClosestNumber(counts,cwSale)
      setSelectedValue(result)
    }
}, [tariffData])

  const handleImports = (): void => {
    if (tariffData.length > 0) {
      const filterObject = tariffData.filter((item) => selecteds.includes(item.idTariff))

      const newObject = filterObject.map((obj, index) => {
        return {
          origin: data.origin,
          destination: data.destiny,
          idAgent: obj.idBusinessPartnerAgent,
          idBusinessPartnerTransporter: obj.idBusinessPartnerTransporter,
          currency: obj.currency,
          frequency: 1,
          vlFrequency: 3,
          freightValues: [
            {
              vlMinimum: String(obj.tariffTypeValues.filter(item => item.tariffType.description === 'MINIMUN').map(filteredValue =>
                filteredValue.value)[0]),
              until45kg: String(obj.tariffTypeValues.filter(item => item.tariffType.description === 'UNTIL45KG').map(filteredValue =>
                filteredValue.value)[0]),
              until100kg: String(obj.tariffTypeValues.filter(item => item.tariffType.description === 'UNTIL100KG').map(filteredValue =>
                filteredValue.value)[0]),
              until300kg: String(obj.tariffTypeValues.filter(item => item.tariffType.description === 'UNTIL300KG').map(filteredValue =>
                filteredValue.value)[0]),
              until500kg: String(obj.tariffTypeValues.filter(item => item.tariffType.description === 'UNTIL500KG').map(filteredValue =>
                filteredValue.value)[0]),
              until1000kg: String(obj.tariffTypeValues.filter(item => item.tariffType.description === 'UNTIL1000KG').map(filteredValue =>
                filteredValue.value)[0]),
              buyOrSell: obj.tariffTypeValues[index].buyOrSell
            }
          ]
        }
      })

      // const odd = staggeredproposal.proposalTariff
      // const combined = [...odd, newObject[0]]

      // setStaggeredProposal({
      //   ...staggeredproposal,
      //   proposalTariff: combined
      // })

      setShowList()
      handleOnClose()
    }
  }

  const checkIsNumber = (value: any): any => {
    if (isNaN(value)) {
      return value
    } else {
      return (
        <>
          <Radio
            checked={selectedValue === value}
            onChange={handleChange}
            value={value}
            name="radio-button-value"
            inputProps={{ 'aria-label': `${value}` }}
          />
          <label> {FormatNumber.convertNumberToString(value !== null ? value : '-')} </label>
        </>
      )
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value)
  }

  // console.log('proposal', proposal)
  // console.log('filter', filter)
  // console.log('tariffData', tariffData)
  // console.log('selectedValue', selectedValue)

  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalDiv>
        <HeaderDiv>
          <Title>{I18n.t('pages.newProposal.step6.tariffImport.title')}</Title>
          <RowReverseDiv>
            <CloseIconContainer>
              <CloseIcon onClick={handleOnClose} />
            </CloseIconContainer>
          </RowReverseDiv>
        </HeaderDiv>
        <MainDiv>
          <Grid container spacing={5}>
            <Grid item xs={6}>
            <FormLabel component="legend">
                {I18n.t('pages.newProposal.step6.tariffImport.origin')}
            </FormLabel>
             <p>{getOrigin()}</p>
            </Grid>
            <Grid item xs={6}>
            <FormLabel component="legend">
                {I18n.t('pages.newProposal.step6.tariffImport.destiny')}
            </FormLabel>
            <p>{getDest()}</p>
            </Grid>
            <Grid item xs={6} style={{ marginTop: '-45px' }}>
            <FormLabel component="legend">
                {I18n.t('pages.tariff.tariffImport.agent')}
            </FormLabel>
            <p>{tariffData[0]?.nmAgent}</p>
            </Grid>
            <Grid item xs={6} style={{ marginTop: '-45px' }}>
            <FormLabel component="legend">
                {I18n.t('pages.newProposal.step6.tariffImport.airCompany')}
            </FormLabel>
            <p>{tariffData[0]?.dsBusinessPartnerTransporter}</p>
            </Grid>
          </Grid>
          <TableContainer style={{ marginTop: '20px', minHeight: '150px' }}>
            <Table >
              <TableHead>
                <TableRow>
                  {Object.values(I18n.t('pages.newProposal.step6.tariffImport.table'))
                    .map((column: string) => <TableCell style={{ paddingLeft: 0 }} key={column}>{column}</TableCell>)
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {createTable().map((tariff: any, index: number) => (
                  <TableRow key={tariff.id}>
                    {Object.values(tariff).filter((_e, index) => index !== 0).map((each: any) =>
                      <TableBodyCell key={`${String(each)}-${String(index)}`} align="left">
                        {checkIsNumber(each)}
                      </TableBodyCell>)
                    }
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <hr style={{ backgroundColor: '#E3E5EB', border: '0', height: '1px' }}/>
        <Grid item xs={12} container={true} direction="row" justify="flex-end" alignItems="center">
          <Grid item>
            <CloseButtonDiv>
              <Button
                id={TARIFF_IMPORT_MODAL_BUTTON_CANCEL}
                disabled={false}
                text={I18n.t('pages.newProposal.step6.tariffImport.closeButtonLabel')}
                tooltip={I18n.t('pages.newProposal.step6.tariffImport.closeButtonLabel')}
                backgroundGreen={false}
                icon=""
                onAction={handleOnClose}
              />
            </CloseButtonDiv>
          </Grid>
          <Grid item>
            <div>
              <Button
                id={TARIFF_IMPORT_MODAL_BUTTON_ADD}
                disabled={false}
                text={I18n.t('pages.newProposal.step6.tariffImport.addButtonLabel')}
                tooltip={I18n.t('pages.newProposal.step6.tariffImport.addButtonLabel')}
                backgroundGreen={true}
                icon=""
                onAction={handleImports}
              />
            </div>
          </Grid>
        </Grid>
        </MainDiv>
      </ModalDiv>
    </Modal >
  )
}

export default TariffImportModal
