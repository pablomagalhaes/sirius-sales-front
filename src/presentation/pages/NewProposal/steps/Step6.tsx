import React, { ReactNode, useEffect, useState, useContext } from 'react'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, Separator, MessageContainer } from '../style'
import FareModal, { FareModalData, initialState } from '../../../components/FareModal/FareModal'
import { TableBody } from '@material-ui/core'
import { ItemModalData } from '../../../components/ItemModal/ItemModal'

import {
  DeleteIconDiv,
  EditIconDiv,
  EmptyTableCost,
  RowReverseContainer,
  RowReverseDiv,
  StyledTableCell,
  TotalCostLabel,
  ValueLabel
} from '../../../components/CostTable/CostTableStyles'

import {
  TotalContainer,
  StyledTable,
  StyledRow,
  ButtonWrapper,
  HeightDiv
} from './StepsStyles'

import EditIcon from '../../../../application/icons/EditIcon'
import RemoveIcon from '../../../../application/icons/RemoveIcon'
import { Button, MoneyValue, Messages } from 'fiorde-fe-components'
import { ProposalContext, ProposalProps } from '../context/ProposalContext'
import { Cost } from '../../../../domain/Cost'
import { TotalCost } from '../../../../domain/TotalCost'

interface Step6Props {
  costData: any
  modal: string
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  specifications: string
  containerItems: ItemModalData[]
  setUndoMessage: React.Dispatch<React.SetStateAction<{
    step3: boolean
    step5origin: boolean
    step5destiny: boolean
    step6: boolean
  }>>
  undoMessage: { step3: boolean, step5origin: boolean, step5destiny: boolean, step6: boolean }
  serviceList: any[]
  containerTypeList: any[]
}

const Step6 = ({ setFilled, costData, modal, setCompleted, specifications, containerItems, setUndoMessage, undoMessage, serviceList, containerTypeList }: Step6Props): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<FareModalData[]>([])
  const [copyTable, setCopyTable] = useState<FareModalData[]>([])
  const [chargeData, setChargeData] = useState<FareModalData>(initialState)
  const currencyList = new Map()
  const { proposal, setProposal }: ProposalProps = useContext(ProposalContext)
  const [dataTotalCost, setDataTotalCost] = useState<any[]>([])

  const handleOpen = (): void => setOpen(true)
  const handleClose = (): void => setOpen(false)

  const [loadedTable, setLoadedTable] = useState(false)

  useEffect(() => {
    const loadedData: FareModalData[] = []

    let id = 0
    if (proposal.id !== undefined && proposal.id !== null) {
      void new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 1000)
      }).then(() => {
        proposal.costs.forEach((cost: Cost) => {
          const loadedItem: FareModalData = {
            id: id++,
            saleCurrency: cost.idCurrencySale === '' ? 'BRL' : String(cost.idCurrencySale),
            saleValue: cost.valueSale === 0 ? '' : String(cost.valueSale),
            minimumValue: cost.valueMinimumSale === 0 ? '' : String(cost.valueMinimumSale),
            expense: '', // TODO inserir esse campo depois de ajustada a tabela (container ou package)
            selectedContainer: String(cost.containerType),
            type: String(cost.billingType)
          }
          if (cost.costType === 'Tarifa') {
            loadedData.push(loadedItem)
          }
        })
        setData(loadedData)
        setLoadedTable(true)
      })
    } else {
      setLoadedTable(true)
    }
  }, [])

  useEffect(() => {
    let actualCostArray = proposal.costs
    actualCostArray = actualCostArray.filter((cost) => cost.costType !== 'Tarifa' && cost)
    const newFareItems: Cost[] = []
    data.forEach((row) => {
      newFareItems.push({
        idProposal: 0,
        idService: serviceList.filter((serv) => serv.service === row.expense)[0]?.id, // id Descricao
        containerType: specifications === 'fcl' ? containerTypeList.filter((cont) => cont.description === row.selectedContainer)[0]?.id : '', // containerMODAL
        idBusinessPartnerAgent: 0, // data.agent, // AgenteMODALcusto
        costType: 'Tarifa', // 'Origem''Destino''Tarifa'
        billingType: row.type, // Tipo -MODAL
        valuePurchase: null, // valor compra
        valuePurchasePercent: 0, // 0 por enquanto
        valueMinimumPurchase: null, // minimo compra
        valueSale: Number(row.saleValue), // valor venda
        valueSalePercent: 0, // 0 por enquanto
        valueMinimumSale: Number(row.minimumValue), // minimo venda
        idCurrencyPurchase: 'nul', // tipo moeda NOTNULL VARCHAR(3)
        idCurrencySale: row.saleCurrency, // tipo moeda
        isPurchase: false, // checkbox compra
        isSale: row.saleValue !== null // checkbox venda
      })
    })

    let actualTotalCostArray = proposal.totalCosts
    actualTotalCostArray = actualTotalCostArray.filter((cost) => cost.costType !== 'Tarifa' && cost)
    const newTotalCostFare: TotalCost[] = []
    dataTotalCost.forEach((currency) => {
      newTotalCostFare.push({
        costType: 'Tarifa', // 'Origem''Destino''Tarifa'
        idCurrency: currency.name, // id moeda
        valueTotalSale: currency.value, // total sale da moeda
        valueTotalPurchase: 0 // total compra da moeda
      })
    })
    setProposal({ ...proposal, totalCosts: actualTotalCostArray.concat(newTotalCostFare), costs: actualCostArray.concat(newFareItems) })
  }, [data, dataTotalCost])

  useEffect(() => {
    if (data.length > 0) {
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
    setDataTotalCost(Array.from(currencyList, ([name, value]) => ({ name, value })))
  }, [data])

  useEffect(() => {
    setData([])
    setCopyTable([])
    setChargeData(initialState)
    setUndoMessage({ step3: false, step5origin: false, step5destiny: false, step6: false })
  }, [modal])

  const handleAdd = (item: FareModalData): void => {
    setUndoMessage({ step3: false, step5origin: false, step5destiny: false, step6: false })
    if (item.id !== null) {
      const editData = data
      const index = editData.findIndex((i) => i.id === item.id)
      editData[index] = item
      setData(editData)
    } else {
      const lastIndex = data?.length - 1
      const newItem = { ...item, id: data.length === 0 ? 0 : (Number(data[lastIndex].id) + 1) }
      setData([...data, newItem])
    }
    setChargeData(initialState)
  }

  const calculateTotalCost = (saleCurrency, saleValue): void => {
    if (saleCurrency !== null && saleCurrency !== '') {
      currencyList.has(String(saleCurrency))
        ? currencyList.set(String(saleCurrency), Number(currencyList.get(String(saleCurrency))) + Number(saleValue))
        : currencyList.set(String(saleCurrency), Number(saleValue))
    }
  }

  const removeClickHandler = (id: number | null): void => {
    setCopyTable(data)
    setData((tableData) => {
      return tableData.filter((data) => data.id !== id)
    })
    setUndoMessage({ step3: false, step5origin: false, step5destiny: false, step6: true })
  }

  const editClickHandler = (tableData: FareModalData): void => {
    setChargeData(tableData)
    handleOpen()
  }

  const showFares = (): ReactNode[] => {
    data?.map((item) => calculateTotalCost(item.saleCurrency, item.saleValue))
    return Array.from(currencyList, ([name, value]) => ({ name, value })).map((currency, index) => {
      return (
        <ValueLabel key={index}>
          <MoneyValue
            currency={currency.name}
            language="pt-br"
            style={{ width: '80px' }}
            value={currency.value}
          />
        </ValueLabel>
      )
    })
  }

  return (
    <Separator>
      <HeightDiv>
        <Title>
          6. {I18n.t('pages.newProposal.step6.title')}
          <Subtitle>{I18n.t('pages.newProposal.step6.subtitle')}</Subtitle>
        </Title>
        {loadedTable && <Table
          data={data}
          costData={costData}
          modal={modal}
          specifications={specifications}
          remove={removeClickHandler}
          edit={editClickHandler}
        />}
        <ButtonWrapper>
          <Button
            onAction={handleOpen}
            text={I18n.t('pages.newProposal.step6.addFare')}
            icon="add"
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
        />
        {data.length === 0
          ? <TotalContainer>
            <TotalCostLabel>
              {I18n.t('pages.newProposal.step6.totalFares')}
            </TotalCostLabel>
            <ValueLabel>
              <EmptyTableCost>-</EmptyTableCost>
            </ValueLabel>
          </TotalContainer>
          : <TotalContainer>
            <TotalCostLabel>
              {I18n.t('pages.newProposal.step6.totalFares')}
            </TotalCostLabel>
            <RowReverseContainer>
              {showFares()}
            </RowReverseContainer>
          </TotalContainer>
        }
      </HeightDiv>
      {undoMessage.step6 &&
        <MessageContainer>
          <Messages
            closable={true}
            severity='success'
            buttonText={I18n.t('pages.newProposal.step3.messageUndoDelete')}
            closeAlert={() => { setUndoMessage({ step3: false, step5origin: false, step5destiny: false, step6: false }) }}
            closeMessage=''
            goBack={() => { setData(copyTable); setUndoMessage({ step3: false, step5origin: false, step5destiny: false, step6: false }) }}
            message={I18n.t('pages.newProposal.step3.messageDeleteItem')}
          />
        </MessageContainer>}
    </Separator>
  )
}

interface TableData {
  costData: any
  data?: FareModalData[]
  edit?: (tableData: FareModalData) => void
  modal: string
  remove?: (id: number | null) => void
  specifications: string
}

const Table = ({ data, remove, edit }: TableData): JSX.Element => {
  return (
    <StyledTable>
      <TableBody>
        {data !== null &&
          (
            <div>
              {data?.map((item: FareModalData) => (
                <StyledRow id={item.id} key={item.id}>
                  <StyledTableCell
                    color={1}
                    width="100%"
                    component="th"
                    scope="row"
                  >
                    {item.expense}
                  </StyledTableCell>
                  <StyledTableCell width="100%" align="left">
                    {item.type}
                  </StyledTableCell>
                  <StyledTableCell width="100%" align="left">
                    <MoneyValue
                      currency={item.saleCurrency}
                      language="pt-br"
                      style={{ width: '80px' }}
                      value={Number(item.saleValue)}
                    />
                  </StyledTableCell>
                  <StyledTableCell width="100%">
                    <RowReverseDiv>
                      <DeleteIconDiv>
                        <RemoveIcon
                          onClick={() => {
                            if (remove != null) remove(item.id)
                          }}
                        />
                      </DeleteIconDiv>
                      <EditIconDiv>
                        <EditIcon
                          onClick={() => {
                            if (edit != null) edit(item)
                          }}
                        />
                      </EditIconDiv>
                    </RowReverseDiv>
                  </StyledTableCell>
                </StyledRow>
              ))}
            </div>
          )}
      </TableBody>
    </StyledTable>
  )
}

export default Step6
