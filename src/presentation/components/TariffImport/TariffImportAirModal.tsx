import {
  Modal,
  Grid,
  FormLabel,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@material-ui/core'
import React, { useState, useContext, useEffect } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
import {
  CloseButtonDiv,
  ModalDiv,
  MainDiv,
  TableBodyCell,
  NoTariffs
} from './TariffImportModalStyles'
import { I18n } from 'react-redux-i18n'
import {
  HeaderDiv,
  RowReverseDiv,
  Title,
  CloseIconContainer
} from '../StyledComponents/modalStyles'
import { Button } from 'fiorde-fe-components'
import { TariffContext } from '../../pages/Tariff/context/TariffContext'
import useTariffsByCountry from '../../hooks/tariff/useTariffsByCountry'
import {
  TariffItemsTypes,
  ValidityTypes
} from '../../../application/enum/tariffEnum'
import FormatNumber from '../../../application/utils/formatNumber'
import {
  TARIFF_IMPORT_AIR_MODAL_BUTTON_IMPORT,
  TARIFF_IMPORT_AIR_MODAL_BUTTON_CANCEL
} from '../../../ids'
import { ModalTypes } from '../../../application/enum/enum'
import {
  useOriginDestination,
  usePartnerList,
  useBusinessPartnerByType
} from '../../hooks'

interface TariffUploadProps {
  theme?: any
  open: boolean
  setClose: () => void
  importFilter: any
  typeModal: string
  calculationData: any
  getPurchase: (value: string, currency: string, index: number, idTariff: number) => void
  index: number
  type: string
  cw?: number
  cwSale: number
}

const TariffImportAirModal = ({
  theme,
  open,
  setClose,
  importFilter,
  typeModal,
  calculationData,
  getPurchase,
  index,
  type,
  cw,
  cwSale
}: TariffUploadProps): JSX.Element => {
  const { filter }: any = useContext(TariffContext)
  const { content: tariffData, setParams, refetch } = useTariffsByCountry()
  const { partnerList: agentsList } = usePartnerList()
  const { data: originDestinationList = [] } = useOriginDestination()
  const { airPartners = [] } = useBusinessPartnerByType()
  const [value, setValue] = useState('0')
  const [valuePosition, setValuePosition] = useState(0)
  const handleOnClose = (): void => {
    setClose()
    setValue('')
    setParams()
  }
  useEffect(() => {
    setParams({
      ...importFilter,
      tariffModalType: ModalTypes.Air,
      validityTariff: ValidityTypes.Valid,
      tariffType: type
    })
    refetch()
  }, [importFilter, filter, open])

  const calculateValue = (): void => {
    const tariffValues = tariffData[0].tariffTypeValues?.map((item) => {
      return item.value
    })

    let valueToCheck

    if (calculationData.weight > calculationData.cubageWeight) {
      valueToCheck = calculationData.weight
    } else {
      valueToCheck = calculationData.cubageWeight
    }

    const isBetweenMapValue = (value: number, valueMap: any): number => {
      for (const key in valueMap) {
        if (valueMap.hasOwnProperty(key)) {
          const range = valueMap[key]
          if (value >= range.min && value <= range.max) {
            return range.position
          }
          if (value >= 1001) {
            return 5
          }
        }
      }
    }

    const rangeMap = {
      range1: { label: TariffItemsTypes.Minimun, position: 0, min: 0, max: 45 },
      range2: { label: TariffItemsTypes.Until45, position: 1, min: 46, max: 100 },
      range3: { label: TariffItemsTypes.Until100, position: 2, min: 101, max: 300 },
      range4: { label: TariffItemsTypes.Until300, position: 3, min: 301, max: 500 },
      range5: { label: TariffItemsTypes.Until500, position: 4, min: 501, max: 1000 }
    }

    const isBetweenValue = isBetweenMapValue(valueToCheck, rangeMap)

    const getCloset = tariffValues[isBetweenValue]
    const getIndexValue = 4 + (isBetweenValue)

    setValuePosition(getIndexValue)
    setValue(FormatNumber.convertNumberToString(getCloset))
  }

  useEffect(() => {
    if (tariffData.length > 0) calculateValue()
  }, [calculationData, tariffData])

  const getTariffValue = (type: string, tariff: any): number => {
    const tariffValue = tariff?.tariffTypeValues.find(
      (each) => each.tariffType.description === type
    )
    return tariffValue?.value
  }

  const createTable = (): any => {
    const tariffs: any = []

    tariffs.push({
      id: tariffData[0]?.idTariff,
      airCompany: tariffData[0]?.dsBusinessPartnerTransporter,
      agent: tariffData[0]?.nmAgent,
      dtValidity: new Date(tariffData[0]?.validityDate).toLocaleDateString('pt-BR'),
      currency: tariffData[0]?.currency,
      minValue: getTariffValue(TariffItemsTypes.Minimun, tariffData[0]),
      weight1: getTariffValue(TariffItemsTypes.Until45, tariffData[0]),
      weight2: getTariffValue(TariffItemsTypes.Until100, tariffData[0]),
      weight3: getTariffValue(TariffItemsTypes.Until300, tariffData[0]),
      weight4: getTariffValue(TariffItemsTypes.Until500, tariffData[0]),
      weight5: getTariffValue(TariffItemsTypes.Until1000, tariffData[0])
    })

    return tariffs
  }

  const checkIsNumber = (value: any): any => {
    if (isNaN(value)) {
      return value
    } else {
      return FormatNumber.convertNumberToString(value !== null ? value : '-')
    }
  }

  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalDiv>
        <HeaderDiv>
          <Title>{I18n.t('pages.newProposal.step5.tariffImport.title')}</Title>
          <RowReverseDiv>
            <CloseIconContainer>
              <CloseIcon onClick={handleOnClose} />
            </CloseIconContainer>
          </RowReverseDiv>
        </HeaderDiv>
         <MainDiv>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <FormLabel component="legend">
                {I18n.t('pages.tariff.tariffImport.origin')}
              </FormLabel>
              <FormLabel component="legend">
                <strong>
                  {
                    originDestinationList.find(
                      (item: any) => item.id === importFilter?.idOrigin
                    )?.id
                  }{' '}
                  -
                  {
                    originDestinationList.find(
                      (item: any) => item.id === importFilter?.idOrigin
                    )?.name
                  }
                </strong>
              </FormLabel>
            </Grid>
            <Grid item xs={6}>
              <FormLabel component="legend">
                {I18n.t('pages.tariff.tariffImport.destiny')}
              </FormLabel>
              <FormLabel component="legend">
                <strong>
                  {
                    originDestinationList.find(
                      (item: any) => item.id === importFilter?.idDestination
                    )?.id
                  }{' '}
                  -
                  {
                    originDestinationList.find(
                      (item: any) => item.id === importFilter?.idDestination
                    )?.name
                  }
                </strong>
              </FormLabel>
            </Grid>
            <Grid item xs={6}>
              <FormLabel component="legend">
                {I18n.t('pages.tariff.tariffImport.agent')}
              </FormLabel>
              <FormLabel component="legend">
                <strong>
                  {
                    agentsList.find(
                      (item: any) =>
                        item.id === importFilter?.idBusinessPartnerAgent
                    )?.simpleName
                  }
                </strong>
              </FormLabel>
            </Grid>
            <Grid item xs={6}>
              <FormLabel component="legend">{typeModal}</FormLabel>
              <FormLabel component="legend">
                <strong>
                  {
                    airPartners.find(
                      (item: any) =>
                        item.businessPartner.id ===
                        importFilter?.idBusinessPartnerTransporter
                    )?.businessPartner.simpleName
                  }
                </strong>
              </FormLabel>
            </Grid>
          </Grid>
          {tariffData.length > 0
            ? (
            <>
              <TableContainer
                style={{ marginTop: '20px', borderBottom: '1px solid gray' }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      {Object.values(I18n.t('components.TariffImport.Air')).map(
                        (column: string) => (
                          <TableCell style={{ paddingLeft: 0 }} key={column}>
                            {column}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {createTable().map((tariff: any) => (
                      <TableRow key={tariff.id}>
                        {Object.values(tariff)
                          .filter((_e, index) => index !== 0)
                          .map((each: any, index) =>
                            index < 4
                              ? (
                              <TableBodyCell
                                key={`${String(each)}-${String(index)}`}
                                align="left"
                              >
                                {checkIsNumber(each)}
                              </TableBodyCell>
                                )
                              : (
                              <TableBodyCell
                                key={`${String(each)}-${String(index)}`}
                                align="left"
                                style={{ marginLeft: '5px' }}
                              >
                                <RadioGroup
                                  row
                                  aria-label="reason"
                                  name="row-radio-buttons-group"
                                  value={value}
                                  onChange={() =>
                                    setValue(
                                      (event.target as HTMLInputElement).value
                                    )
                                  }
                                  style={{
                                    justifyContent: 'left',
                                    marginLeft: '10px'
                                  }}
                                >
                                  <FormControlLabel
                                  value={checkIsNumber(each)}
                                  id={''}
                                  control={
                                  <Radio
                                    value={checkIsNumber(each)}
                                    checked={valuePosition === index}
                                    disabled={valuePosition !== index}
                                  />}
                                  label={checkIsNumber(each)}
                                  />
                                </RadioGroup>
                              </TableBodyCell>
                                )
                          )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid
                item
                xs={12}
                container={true}
                direction="row"
                justify="flex-end"
                alignItems="center"
              >
                <Grid item>
                  <CloseButtonDiv>
                    <Button
                      id={TARIFF_IMPORT_AIR_MODAL_BUTTON_CANCEL}
                      disabled={false}
                      text={I18n.t(
                        'pages.tariff.tariffImport.closeButtonLabel'
                      )}
                      tooltip={I18n.t(
                        'pages.tariff.tariffImport.closeButtonLabel'
                      )}
                      backgroundGreen={false}
                      icon=""
                      onAction={handleOnClose}
                    />
                  </CloseButtonDiv>
                </Grid>
                <Grid item>
                  <div>
                    <Button
                      id={TARIFF_IMPORT_AIR_MODAL_BUTTON_IMPORT}
                      disabled={false}
                      text={I18n.t(
                        'pages.newProposal.step5.tariffImport.importButton'
                      )}
                      tooltip={I18n.t(
                        'pages.newProposal.step5.tariffImport.importButton'
                      )}
                      backgroundGreen={true}
                      icon=""
                      onAction={() => {
                        getPurchase(value, tariffData[0].currency, index, tariffData[0].idTariff)
                        handleOnClose()
                      }}
                    />
                  </div>
                </Grid>
              </Grid>
            </>
              )
            : (
            <>
              <NoTariffs>
                {I18n.t('pages.newProposal.step5.tariffImport.noTariffs')}
              </NoTariffs>
              <Grid
                item
                xs={12}
                container={true}
                direction="row"
                justify="flex-end"
                alignItems="center"
              >
                <Grid item>
                  <CloseButtonDiv>
                    <Button
                      id={TARIFF_IMPORT_AIR_MODAL_BUTTON_CANCEL}
                      disabled={false}
                      text={I18n.t(
                        'pages.tariff.tariffImport.closeButtonLabel'
                      )}
                      tooltip={I18n.t(
                        'pages.tariff.tariffImport.closeButtonLabel'
                      )}
                      backgroundGreen={false}
                      icon=""
                      onAction={handleOnClose}
                    />
                  </CloseButtonDiv>
                </Grid>
              </Grid>
            </>
              )}
        </MainDiv>
      </ModalDiv>
    </Modal>
  )
}

export default TariffImportAirModal
