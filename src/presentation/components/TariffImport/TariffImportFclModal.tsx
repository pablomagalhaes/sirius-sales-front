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
import { TxChargeTypes, ModalTypes } from '../../../application/enum/enum'
import { useOriginDestination, usePartnerList, useBusinessPartnerByType } from '../../hooks'

interface TariffUploadProps {
  theme?: any
  open: boolean
  setClose: () => void
  importFilter: any
  typeModal: string
  containerType: string
  getPurchase: (value: string, currency: string, index: number) => void
  index: number
  type: string
}

const TariffImportFclModal = ({
  theme,
  open,
  setClose,
  importFilter,
  typeModal,
  containerType,
  getPurchase,
  index,
  type
}: TariffUploadProps): JSX.Element => {
  const { filter }: any = useContext(TariffContext)
  const { content: tariffData, setParams } = useTariffsByCountry()
  const { partnerList: agentsList } = usePartnerList()
  const { data: originDestinationList = [] } = useOriginDestination()
  const { seaPartners = [] } = useBusinessPartnerByType()
  const [value, setValue] = useState('')
  const handleOnClose = (): void => {
    setClose()
    setValue('')
    setParams()
  }
  useEffect(() => {
    setParams({
      ...importFilter,
      tariffModalType: ModalTypes.Sea,
      validityTariff: ValidityTypes.Valid,
      tariffType: type,
      txChargeType: TxChargeTypes.Fcl
    })
  }, [importFilter, filter])

  const calculateValue = (): void => {
    const container20 = tariffData[0]?.tariffTypeValues.find(each => each.tariffType.description === TariffItemsTypes.Vlcontainer20)
    const container40 = tariffData[0]?.tariffTypeValues.find(each => each.tariffType.description === TariffItemsTypes.Vlcontainer40)
    if (Number(containerType[0]) === 2) setValue(FormatNumber.convertNumberToString(container20.value))
    else if (Number(containerType[0]) === 4) setValue(FormatNumber.convertNumberToString(container40.value))
    else setValue('')
  }

  useEffect(() => {
    if (tariffData.length > 0) calculateValue()
  }, [containerType, tariffData])

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
      container20: getTariffValue(TariffItemsTypes.Vlcontainer20, tariffData[0]),
      container40: getTariffValue(TariffItemsTypes.Vlcontainer40, tariffData[0])
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
                  {originDestinationList.find((item: any) => item.id === importFilter?.idOrigin)?.id} -
                  {originDestinationList.find((item: any) => item.id === importFilter?.idOrigin)?.name}
                </strong>
              </FormLabel>
            </Grid>
            <Grid item xs={6}>
              <FormLabel component="legend">
                {I18n.t('pages.tariff.tariffImport.destiny')}
              </FormLabel>
              <FormLabel component="legend">
                <strong>
                  {originDestinationList.find((item: any) => item.id === importFilter?.idDestination)?.id} -
                  {originDestinationList.find((item: any) => item.id === importFilter?.idDestination)?.name}
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
                  {seaPartners.find((item: any) => item.businessPartner.id === importFilter?.idBusinessPartnerTransportCompany)?.businessPartner.simpleName}
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
                    {Object.values(I18n.t('components.TariffImport.Fcl'))
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

export default TariffImportFclModal
