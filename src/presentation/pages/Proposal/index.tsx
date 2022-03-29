import React, { useEffect, useState } from 'react'
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
import { useHistory } from 'react-router-dom'
import UpArrow from '../../../application/icons/UpArrow'
import API from '../../../infrastructure/api'
import ArrowDown from '../../../application/icons/ArrowDown'
import { cardFilters, orderButtonMenuItems, menuItems } from './constants'

const Proposal = (): JSX.Element => {
  const [orderBy, setOrderBy] = useState<string>('openingDate')
  const [orderAsc, setOrderAsc] = useState(true)
  const [openedOrderSelect, setOpenedOrderSelect] = useState(false)
  const [proposalList, setProposalList] = useState<any[]>([])
  const [totalProposalList, setTotalProposalList] = useState<number>(0)

  const [filter, setFilter] = useState<Object>({
    page: 0,
    size: 10,
    direction: 'ASC',
    orderByList: 'openingDate'
  })

  const history = useHistory()
  const [incotermList, setIncotermList] = useState<any[]>([])
  const [partnerList, setPartnerList] = useState<any[]>([])
  const [originDestinationList, setOriginDestinationList] = useState<any[]>([])
  const [radioValue, setRadioValue] = useState('')

  useEffect(() => {
    const newIncotermList: any[] = []
    void (async function () {
      await API.getIncoterm()
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
      await API.getPartner()
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
      await API.getOriginDestination()
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

  useEffect(() => {
    getProposalByFilter()
    console.log(filter)
  }, [filter])

  const getProposalByFilter = (): void => {
    void (async function () {
      await API.getProposals(filter)
        .then((response) => {
          setProposalList(response.content)
          setTotalProposalList(response.totalElements)
        })
        .catch((err) => console.log(err))
    })()
  }

  const getProposalItems = (proposalList): any => {
    const array: any = []
    for (const proposal of proposalList) {
      const opening = new Date(proposal.openingDate).toLocaleDateString(
        'pt-BR'
      )
      const shelfLife = new Date(proposal.validityDate).toLocaleDateString(
        'pt-BR'
      )
      const item = {
        key: proposal.id,
        reference: proposal.reference,
        client: proposal.client,
        origin: proposal.originId,
        destination: proposal.destinationId,
        opening,
        shelfLife,
        iconterm: proposal.incotermId,
        numio: proposal.numIO,
        responsible: proposal.responsible,
        status: proposal.status,
        type: proposal.modal
      }
      array.push(item)
    }
    return array
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

  const handleOrderSelect = (value): void => {
    setFilter((filter) => ({ ...filter, orderByList: value }))
    setOrderBy(value)
  }

  const handleOrderDirection = (): void => {
    if (orderAsc) {
      setFilter((filter) => ({ ...filter, direction: 'DESC' }))
      setOrderAsc(false)
    } else {
      setFilter((filter) => ({ ...filter, direction: 'ASC' }))
      setOrderAsc(true)
    }
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
      <QuickFilters
        cardFilters={cardFilters}
        onFilterClick={handleCardFiltersClick}
      />
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
          <ListMainTitleSpan>
            Propostas em andamento ({totalProposalList})
          </ListMainTitleSpan>
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
                className="select-style"
                onChange={(e) => handleOrderSelect(String(e.target.value))}
                value={orderBy}
                disableUnderline
                placeholder={orderBy}
                onOpen={() => setOpenedOrderSelect(!openedOrderSelect)}
              >
                {orderButtonMenuItems.map((item) => (
                  <MenuItem key={`${String(item.value)}_key`} value={item.value}>
                    <span>{item.description}</span>
                  </MenuItem>
                ))}
              </Select>
            </DropdownMenuContainer>
            <ArrowIconContainer
              onClick={handleOrderDirection}
              $rotate={orderAsc}
            >
              {orderAsc ? <ArrowDown /> : <UpArrow />}
            </ArrowIconContainer>
          </OrderByContainer>
        </RightSideListHeaderContainer>
      </ListHeaderContainer>
      <BottomSideContainer>
        <TableContainer>
          <Table rows={getProposalItems(proposalList)} />
        </TableContainer>
        <PaginationContainer>
          <PaginationMainContainer>
            <Pagination
              onPageChange={(value) => setFilter((filter) => ({ ...filter, page: value }))}
              onRowsPerPageChange={(value) => setFilter((filter) => ({ ...filter, size: value }))}
              labelDisplay="exibindo"
              count={totalProposalList}
              labelRowsPerPage="Propostas por página"
              labelDisplayedRows="de"
              tooltipFirst="Primeira"
              tooltipBack="Anterior"
              tooltipNext="Próxima"
              tooltipLast="Última"
            />
          </PaginationMainContainer>
        </PaginationContainer>
      </BottomSideContainer>
    </RootContainer>
  )
}

export default Proposal
