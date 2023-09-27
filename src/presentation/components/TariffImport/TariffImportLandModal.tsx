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
  FormControlLabel
} from '@material-ui/core'
import React, { useState, useContext, useEffect } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
import {
  CloseButtonDiv,
  ModalDiv,
  MainDiv,
  TableBodyCell,
  StyledRadio,
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
import { TariffItemsTypes, ValidityTypes } from '../../../application/enum/tariffEnum'
import FormatNumber from '../../../application/utils/formatNumber'
import { TARIFF_IMPORT_LCL_MODAL_BUTTON_IMPORT, TARIFF_IMPORT_LCL_MODAL_BUTTON_CANCEL } from '../../../ids'
import { ModalTypes } from '../../../application/enum/enum'
import { usePartnerList, useBusinessPartnerByType, useMercosulCities } from '../../hooks'

interface TariffUploadProps {
  theme?: any
  open: boolean
  setClose: () => void
  importFilter: any
  typeModal: string
  isDangerous: boolean
  getPurchase: (value: string, currency: string, index: number) => void
  index: number
  type: string
}

const TariffImportLandModa = ({
  theme,
  open,
  setClose,
  importFilter,
  typeModal,
  isDangerous,
  getPurchase,
  index,
  type
}: TariffUploadProps): JSX.Element => {
  const { filter }: any = useContext(TariffContext)
  const { content: tariffData, setParams } = useTariffsByCountry()
  const { partnerList: agentsList } = usePartnerList()
  const { data: cities = [] } = useMercosulCities()
  const { landPartners = [] } = useBusinessPartnerByType()
  const [value, setValue] = useState('')
  const handleOnClose = (): void => {
    setClose()
    setValue('')
    setParams()
  }

  useEffect(() => {
    setParams({
      ...importFilter,
      tariffModalType: ModalTypes.Land,
      validityTariff: ValidityTypes.Valid,
      tariffType: type
    })
  }, [importFilter, filter])

  const calculateValue = (): void => {
    const imoDedValue = tariffData[0]?.tariffTypeValues.find(each => each.tariffType.description === TariffItemsTypes.Vlimoded)
    const genralDedValue = tariffData[0]?.tariffTypeValues.find(each => each.tariffType.description === TariffItemsTypes.Vlgeneralded)
    if (isDangerous) setValue(FormatNumber.convertNumberToString(Number(imoDedValue.value)))
    else setValue(FormatNumber.convertNumberToString(Number(genralDedValue.value)))
  }

  useEffect(() => {
    if (tariffData.length > 0) calculateValue()
  }, [isDangerous, tariffData])

  const getTariffValue = (type: string, tariff: any): number => {
    const tariffValue = tariff?.tariffTypeValues.find(each => each.tariffType.description === type)
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
      generalDed: getTariffValue(TariffItemsTypes.Vlgeneralded, tariffData[0]),
      imoDed: getTariffValue(TariffItemsTypes.Vlimoded, tariffData[0]),
      generalCons: getTariffValue(TariffItemsTypes.Vlgeneralcons, tariffData[0]),
      imoCons: getTariffValue(TariffItemsTypes.Vlimocons, tariffData[0])
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
          <Title>{I18n.t('pages.newProposal.step6.tariffImport.title')}</Title>
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
                  {cities.find((item: any) => item.idCity === importFilter?.originCity)?.txCity} -
                  {cities.find((item: any) => item.idCity === importFilter?.originCity)?.txCountry}
                </strong>
              </FormLabel>
            </Grid>
            <Grid item xs={6}>
              <FormLabel component="legend">
                {I18n.t('pages.tariff.tariffImport.destiny')}
              </FormLabel>
              <FormLabel component="legend">
                <strong>
                  {cities.find((item: any) => item.idCity === importFilter?.destinationCity)?.txCity} -
                  {cities.find((item: any) => item.idCity === importFilter?.destinationCity)?.txCountry}
                </strong>
              </FormLabel>
            </Grid>
            <Grid item xs={6}>
              <FormLabel component="legend">
                {I18n.t('pages.tariff.tariffImport.agent')}
              </FormLabel>
              <FormLabel component="legend">
                <strong>{agentsList.find((item: any) => item.id === importFilter?.idBusinessPartnerAgent)?.simpleName}</strong>
              </FormLabel>
            </Grid>
            <Grid item xs={6}>
              <FormLabel component="legend">
                {typeModal}
              </FormLabel>
              <FormLabel component="legend">
                <strong>
                  {landPartners.find((item: any) => item.businessPartner.id === importFilter?.idBusinessPartnerTransporter)?.businessPartner.simpleName}
                </strong>
              </FormLabel>
            </Grid>
          </Grid>
          {tariffData.length > 0
            ? <>
            <TableContainer style={{ marginTop: '20px', borderBottom: '1px solid gray' }}>
              <Table >
                <TableHead>
                  <TableRow>
                    {Object.values(I18n.t('components.TariffImport.Land'))
                      .map((column: string) => <TableCell style={{ paddingLeft: 0 }} key={column}>{column}</TableCell>)
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {createTable().map((tariff: any) => (
                    <TableRow key={tariff.id}>
                      {Object.values(tariff).filter((_e, index) => index !== 0).map((each: any, index) =>
                        index < 4
                          ? <TableBodyCell key={`${String(each)}-${String(index)}`} align="left">
                            {checkIsNumber(each)}
                          </TableBodyCell>
                          : <TableBodyCell key={`${String(each)}-${String(index)}`} align="left" style={{ marginLeft: '5px' }}>
                            <RadioGroup
                              row aria-label="reason"
                              name="row-radio-buttons-group"
                              value={value}
                              onChange={() => setValue((event.target as HTMLInputElement).value)}
                              style={{ justifyContent: 'left', marginLeft: '10px' }}
                            >
                              <FormControlLabel
                                value={checkIsNumber(each)}
                                control={<StyledRadio />}
                                label={checkIsNumber(each)}
                                id={''}
                              />
                            </RadioGroup>
                          </TableBodyCell>
                      )
                      }

                    </TableRow>

                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid item xs={12} container={true} direction="row" justify="flex-end" alignItems="center">
              <Grid item>
                <CloseButtonDiv>
                  <Button
                    id={TARIFF_IMPORT_LCL_MODAL_BUTTON_CANCEL}
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
                    id={TARIFF_IMPORT_LCL_MODAL_BUTTON_IMPORT}
                    disabled={false}
                    text={I18n.t('pages.newProposal.step6.tariffImport.importButton')}
                    tooltip={I18n.t('pages.newProposal.step6.tariffImport.importButton')}
                    backgroundGreen={true}
                    icon=""
                    onAction={() => { getPurchase(value, tariffData[0].currency, index); handleOnClose() }}
                  />
                </div>
              </Grid>
            </Grid>
          </>
            : <>
            <NoTariffs>
              {I18n.t('pages.newProposal.step6.tariffImport.noTariffs')}
            </NoTariffs>
            <Grid item xs={12} container={true} direction="row" justify="flex-end" alignItems="center">
              <Grid item>
                <CloseButtonDiv>
                  <Button
                    id={TARIFF_IMPORT_LCL_MODAL_BUTTON_CANCEL}
                    disabled={false}
                    text={I18n.t('pages.tariff.tariffImport.closeButtonLabel')}
                    tooltip={I18n.t('pages.tariff.tariffImport.closeButtonLabel')}
                    backgroundGreen={false}
                    icon=""
                    onAction={handleOnClose}
                  />
                </CloseButtonDiv>
              </Grid>
            </Grid>
          </>}
        </MainDiv>
      </ModalDiv>
    </Modal >
  )
}

export default TariffImportLandModa
