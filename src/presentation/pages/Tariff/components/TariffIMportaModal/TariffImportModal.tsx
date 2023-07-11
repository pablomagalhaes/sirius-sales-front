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
  Checkbox
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
import { TariffContext } from '../../context/TariffContext'
import useTariffsByCountry from '../../../../hooks/tariff/useTariffsByCountry'
import { TariffItemsTypes } from '../../../../../application/enum/tariffEnum'

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
}

export const initialState = {
  agent: { name: '', id: null },
  origin: '',
  destiny: ''
}

const TariffImportModal = ({
  theme,
  open,
  setClose
}: TariffUploadProps): JSX.Element => {
  const { partnerList: agentsList } = usePartnerList()
  const { data: originDestinationList = [] } = useOriginDestination()
  const { setFilter, filter }: any = useContext(TariffContext)
  const { content: tariffData, totalElements: totalTariffList, setParams, refetch } = useTariffsByCountry()

  const [data, setData] = useState<TariffUploadData>(initialState)
  const [selecteds, setSelecteds] = useState<string[]>([])
  const [invalidInput, setInvalidInput] = useState(false)

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
    setParams(filter)
  }, [filter])

  useEffect(() => {
    if(open === true) setParams()
  }, [open])

  const getOriginDestinyList = (): string[] => {
    const actualList: string[] = []
    originDestinationList?.forEach((item: any): void => {
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
        weight5: getTariffValue(TariffItemsTypes.Until1000, tariff),
      })
    })
    return tariffs
  }
  console.log(tariffData)
  const searchTariffs = (): void => {
    if(validateData() === true) {
      setInvalidInput(false)
      if(data.agent.id === null) {
        setFilter((filter: any) => ({
          ...filter,
          size: 3,
          tariffModalType: 'AIR', 
          idOrigin: data.origin.split(' - ')[0],
          idDestination: data.destiny.split(' - ')[0]
        }))
      } else {
        setFilter((filter: any) => ({
          ...filter,
          size: 3,
          tariffModalType: 'AIR', 
          idBusinessPartnerAgent: data.agent.id, 
          idOrigin: data.origin.split(' - ')[0],
          idDestination: data.destiny.split(' - ')[0]
        }))
      }
    } else {
      setInvalidInput(true)
    } 
  }

  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalDiv>
        <HeaderDiv>
          <Title>{I18n.t('pages.tariff.tariffImport.title')}</Title>
          <RowReverseDiv>
            <CloseIconContainer>
              <CloseIcon onClick={handleOnClose} />
            </CloseIconContainer>
          </RowReverseDiv>
        </HeaderDiv>
        <MainDiv>
          <Grid container spacing={5}>
            <Grid item xs={6}>
            <FormLabel component="legend" error={
              (invalidInput && data.origin.length === 0)
            }>
                {I18n.t('pages.tariff.tariffImport.origin')}
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
            <Autocomplete
              freeSolo
              onChange={(e, newValue) =>
                setData({ ...data, origin: String(newValue ?? '') })
              }
              options={getOriginDestinyList()}
              filterOptions={filterOptions}
              value={data.origin}
              disabled={false}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <ControlledInput
                    {...params}
                    id="search-origin"
                    toolTipTitle={
                      invalidInput
                        ? I18n.t('components.itemModal.requiredField')
                        : ''
                    }
                    invalid={invalidInput && data.origin.length === 0}
                    variant="outlined"
                    size="small"
                    placeholder=''
                    $space
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconComponent
                            name="arrow"
                            defaultColor={
                              theme?.commercial?.pages?.newProposal
                                ?.subtitle
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
            <Grid item xs={6}>
            <FormLabel component="legend" error={
              (invalidInput && data.destiny.length === 0)
            }>
                {I18n.t('pages.tariff.tariffImport.destiny')}
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
            <Autocomplete
              freeSolo
              onChange={(e, newValue) =>
                setData({ ...data, destiny: String(newValue ?? '') })
              }
              options={getOriginDestinyList()}
              filterOptions={filterOptions}
              value={data.destiny}
              disabled={false}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <ControlledInput
                    {...params}
                    id="search-destiny"
                    toolTipTitle={
                      invalidInput
                        ? I18n.t('components.itemModal.requiredField')
                        : ''
                    }
                    invalid={invalidInput && data.destiny.length === 0}
                    variant="outlined"
                    size="small"
                    placeholder=''
                    $space
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconComponent
                            name="arrow"
                            defaultColor={
                              theme?.commercial?.pages?.newProposal
                                ?.subtitle
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
            <Grid item xs={6} style={{marginTop: '-45px'}}>
            <FormLabel component="legend">
                {I18n.t('pages.tariff.tariffImport.agent')}
            </FormLabel>
            <Autocomplete
              freeSolo
              options={agentsList.map((item: any) => item.simpleName)}
              onChange={(_e, newValue): void => {
                const { simpleName: name, id } = agentsList.find((item: any) => item.simpleName === newValue)
                setData((data) => ({
                  ...data,
                  agent: { name, id }
                }))
              }}
              value={data.agent.name}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <ControlledInput
                    {...params}
                    id="search-client"
                    toolTipTitle={I18n.t('components.itemModal.requiredField')}
                    invalid={false}
                    variant="outlined"
                    size="small"
                    placeholder=""
                    $space
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconComponent
                            name="arrow"
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
            <Grid item xs={6}>
              <Button
                  disabled={!validateData()}
                  text={I18n.t('pages.tariff.tariffImport.searchButtonLabel')}
                  tooltip={I18n.t('pages.tariff.tariffImport.searchButtonLabel')}
                  backgroundGreen={true}
                  icon=""
                  onAction={searchTariffs}
                />
            </Grid>
          </Grid>
          <TableContainer style={{marginTop: '20px', minHeight: '150px'}}>
            <Table >
              <TableHead>
                <TableRow>
                  <CheckboxCell align="right">
                    <Checkbox
                      checked={selecteds.length === tariffData.length && selecteds.length !== 0}
                      onChange={() =>{
                        if (selecteds.length === tariffData.length) {
                          setSelecteds([])
                        } else {
                          setSelecteds(tariffData.map((row: any) => row.idTariff))
                        }
                      }}
                    />
                  </CheckboxCell>
                  {Object.values(I18n.t('pages.tariff.tariffImport.table'))
                    .map((column: string) => <TableCell style={{paddingLeft: 0}} key={column}>{column}</TableCell>)
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {createTable().map((tariff: any, index: number) => (
                  <TableRow key={tariff.id}>
                    <TableBodyCell align="right">
                      <Checkbox
                        checked={selecteds.some((selected) => selected === tariff.id)}
                        onChange={() => {
                          if(selecteds.some((selected) => selected === tariff.id)) {
                            setSelecteds((selecteds) => selecteds.filter((selected) => selected !== tariff.id))
                          } else {
                            setSelecteds((selecteds) => [...selecteds, tariff.id])
                          }
                        }}
                      />
                    </TableBodyCell>
                    {Object.values(tariff).filter((_e, index) => index !== 0).map((each: any) =>
                      <TableBodyCell key={`${each}-${index}`} align="left">
                        {each}
                      </TableBodyCell>)
                    }

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <hr style={{backgroundColor: '#E3E5EB', border: '0', height: '1px'}}/>
          <PaginationContainer>
            <PaginationMainContainer>
              <NoBreakLine>{selecteds.length} {selecteds.length > 1 ? I18n.t('pages.tariff.tariffImport.selectedsItems') : I18n.t('pages.tariff.tariffImport.selectedItem') }</NoBreakLine>
              <Pagination
                count={totalTariffList}
                labelDisplay={I18n.t('components.Pagination.labelDisplay')}
                labelDisplayedRows={I18n.t('components.Pagination.labelDisplayedRows')}
                labelRowsPerPage={I18n.t('components.Pagination.labelRowsPerPage')}
                onPageChange={(value) =>
                  setFilter((filter: any) => ({ ...filter, page: value }))
                }
                onRowsPerPageChange={(value) =>
                  setFilter((filter: any) => ({
                    ...filter,
                    size: value,
                    page: 0
                  }))
                }
                tooltipBack={I18n.t('components.Pagination.tooltipBack')}
                tooltipFirst={I18n.t('components.Pagination.tooltipFirst')}
                tooltipLast={I18n.t('components.Pagination.tooltipLast')}
                tooltipNext={I18n.t('components.Pagination.tooltipNext')}
                reducedPagination={true}
              />
            </PaginationMainContainer>
          </PaginationContainer>
        <Grid item xs={12} container={true} direction="row" justify="flex-end" alignItems="center">
          <Grid item>
            <CloseButtonDiv>
              <Button
                disabled={false}
                text={I18n.t('pages.tariff.tariffImport.closeButtonLabel')}
                tooltip={I18n.t('pages.tariff.tariffImport.closeButtonLabel')}
                backgroundGreen={false}
                icon=""
                onAction={handleOnClose}
              />
            </CloseButtonDiv>
          </Grid>
          <Grid item>
            <div>
              <Button
                disabled={selecteds.length === 0}
                text={I18n.t('pages.tariff.tariffImport.addButtonLabel')}
                tooltip={I18n.t('pages.tariff.tariffImport.addButtonLabel')}
                backgroundGreen={true}
                icon=""
                onAction={searchTariffs}
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
