import React, { useState } from 'react'
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
import { cardFilters, TableRows, menuItemsSelector, orderButtonMenuItems } from './constants'
import { useHistory } from 'react-router-dom'
import UpArrow from '../../../application/icons/UpArrow'

const Proposal = (): JSX.Element => {
  const [orderBy, setOrderBy] = useState<string>('Dt. validade')
  const [orderAsc, setOrderAsc] = useState(true)
  const [openedOrderSelect, setOpenedOrderSelect] = useState(false)
  const history = useHistory()

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
            text={'Criar nova proposta...'}
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
                  <MenuItem key={`${type}_key`} value={type}>
                    <span>{type}</span>
                  </MenuItem>)
                )}
              </Select>
            </DropdownMenuContainer>
            <ArrowIconContainer onClick={handleOrderDirection} rotate={orderAsc}>
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
            <Pagination labelDisplay='exibindo' count={100} labelRowsPerPage='Propostas por página' labelDisplayedRows='de' tooltipFirst='Primeira' tooltipBack='Anterior' tooltipNext='Próxima' tooltipLast='Última' />
          </PaginationMainContainer>
        </PaginationContainer>
      </BottomSideContainer>
    </RootContainer>
  )
}

export default Proposal
