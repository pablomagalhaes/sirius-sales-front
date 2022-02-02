import React, { useState } from 'react'
import {
  FloatingMenu,
  QuickFilters,
  Table,
  RowFilter,
  Pagination,
  Button
} from 'fiorde-fe-components'
import { Breadcrumbs, Link, Popover } from '@material-ui/core/'
import {
  RootContainer,
  ListHeader,
  LeftSideListHeader,
  RightSideListHeader,
  TableContainer,
  BottomSideContainer,
  PaginationContainer,
  PaginationMainContainer,
  TopContainer,
  TopButtonContainer
} from './style'
import { ExitToApp, Warning, ArrowDropDown } from '@material-ui/icons/'
import { cardFilters, TableRows, menuItemsSelector } from './constants'
import { useHistory } from 'react-router-dom'

const Proposal = (): JSX.Element => {
  const [orderBy, setOrderBy] = useState('Dt. validade')
  const [anchorEl, setAnchorEl] = useState(null)
  const history = useHistory()

  const orderButtonMenuItems = [
    {
      iconType: '',
      label: 'Ref. proposta',
      onClick: () => setOrderBy('Ref. proposta')
    },
    {
      iconType: '',
      label: 'Nome do cliente',
      onClick: () => setOrderBy('Nome do cliente')
    },
    {
      iconType: '',
      label: 'Responsável',
      onClick: () => setOrderBy('Responsável')
    },
    {
      iconType: '',
      label: 'Modal',
      onClick: () => setOrderBy('Modal')
    },
    {
      iconType: '',
      label: 'Origem',
      onClick: () => setOrderBy('Origem')
    },
    {
      iconType: '',
      label: 'Destino',
      onClick: () => setOrderBy('Destino')
    },
    {
      iconType: '',
      label: 'Dt. abertura',
      onClick: () => setOrderBy('Dt. abertura')
    },
    {
      iconType: '',
      label: 'Dt. validade',
      onClick: () => setOrderBy('Dt. validade')
    }
  ]

  const handleClickBreadcrumbs = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    event.preventDefault()
    console.info('You clicked a breadcrumb.')
  }

  const handleClose = (): void => {
    setAnchorEl(null)
  }

  const handleClickOrder = (event: any): void => {
    setAnchorEl(event.currentTarget)
    if (anchorEl !== null) handleClose()
  }

  const handleExportList = (): void => {
    alert('export list')
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleCardFiltersClick = (selectedCardFilters: any): void => {
    console.log(selectedCardFilters)
  }

  const handleSelectedRowFilter = (selectedFiltersRowFilter: any): void => {
    console.log(selectedFiltersRowFilter)
  }

  return (
    <RootContainer>
       <TopContainer>
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <Link
            color="inherit"
            href="/"
            onClick={handleClickBreadcrumbs}
            className="breadcrumbInitial"
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
      <div style={{ margin: '25px 0' }}>
        <RowFilter
          menuItemsSelector={menuItemsSelector}
          cleanLabel="Limpar"
          myFilterLabel="Meus Filtros"
          applyLabel="Aplicar"
          approveLabel="Salvar Filtro"
          addFilterLabel="Aplicar filtros"
          handleSelectedFilters={handleSelectedRowFilter}
        />
      </div>
      <ListHeader>
        <LeftSideListHeader>
          <span className="main-title">Propostas em andamento (210)</span>
          <div className="export-list-class" onClick={handleExportList}>
            <ExitToApp />
            <span>Exportar lista</span>
          </div>
        </LeftSideListHeader>
        <RightSideListHeader>
          <div className="warning-content">
            <Warning />
            <div>1 com vencimento proximo</div>
          </div>
          <div className="order-content">
            <div>Ordenar por:</div>
            <div className="dropdown-menu-content" onClick={handleClickOrder}>
              <span>{orderBy}</span>
              <ArrowDropDown />
              <Popover
                id={id}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={open}
                anchorEl={anchorEl}
              >
                <FloatingMenu menuItems={orderButtonMenuItems} />
              </Popover>
            </div>
          </div>
        </RightSideListHeader>
      </ListHeader>
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
