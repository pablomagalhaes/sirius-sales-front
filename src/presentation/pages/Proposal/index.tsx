import React, { useState, useEffect } from 'react'
import {
  QuickFilters,
  Table,
  RowFilter,
  Pagination,
  Button
} from 'fiorde-fe-components'
import { Breadcrumbs, Link, Select, MenuItem } from '@material-ui/core/'
import {
  RootContainer,
  ListHeaderContainer,
  LeftSideListHeaderContainer,
  RightSideListHeaderContainer,
  TableContainer,
  BottomSideContainer,
  PaginationContainer,
  PaginationMainContainer,
  TopContainer,
  TopButtonContainer,
  ListTextSpan,
  ExportListSpan,
  ListMainTitleSpan,
  ExportListContainer,
  CloseExpirationContainer,
  OrderByContainer,
  DropdownMenuContainer,
  RowFilterContainer,
  ArrowIconContainer
} from './style'
import { ExitToApp } from '@material-ui/icons/'
import Warning from '../../../application/icons/WarningIcon'
import { cardFilters, TableRows, orderButtonMenuItems, menuItems } from './constants'
import { useHistory } from 'react-router-dom'
import UpArrow from '../../../application/icons/UpArrow'
import newProposal from '../../../infrastructure/api/newProposalService'

const Proposal = (): JSX.Element => {
  const [orderBy, setOrderBy] = useState<string>('Dt. validade')
  const [orderAsc, setOrderAsc] = useState(true)
  const [openedOrderSelect, setOpenedOrderSelect] = useState(false)
  const history = useHistory()
  const [incotermList, setIncotermList] = useState<any[]>([])
  const [partnerList, setPartnerList] = useState<any[]>([])
  const [originDestinationList, setOriginDestinationList] = useState<any[]>([])
  const [radioValue, setRadioValue] = useState('')

  useEffect(() => {
    const newIncotermList: any[] = []
    void (async function () {
      await newProposal.getIncoterm()
        .then((response) => {
          response.forEach((item: any) => {
            newIncotermList.push(item?.id)
          })
          return (setIncotermList(newIncotermList))
        })
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    const newPartnerList: any[] = []
    void (async function () {
      await newProposal.getPartner()
        .then((response) => {
          response.forEach((item: any) => {
            newPartnerList.push(item?.businessPartner?.simpleName)
          })
          return (setPartnerList(newPartnerList))
        })
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    void (async function () {
      await newProposal.getOriginDestination()
        .then((response) => setOriginDestinationList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  const getOriginDestinyList = (): string[] => {
    const actualList: string[] = []
    let type = ''

    switch (radioValue) {
      case 'Aéreo':
        type = 'AEROPORTO'
        break
      case 'Marítimo':
        type = 'PORTO'
        break
      default:
        break
    }

    originDestinationList?.forEach((option): void => {
      if (option.type === type) {
        actualList.push(option.name)
      }
    })

    return actualList
  }

  const handleExportList = (): void => {
    alert('export list')
  }

  const handleCardFiltersClick = (selectedCardFilters: any): void => {
    console.log(selectedCardFilters)
  }

  const handleSelectedRowFilter = (selectedFiltersRowFilter: any): void => {
    console.log(selectedFiltersRowFilter)
  }

  const handleOrderDirection = (): void => {
    setOrderAsc(!orderAsc)
    console.log('handleOrderDireciton')
  }

  const menuItemsSelector = [
    {
      label: 'Ref. proposta',
      textField: 'Ref. proposta'
    },
    {
      label: 'Cliente',
      pickerListOptions1: partnerList,
      pickerLabel1: 'Cliente'
    },
    {
      label: 'Tipo de processo',
      checkboxList1: menuItems.processTypes
    },
    {
      label: 'Origem/Destino',
      radioButtonList: menuItems.modal,
      pickerListOptions1: getOriginDestinyList(),
      pickerListOptions2: getOriginDestinyList(),
      pickerLabel1: 'Origem',
      pickerLabel2: 'Destino',
      title1: 'Modal'
    },
    {
      label: 'Incoterm',
      pickerListOptions1: incotermList,
      pickerLabel1: 'Incoterm'
    },
    {
      label: 'Período',
      checkboxList: ['Dt. Abertura', 'Dt. Validade'],
      hasDatePicker: true,
      dateRanges: menuItems.dateRanges
    }
  ]

  const handleChangeModal = (
    handleCleanAll: () => void,
    handleCleanButton: () => void,
    handlePickerChange1: (e: any, newValue: string[]) => void,
    handlePickerChange2: (e: any, newValue: string[]) => void
  ): void => {
    if (radioValue !== '') {
      handleCleanAll()
      handleCleanButton()
      handlePickerChange1(null, [])
      handlePickerChange2(null, [])
    }
  }

  const handleCleanModal = (handleCleanAll: () => void): void => {
    setRadioValue('')
    handleCleanAll()
  }

  return (
    <RootContainer>
      <TopContainer>
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <Link
            color="inherit"
            onClick={() => history.push('/')}
            className="breadcrumbInitial"
            style={{ cursor: 'pointer' }}
          >
            Home
          </Link>
          <span className="breadcrumbEnd">Propostas</span>
        </Breadcrumbs>
        <TopButtonContainer>
          <Button
            disabled={false}
            text={'Criar nova proposta...'}
            tooltip={'Criar nova proposta'}
            backgroundGreen={true}
            icon="add"
            onAction={() => history.push('/novaProposta')}
          />
        </TopButtonContainer>
      </TopContainer>
      <QuickFilters cardFilters={cardFilters} onFilterClick={handleCardFiltersClick} />
      <RowFilterContainer>
        <RowFilter
          menuItemsSelector={menuItemsSelector}
          cleanLabel="Limpar"
          myFilterLabel="Meus Filtros"
          applyLabel="Aplicar"
          approveLabel="Salvar Filtro"
          addFilterLabel="Aplicar filtros"
          handleSelectedFilters={handleSelectedRowFilter}
          setRadioValue={setRadioValue}
          handleClean={handleChangeModal}
          handleCleanRow={handleCleanModal}
        />
      </RowFilterContainer>
      <ListHeaderContainer>
        <LeftSideListHeaderContainer>
          <ListMainTitleSpan>Propostas em andamento (210)</ListMainTitleSpan>
          <ExportListContainer onClick={handleExportList}>
            <ExitToApp />
            <ExportListSpan>Exportar lista</ExportListSpan>
          </ExportListContainer>
        </LeftSideListHeaderContainer>
        <RightSideListHeaderContainer>
          <CloseExpirationContainer>
            <Warning />
            <ListTextSpan>1 com vencimento proximo</ListTextSpan>
          </CloseExpirationContainer>
          <OrderByContainer>
            <ListTextSpan>Ordenar:</ListTextSpan>
            <DropdownMenuContainer showArrow={openedOrderSelect}>
              <Select
                className='select-style'
                onChange={(e) => setOrderBy(String(e.target.value))}
                value={orderBy}
                disableUnderline
                placeholder={orderBy}
                onOpen={() => setOpenedOrderSelect(!openedOrderSelect)}>
                {orderButtonMenuItems.map((type) => (
                  <MenuItem key={`${String(type)}_key`} value={type}>
                    <span>{type}</span>
                  </MenuItem>)
                )}
              </Select>
            </DropdownMenuContainer>
            <ArrowIconContainer onClick={handleOrderDirection} $rotate={orderAsc}>
              <UpArrow />
            </ArrowIconContainer>
          </OrderByContainer>
        </RightSideListHeaderContainer>
      </ListHeaderContainer>
      <BottomSideContainer>
        <TableContainer>
          <Table rows={TableRows()} />
        </TableContainer>
        <PaginationContainer>
          <PaginationMainContainer>
            <Pagination
              onPageChange={page => console.log(page)}
              onRowsPerPageChange={rowsPerPage => console.log(rowsPerPage)}
              labelDisplay='exibindo'
              count={100}
              labelRowsPerPage='Propostas por página'
              labelDisplayedRows='de'
              tooltipFirst='Primeira'
              tooltipBack='Anterior'
              tooltipNext='Próxima'
              tooltipLast='Última'
            />
          </PaginationMainContainer>
        </PaginationContainer>
      </BottomSideContainer>
    </RootContainer>
  )
}

export default Proposal
