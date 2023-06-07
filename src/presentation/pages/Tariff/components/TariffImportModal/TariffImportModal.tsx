import {
  Modal,
  Grid,
  FormLabel,
  InputAdornment,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'
import React, { useState, useContext } from 'react'
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
  TableCell,
  PaginationContainer,
  PaginationMainContainer
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
  const { filter, setFilter }: any = useContext(TariffContext)

  const [data, setData] = useState<TariffUploadData>(initialState)
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
      (data.destiny?.length === 0) ||
      (data.agent.id === null)
    )
  }

  const mockedData = [{
    airCompany: 'TAM CARGO',
    agent: 'MOLFINO HNS',
    validity: '04/10/2022',
    currency: 'USD',
    minimun: '90,00',
    Until45: '4,67',
    Until100: '4,50',
    Until300: '4,50',
    Until500: '4,50',
    Until1000: '4,02'
  }]

  const getOriginDestinyList = (): string[] => {
    const actualList: string[] = []
    originDestinationList?.forEach((item: any): void => {
      if (item.type === OriginDestinyTypes.Airport) {
        actualList.push(`${String(item.id)} - ${String(item.name)}`)
      }
    })
    return actualList
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
          <Grid container spacing={1}>
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
              (invalidInput && data.origin.length === 0)
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
            <Grid item xs={6}>
            <FormLabel component="legend">
                {I18n.t('pages.tariff.tariffImport.agent')}
              <RedColorSpan> *</RedColorSpan>
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
          </Grid>
          <TableContainer>
            <Table >
              <TableHead>
                <TableRow>
                  {Object.keys(mockedData[0])
                    .map((column: string) => <TableCell key={column}>{column}</TableCell>)
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {mockedData.map((row, index) => (
                  <TableRow
                    key={index}
                  >

                      {Object.values(row).map((each: string) =>
                        <TableCell key={each} align="left">
                          {each}
                        </TableCell>)
                    }

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <PaginationContainer>
            <PaginationMainContainer>
              <Pagination
                count={10}
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
        <Grid item xs={12} container={true} direction="row" justify="flex-end">
          <Grid item xs={6}>
            <CloseButtonDiv>
              <Button
                disabled={false}
                text={I18n.t('pages.tariff.upload.closeButtonLabel')}
                tooltip={I18n.t('pages.tariff.upload.closeButtonLabel')}
                backgroundGreen={false}
                icon=""
                onAction={handleOnClose}
              />
            </CloseButtonDiv>
          </Grid>
          <Grid item xs={6}>

          </Grid>
        </Grid>
        </MainDiv>
      </ModalDiv>
    </Modal >
  )
}

export default TariffImportModal
