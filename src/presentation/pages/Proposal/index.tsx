import React, { useState } from 'react';
import {
  FloatingButton,
  FloatingMenu,
  GroupedCardFilters,
  InfiniteScroll,
  Table,
  RowFilter,
} from 'fiorde-fe-components';
import { Breadcrumbs, Link, Typography, Popover } from '@material-ui/core/';
import {
  RootContainer,
  ListHeader,
  LeftSideListHeader,
  RightSideListHeader,
  InfiniteScrollContainer,
  BottomSideContainer,
} from './style';
import { ExitToApp, Warning, ArrowDropDown } from '@material-ui/icons/';
import {
  cardFilters,
  infiniteScrollRows,
  infiniteScrollColumns,
  floatingButtonMenuItems,
  menuItemsSelector,
} from './constants';

const Proposal = () => {
  const [orderBy, setOrderBy] = useState('Dt. validade');
  const [anchorEl, setAnchorEl] = useState(null);

  const orderButtonMenuItems = [
    {
      iconType: '',
      label: 'Ref. proposta',
      onClick: () => setOrderBy('Ref. proposta'),
    },
    {
      iconType: '',
      label: 'Nome do cliente',
      onClick: () => setOrderBy('Nome do cliente'),
    },
    {
      iconType: '',
      label: 'Responsável',
      onClick: () => setOrderBy('Responsável'),
    },
    {
      iconType: '',
      label: 'Modal',
      onClick: () => setOrderBy('Modal'),
    },
    {
      iconType: '',
      label: 'Origem',
      onClick: () => setOrderBy('Origem'),
    },
    {
      iconType: '',
      label: 'Destino',
      onClick: () => setOrderBy('Destino'),
    },
    {
      iconType: '',
      label: 'Dt. abertura',
      onClick: () => setOrderBy('Dt. abertura'),
    },
    {
      iconType: '',
      label: 'Dt. validade',
      onClick: () => setOrderBy('Dt. validade'),
    },
  ];

  const handleClickBreadcrumbs = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOrder = (event: any) => {
    setAnchorEl(event.currentTarget);
    if (anchorEl) handleClose();
  };

  const handleExportList = () => {
    alert('export list');
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleCardFiltersClick = (selectedCardFilters: any) => {
    console.log(selectedCardFilters);
  };

  const handleLoadMoreItems = () => {
    alert('loading more items');
  };

  const handleSelectedRowFilter = (selectedFiltersRowFilter: any) => {
    console.log(selectedFiltersRowFilter);
  };

  return (
    <RootContainer>
      <div style={{ margin: '25px 0' }}>
        <Breadcrumbs separator='>' aria-label='breadcrumb'>
          <Link
            color='inherit'
            href='/'
            onClick={handleClickBreadcrumbs}
            className='breadcrumbInitial'
          >
            Home
          </Link>
          <span className='breadcrumbEnd'>Propostas</span>
        </Breadcrumbs>
      </div>
      <GroupedCardFilters
        cardFilters={cardFilters}
        onFilterClick={handleCardFiltersClick}
      />
      <div style={{ margin: '25px 0' }}>
        <RowFilter
          menuItemsSelector={menuItemsSelector}
          cleanLabel='Limpar'
          myFilterLabel='Meus Filtros'
          applyLabel='Aplicar'
          approveLabel='Salvar Filtro'
          addFilterLabel='Aplicar filtros'
          handleSelectedFilters={handleSelectedRowFilter}
        />
      </div>
      <ListHeader>
        <LeftSideListHeader>
          <span className='main-title'>Propostas em andamento (210)</span>
          <div className='export-list-class' onClick={handleExportList}>
            <ExitToApp />
            <span>Exportar lista</span>
          </div>
        </LeftSideListHeader>
        <RightSideListHeader>
          <div className='warning-content'>
            <Warning />
            <div>1 com vencimento proximo</div>
          </div>
          <div className='order-content'>
            <div>Ordenar por:</div>
            <div className='dropdown-menu-content' onClick={handleClickOrder}>
              <span>{orderBy}</span>
              <ArrowDropDown />
              <Popover
                id={id}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
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
        <div className='floating-button-style'>
          <FloatingButton label='Novo item'>
            <FloatingMenu menuItems={floatingButtonMenuItems} />
          </FloatingButton>
        </div>
        <InfiniteScrollContainer>
          <InfiniteScroll
            isLoading={false}
            onLoadMoreItems={handleLoadMoreItems}
          >
            <Table
              columns={infiniteScrollColumns}
              rows={infiniteScrollRows()}
            />
          </InfiniteScroll>
        </InfiniteScrollContainer>
      </BottomSideContainer>
    </RootContainer>
  );
};

export default Proposal;
