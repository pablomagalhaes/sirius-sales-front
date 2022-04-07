import React, { ReactNode, useEffect, useState } from 'react'
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
}

const Step6 = ({ setFilled, costData, modal, setCompleted, specifications, containerItems, setUndoMessage, undoMessage }: Step6Props): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<FareModalData[]>([])
  const [copyTable, setCopyTable] = useState<FareModalData[]>([])
  const [chargeData, setChargeData] = useState<FareModalData>(initialState)
  const currencyList = new Map()
  const handleOpen = (): void => setOpen(true)
  const handleClose = (): void => setOpen(false)

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
        <Table
          data={data}
          costData={costData}
          modal={modal}
          specifications={specifications}
          remove={removeClickHandler}
          edit={editClickHandler}
        />
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
        {data !== null
          ? (
            data?.map((item: FareModalData) => {
              return (
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
              )
            })
          )
          : (
            <div />
          )}
      </TableBody>
    </StyledTable>
  )
}

export default Step6
