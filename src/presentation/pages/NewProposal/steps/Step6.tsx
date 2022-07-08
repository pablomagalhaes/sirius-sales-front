import React, { useContext, useEffect, useImperativeHandle, useState } from 'react'
import { I18n } from 'react-redux-i18n'
import { MessageContainer, Separator, Subtitle, Title } from '../style'
import FareModal, { FareModalData, initialState } from '../../../components/FareModal/FareModal'
import { Box, FormControl, FormLabel, Grid, InputAdornment, withTheme } from '@material-ui/core'
import { ItemModalData } from '../../../components/ItemModal/ItemModal'

import { ButtonWrapper, HeightDiv, NumberInput, StyledPaper } from './StepsStyles'

import { Button, Messages } from 'fiorde-fe-components'
import { ProposalContext, ProposalProps } from '../context/ProposalContext'
import { Cost } from '../../../../domain/Cost'
import { TotalCost } from '../../../../domain/TotalCost'
import API from '../../../../infrastructure/api'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ControlledInput from '../../../components/ControlledInput'
import IconComponent from '../../../../application/icons/IconComponent'
import FormatNumber from '../../../../application/utils/formatNumber'
import SurchargeTable from '../../../components/SurchargeTable/index'
import TotalSurcharge from '../../../components/TotalSurcharge'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { CalculationDataProps } from '../../../components/ChargeTable'

interface Step6Props {
  containerItems: ItemModalData[]
  costData: any
  modal: string
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  specifications: string
  setUndoMessage: React.Dispatch<
  React.SetStateAction<{
    step3: boolean
    step5origin: boolean
    step5destiny: boolean
    step6: boolean
  }>
  >
  undoMessage: {
    step3: boolean
    step5origin: boolean
    step5destiny: boolean
    step6: boolean
  }
  serviceList: any[]
  containerTypeList: any[]
  theme: any
  calculationData: CalculationDataProps
  invalidInput: boolean
  updateTableIdsRef: any
  cw: number
  cwSale: number
}

const Step6 = ({
  setFilled,
  costData,
  modal,
  setCompleted,
  specifications,
  containerItems,
  setUndoMessage,
  undoMessage,
  serviceList,
  containerTypeList,
  theme,
  calculationData,
  invalidInput,
  updateTableIdsRef,
  cw,
  cwSale
}: Step6Props): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [tableData, setTableData] = useState<FareModalData[]>([])
  const [copyTable, setCopyTable] = useState<FareModalData[]>([])
  const [chargeData, setChargeData] = useState<FareModalData>(initialState)
  const [currencyList, setCurrencyList] = useState<any[]>([])
  const { proposal, setProposal }: ProposalProps = useContext(ProposalContext)
  const [dataTotalCost, setDataTotalCost] = useState<any[]>([])
  const [loadedTotalCostsIds, setLoadedTotalCostsIds] = useState<number[]>([])
  const [loadedTable, setLoadedTable] = useState(false)

  const handleOpen = (): void => setOpen(true)
  const handleClose = (): void => setOpen(false)

  const currencyArray = new Map()

  const [data, setData] = useState({
    company: '',
    currency: '',
    value: '',
    tableData: []
  })

  const getServiceType = (): any => {
    let service

    switch (proposal.idTransport) {
      case 'AIR' :
        service = 'FRETE AÉREO'
        break
      case 'LAND':
        service = 'FRETE RODOVIÁRIO INTERNACIONAL'
        break
      case 'SEA':
        service = 'FRETE MARITIMO'
        break
    }

    return serviceList.filter((serv) => serv.service === service)[0]
      ?.id
  }

  const getFreightCost = (): Cost => {
    let freightCost = proposal.costs.find(
      (cost) => cost.costType === 'Frete')
    if (freightCost === undefined) {
      freightCost = {
        id: null,
        idProposal: proposal?.idProposal === undefined ? null : proposal?.idProposal,
        idService: getServiceType(),
        billingType: '',
        containerType: null,
        valuePurchasePercent: null,
        valueMinimumPurchase: null,
        valueSalePercent: 0,
        valueMinimumSale: null,
        idBusinessPartnerAgent: 0,
        costType: 'Frete',
        idCurrencySale: data.currency,
        idCurrencyPurchase: data.currency,
        valueSale: Number(data.value.replace(',', '.')),
        valuePurchase: 0,
        isPurchase: false,
        isSale: true
      }
    } else {
      freightCost = {
        ...freightCost,
        idCurrencySale: data.currency,
        idCurrencyPurchase: data.currency,
        costType: 'Frete',
        idService: getServiceType(),
        valueSale: Number(data.value.replace(',', '.')
        )
      }
    }
    return freightCost
  }

  useImperativeHandle(updateTableIdsRef, () => ({
    updateStep6Ids () {
      let tableDataId = 0
      if (proposal?.idProposal !== undefined && proposal?.idProposal !== null) {
        const newTableData = [...tableData]
        const newLoadedTotalCostsIds: number[] = []
        for (const cost of proposal.costs) {
          if (cost.costType === 'Tarifa') {
            newTableData[tableDataId].idCost = cost.id
            newTableData[tableDataId++].idProposal = proposal.idProposal
          }
        }
        setTableData(newTableData)
        for (const totalCost of proposal.totalCosts) {
          if (totalCost.costType === 'Tarifa') {
            newLoadedTotalCostsIds.push(Number(totalCost.id))
          }
          setLoadedTotalCostsIds(newLoadedTotalCostsIds)
        }
      }
    }
  }))

  useEffect(() => {
    setTableData([])
    setCopyTable([])
    setChargeData(initialState)
    setUndoMessage({
      step3: false,
      step5origin: false,
      step5destiny: false,
      step6: false
    })
  }, [modal])

  useEffect(() => {
    const loadedData: FareModalData[] = []

    let id = 0
    if (proposal.idProposal !== undefined && proposal.idProposal !== null) {
      void new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 1000)
      }).then(() => {
        const waitAllData = async (): Promise<void> => {
          for (const cost of proposal.costs) {
            if (cost.costType === 'Frete') {
              setData({ ...data, currency: String(cost.idCurrencySale), value: completeDecimalPlaces(cost.valueSale) })
            }
            const getContainer = new Promise((resolve) => {
              if (specifications === 'fcl') {
                API.getContainerType(cost.containerType)
                  .then((response) => resolve(String(response?.description)))
                  .catch((err) => console.log(err))
              } else {
                resolve(null)
              }
            })

            const getService = new Promise((resolve) => {
              API.getService(cost.idService)
                .then((response) => resolve(response?.service))
                .catch((err) => console.log(err))
            })

            const getTotalItemValue = new Promise((resolve) => {
              if (cost.costType === 'Tarifa') {
                const indexContainer = containerItems.findIndex(
                  (container) => cost.containerType === container.type
                )
                const totalCostCalculationData = {
                  costType: cost.billingType,
                  quantityContainer:
                    specifications === 'fcl'
                      ? Number(containerItems[indexContainer].amount)
                      : 0,
                  valueGrossWeight: isNaN(Number(calculationData?.weight))
                    ? 0
                    : calculationData?.weight,
                  valueCubage: isNaN(Number(calculationData?.cubage))
                    ? 0
                    : calculationData?.cubage,
                  valueWeightCubed: isNaN(Number(calculationData?.cubageWeight))
                    ? 0
                    : calculationData?.cubageWeight,
                  valuePurchase: 0,
                  valueSale: Number(cost.valueSale) > Number(cost.valueMinimumSale)
                    ? Number(cost.valueSale)
                    : Number(cost.valueMinimumSale),
                  idCurrencyPurchase: '',
                  idCurrencySale: cost.idCurrencySale,
                  valuePurchaseCW: cost.billingType === 'CW' ? Number(proposal.cargo.vlCwPurchase) : null,
                  valueSaleCW: cost.billingType === 'CW' ? Number(proposal.cargo.vlCwSale) : null
                }

                API.postTotalCalculation(totalCostCalculationData).then(response => {
                  resolve((cost.billingType === 'FIXO' || cost.billingType === 'BL')
                    ? '0'
                    : Number(response?.valueSale))
                })
                  .catch((err) => { resolve(''); console.log(err) })
              } else {
                resolve('')
              }
            })

            void (await Promise.all([
              getContainer,
              getService,
              getTotalItemValue
            ]).then((response) => {
              const loadedItem: FareModalData = {
                idCost: cost.id,
                idProposal: proposal.idProposal,
                id: id++,
                saleCurrency:
                  cost.idCurrencySale === ''
                    ? 'BRL'
                    : String(cost.idCurrencySale),
                saleValue:
                  cost.valueSale === 0
                    ? ''
                    : completeDecimalPlaces(cost.valueSale),
                minimumValue:
                  cost.valueMinimumSale === 0
                    ? ''
                    : completeDecimalPlaces(cost.valueMinimumSale),
                expense: String(response[1]),
                selectedContainer: response[0] === null ? null : String(response[0]),
                type: String(cost.billingType),
                totalItem: cost.valueSale === 0 ? '' : Number(response[2]).toFixed(2).replace('.', ',')
              }
              if (cost.costType === 'Tarifa') {
                loadedData.push(loadedItem)
              }
            }))
          }
          setTableData(loadedData)
          setLoadedTable(true)
        }
        void waitAllData()

        const loadedTotalCosts: any[] = []
        proposal.totalCosts.forEach((totalCost: TotalCost) => {
          if (totalCost.costType === 'Tarifa') {
            loadedTotalCosts.push(totalCost.id)
          }
        })
        setLoadedTotalCostsIds(loadedTotalCosts)
        setTableData(loadedData)
        setLoadedTable(true)
      })
    } else {
      setLoadedTable(true)
    }
  }, [])

  useEffect(() => {
    let actualCostArray = proposal.costs
    actualCostArray = actualCostArray.filter(
      (cost) => cost.costType !== 'Tarifa' && cost && cost.costType !== 'Frete'
    )
    const newFareItems: Cost[] = []
    tableData.forEach((row) => {
      newFareItems.push({
        id: row.idCost === undefined ? null : row.idCost,
        idProposal: proposal?.idProposal === undefined ? null : proposal?.idProposal,
        idService: serviceList.filter((serv) => serv.service === row.expense)[0]
          ?.id, // id Descricao
        containerType:
          specifications === 'fcl'
            ? containerTypeList.filter(
              (cont) => cont.description === row.selectedContainer
            )[0]?.id
            : null, // containerMODAL
        idBusinessPartnerAgent: 0,
        costType: 'Tarifa', // 'Origem''Destino''Tarifa'
        billingType: row.type, // Tipo -MODAL
        valuePurchase: null, // valor compra
        valuePurchasePercent: 0, // 0 por enquanto
        valueMinimumPurchase: null, // minimo compra
        valueSale: Number(row.saleValue.replace(',', '.')), // valor venda
        valueSalePercent: 0, // 0 por enquanto
        valueMinimumSale: Number(row.minimumValue.replace(',', '.')), // minimo venda
        idCurrencyPurchase: 'nul', // tipo moeda NOTNULL VARCHAR(3)
        idCurrencySale: row.saleCurrency, // tipo moeda
        isPurchase: false, // checkbox compra
        isSale: row.saleValue !== null // checkbox venda
      })
    })

    let actualTotalCostArray = proposal.totalCosts
    actualTotalCostArray = actualTotalCostArray.filter(
      (cost) => cost.costType !== 'Tarifa' && cost
    )
    const newTotalCostFare: TotalCost[] = []
    dataTotalCost.forEach((currency, index) => {
      newTotalCostFare.push({
        id:
          loadedTotalCostsIds[index] === undefined
            ? null
            : loadedTotalCostsIds[index],
        idProposal: proposal?.idProposal === undefined ? null : proposal?.idProposal,
        costType: 'Tarifa', // 'Origem''Destino''Tarifa'
        idCurrency: currency.name, // id moeda
        valueTotalSale: currency.value, // total sale da moeda
        valueTotalPurchase: 0 // total compra da moeda
      })
    })
    newFareItems.push(getFreightCost())
    setProposal({
      ...proposal,
      totalCosts: actualTotalCostArray.concat(newTotalCostFare),
      costs: actualCostArray.concat(newFareItems)
    })
  }, [data, dataTotalCost])

  useEffect(() => {
    if (tableData.length > 0 && data.currency !== '' && data.value !== '') {
      setCompleted((currentState) => {
        return { ...currentState, step6: true }
      })
      setFilled((currentState) => {
        return { ...currentState, step6: true }
      })
    } else {
      setFilled((currentState) => {
        return { ...currentState, step6: false }
      })
      setCompleted((currentState) => {
        return { ...currentState, step6: false }
      })
    }
    setDataTotalCost(
      Array.from(currencyArray, ([name, value]) => ({ name, value }))
    )
  }, [tableData, data, tableData.length])

  useEffect(() => {
    const newTableData: FareModalData[] = []
    const waitAllData = async (): Promise<void> => {
      for (const item of tableData) {
        void (await new Promise((resolve) => {
          const totalCostCalculationData = getTotalCalculationData(item)
          API.postTotalCalculation(totalCostCalculationData).then(response => {
            item.totalItem = (item.type === 'FIXO' || item.type === 'BL')
              ? '0'
              : Number(response?.valueSale)?.toFixed(2).replace('.', ',')
            resolve(newTableData.push(item))
          })
            .catch((err) => { resolve(''); console.log(err) })
        })
        )
      }
      setTableData(newTableData)
    }
    void waitAllData()
  }, [containerItems, calculationData, proposal.cargo])

  useEffect(() => {
    void (async function () {
      await API.getCurrencies()
        .then((response) => setCurrencyList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  const getTotalCalculationData = (item): any => {
    const indexContainer = containerItems.findIndex(
      (container) => item.selectedContainer === container.type
    )
    return {
      costType: item.type,
      quantityContainer:
        specifications === 'fcl'
          ? Number(containerItems[indexContainer].amount)
          : 0,
      valueGrossWeight: isNaN(Number(calculationData?.weight))
        ? 0
        : calculationData?.weight,
      valueCubage: isNaN(Number(calculationData?.cubage))
        ? 0
        : calculationData?.cubage,
      valueWeightCubed: isNaN(Number(calculationData?.cubageWeight))
        ? 0
        : calculationData?.cubageWeight,
      valuePurchase: 0,
      valueSale: Number(item.saleValue.replace(',', '.')) > Number(item.minimumValue.replace(',', '.'))
        ? Number(item.saleValue.replace(',', '.'))
        : Number(item.minimumValue.replace(',', '.')),
      idCurrencyPurchase: '',
      idCurrencySale: item.saleCurrency,
      valuePurchaseCW: item.type === 'CW' ? Number(proposal.cargo.vlCwPurchase) : null,
      valueSaleCW: item.type === 'CW' ? Number(proposal.cargo.vlCwSale) : null
    }
  }

  const handleAdd = (item: FareModalData): void => {
    setUndoMessage({
      step3: false,
      step5origin: false,
      step5destiny: false,
      step6: false
    })

    const totalCostCalculationData = getTotalCalculationData(item)

    void (async function () {
      await API.postTotalCalculation(totalCostCalculationData)
        .then((response) => {
          item.totalItem = (item.type === 'FIXO' || item.type === 'BL')
            ? '0'
            : Number(response.valueSale).toFixed(2).replace('.', ',')
          item.saleCurrency = response.idCurrencySale

          if (item.id !== null) {
            const editData = [...tableData]
            const index = editData.findIndex((i) => i.id === item.id)
            editData[index] = item
            setTableData(editData)
          } else {
            const lastIndex = tableData?.length - 1
            const newItem = {
              ...item,
              id:
                tableData.length === 0
                  ? 0
                  : Number(tableData[lastIndex].id) + 1
            }
            setTableData([...tableData, newItem])
          }
          setChargeData(initialState)
        })
        .catch((err) => console.log(err))
    })()
  }

  const removeClickHandler = (id: number | null): void => {
    setCopyTable(tableData)
    setTableData((tableData) => {
      return tableData.filter((data) => data.id !== id)
    })
    setUndoMessage({
      step3: false,
      step5origin: false,
      step5destiny: false,
      step6: true
    })
  }

  const editClickHandler = (tableData: FareModalData): void => {
    setChargeData(tableData)
    handleOpen()
  }

  const getCompany = (): string[] => {
    return ['teste 1', 'teste 2']
  }

  const selectTypeModal = (): string => {
    switch (modal) {
      case 'AIR':
        return String(I18n.t('pages.newProposal.step6.companyAir'))
      case 'SEA':
        return String(I18n.t('pages.newProposal.step6.companySea'))
      case 'LAND':
        return String(I18n.t('pages.newProposal.step6.companyLand'))
    }
    return String(I18n.t('pages.newProposal.step6.companySea'))
  }

  const completeDecimalPlaces = (num: number | null): string => {
    if (num === null) return '0'
    return num.toFixed(2).replace('.', ',')
  }

  const getSumTotalItem = (): string => {
    const totalSum = tableData.reduce(
      (total, item) => Number(item.totalItem?.replace(',', '.')) + total,
      0
    )
    return totalSum.toFixed(2).replace('.', ',')
  }

  return (
    <Separator>
      <HeightDiv>
        <Title>
          6. {I18n.t('pages.newProposal.step6.title')}
          <Subtitle>{I18n.t('pages.newProposal.step6.subtitle')}</Subtitle>
        </Title>
        <FormControl variant='outlined' size='small' className='form-size'>
          <Grid container spacing={5}>
            <Grid item xs={4}>
              <FormLabel component='legend'>{selectTypeModal()}</FormLabel>
              <Autocomplete
                freeSolo
                onChange={(e, newValue) =>
                  setData({ ...data, company: String(newValue) })
                }
                options={getCompany()}
                value={data.company}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <ControlledInput
                      {...params}
                      id='search-destiny'
                      toolTipTitle={I18n.t(
                        'components.itemModal.requiredField'
                      )}
                      invalid={false}
                      variant='outlined'
                      size='small'
                      $space
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconComponent
                              name='search'
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
              <FormLabel component='legend'>
                {I18n.t('pages.newProposal.step6.currency')}
                <RedColorSpan> *</RedColorSpan>
              </FormLabel>
              <Autocomplete
                freeSolo
                value={data.currency}
                onChange={(e, newValue) =>
                  setData({ ...data, currency: String(newValue ?? '') })
                }
                options={currencyList.map((item) => item.id)}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <ControlledInput
                      {...params}
                      id="currencies"
                      toolTipTitle={I18n.t('components.itemModal.requiredField')}
                      invalid={invalidInput && data.currency === ''}
                      variant="outlined"
                      size="small"
                      placeholder={I18n.t('components.itemModal.choose')}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <Box
                              style={{
                                position: 'absolute',
                                top: '7px',
                                right: '0'
                              }}
                              {...params.inputProps}
                            >
                              <ArrowDropDownIcon />
                            </Box>
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
              <FormLabel component='legend'>
                {I18n.t('pages.newProposal.step6.value')}
                <RedColorSpan> *</RedColorSpan>
              </FormLabel>
              <NumberInput
                decimalSeparator={','}
                thousandSeparator={'.'}
                decimalScale={2}
                format={(value: string) =>
                  FormatNumber.rightToLeftFormatter(value, 2)
                }
                customInput={ControlledInput}
                onChange={(e) => setData({ ...data, value: e.target.value })}
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={invalidInput && (data.value === '' || data.value === '0')}
                value={data.value}
                variant='outlined'
                size='small'
              />
            </Grid>
          </Grid>
        </FormControl>
        {loadedTable && (
          <SurchargeTable
            data={tableData}
            costData={costData}
            modal={modal}
            specifications={specifications}
            remove={removeClickHandler}
            edit={editClickHandler}
            dataFields={data}
          />
        )}
        <ButtonWrapper>
          <Button
            onAction={handleOpen}
            text={I18n.t('pages.newProposal.step6.addFare')}
            icon='add'
            backgroundGreen={false}
            tooltip={
              costData === 0
                ? I18n.t('pages.newProposal.step6.addFareTooltip')
                : I18n.t('pages.newProposal.step6.addFare')
            }
            disabled={costData === 0}
          />
        </ButtonWrapper>
        <FareModal
          dataProp={chargeData}
          action={handleAdd}
          open={open}
          setClose={handleClose}
          title={I18n.t('components.fareModal.newFare')}
          modal={modal}
          specifications={specifications}
          containerItems={containerItems}
          currency={data.currency}
        />
        {data.value.length > 0 && data.currency.length > 0 && (
          <TotalSurcharge
            currency={data.currency}
            value={data.value}
            totalOtherFare={getSumTotalItem()}
            cw={cw}
            cwSale={cwSale}
            modal={modal}
          />
        )}
      </HeightDiv>
      {undoMessage.step6 && (
        <MessageContainer>
          <Messages
            closable={true}
            severity='success'
            buttonText={I18n.t('pages.newProposal.step3.messageUndoDelete')}
            closeAlert={() => {
              setUndoMessage({
                step3: false,
                step5origin: false,
                step5destiny: false,
                step6: false
              })
            }}
            closeMessage=''
            goBack={() => {
              setTableData(copyTable)
              setUndoMessage({
                step3: false,
                step5origin: false,
                step5destiny: false,
                step6: false
              })
            }}
            message={I18n.t('pages.newProposal.step3.messageDeleteItem')}
          />
        </MessageContainer>
      )}
    </Separator>
  )
}

export default withTheme(Step6)
