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
import { I18n } from 'react-redux-i18n'
import { StatusProposalEnum, StatusProposalStringEnum } from '../../../application/enum/statusProposalEnum'

const defaultFilter = {
  page: 0,
  size: 10,
  direction: 'ASC',
  orderByList: 'openingDate'
}

const Proposal = (): JSX.Element => {
  const [orderBy, setOrderBy] = useState<string>('openingDate')
  const [orderAsc, setOrderAsc] = useState(true)
  const [openedOrderSelect, setOpenedOrderSelect] = useState(false)
  const [proposalList, setProposalList] = useState<any[]>([])
  const [totalProposalList, setTotalProposalList] = useState<number>(0)
  const [incotermList, setIncotermList] = useState<any[]>([])
  const [partnerList, setPartnerList] = useState<any[]>([])
  const [partnerSimpleNameList, setPartnerSimpleNameList] = useState<any[]>([])
  const [originDestinationList, setOriginDestinationList] = useState<any[]>([])
  const [radioValue, setRadioValue] = useState('')

  const history = useHistory()

  const [filter, setFilter] = useState<any>(defaultFilter)

  useEffect(() => {
    const newIncotermList: any[] = []
    void (async function () {
      await API.getIncoterms()
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
    const simpleNameList: any[] = []
    const newPartnerList: any[] = []
    void (async function () {
      await API.getPartner()
        .then((response) => {
          response.forEach((item: any) => {
            simpleNameList.push(item?.businessPartner?.simpleName)
            newPartnerList.push(item?.businessPartner)
          })
          setPartnerSimpleNameList(simpleNameList)
          setPartnerList(newPartnerList)
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

    originDestinationList?.forEach((item): void => {
      if (item.type === type) {
        actualList.push(`${String(item.id)} - ${String(item.name)}`)
      }
    })

    return actualList
  }

  useEffect(() => {
    getProposalByFilter()
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

  const verifyStatus = (status: any): any => {
    switch (status) {
      case 'Aberta':
        return StatusProposalEnum.ABERTA
      case 'Ag. Retorno Cliente':
        return StatusProposalEnum.AGUARDANDO_RETORNO_CLIENTE
      case 'Em Revisao':
        return StatusProposalEnum.EM_REVISAO
      case 'Aprovada':
        return StatusProposalEnum.APROVADA
      case 'Rejeitada':
        return StatusProposalEnum.REJEITADA
      case 'Cancelada':
        return StatusProposalEnum.CANCELADA
      case 'Cancelamento Automático':
        return StatusProposalEnum.CANCELAMENTO_AUTOMATICO
    }
  }

  const getClientSimpleName = (clientId): string[] => {
    const finalList: string[] = []

    partnerList?.forEach((item): void => {
      if (Number(item.id) === Number(clientId)) {
        finalList.push(String(item.simpleName))
      }
    })
    return finalList
  }

  const getProposalItems = (proposalList: any[]): any => {
    const array: any = []
    for (const proposal of proposalList) {
      const opening = new Date(proposal.openingDate).toLocaleDateString(
        'pt-BR'
      )
      const shelfLife = new Date(proposal.validityDate).toLocaleDateString(
        'pt-BR'
      )
      const status = verifyStatus(proposal.status)
      const item = {
        key: proposal.idProposal,
        reference: proposal.reference,
        client: getClientSimpleName(proposal.client),
        origin: proposal.originId,
        destination: proposal.destinationId,
        opening,
        shelfLife,
        iconterm: proposal.incotermId,
        numio: proposal.numIO,
        responsible: proposal.responsible,
        status: status,
        type: proposal.modal,
        menuItems: menuItemsList(status, proposal.idProposal),
        isLate: false // alterar o 'false' pela regra para quando o vencimento estiver proximo
      }
      array.push(item)
    }
    return array
  }

  const setStatus = (id: any, status: String): void => {
    void (async function () {
      await API.putStatus(id, status)
        .then(() => {
          getProposalByFilter()
        })
        .catch((err) => console.log(err))
    })()
  }

  const editEventPage = (id: any): void => {
    history.push({
      pathname: '/novaProposta',
      state: { proposalId: id }
    })
  }

  const duplicateEventPage = (id: any): void => {
    history.push({
      pathname: '/novaProposta',
      state: { proposalId: id, eventType: 'duplicate' }
    })
  }

  const menuItemsList = (status: any, id: any): void => {
    const array: any = []
    switch (status) {
      case StatusProposalEnum.ABERTA:
        array.push({
          iconType: 'edit',
          label: I18n.t('pages.proposal.table.editLabel'),
          onClick: () => {
            editEventPage(id)
          }
        },
        {
          iconType: 'duplicate',
          label: I18n.t('pages.proposal.table.duplicateLabel'),
          onClick: () => {
            duplicateEventPage(id)
          }
        },
        {
          iconType: 'forward',
          label: I18n.t('pages.proposal.table.confirmLabel'),
          onClick: () => { setStatus(id, StatusProposalStringEnum.AGUARDANDO_RETORNO_CLIENTE) }
        },
        {
          iconType: 'cancel',
          label: I18n.t('pages.proposal.table.cancelLabel'),
          onClick: () => { setStatus(id, StatusProposalStringEnum.CANCELADA) }
        })
        return array
      case StatusProposalEnum.AGUARDANDO_RETORNO_CLIENTE:
        array.push({
          iconType: 'duplicate',
          label: I18n.t('pages.proposal.table.duplicateLabel'),
          onClick: () => {
            duplicateEventPage(id)
          }
        },
        {
          iconType: 'fileReview',
          label: I18n.t('pages.proposal.table.reviewLabel'),
          onClick: () => { setStatus(id, StatusProposalStringEnum.EM_REVISAO) }
        },
        {
          iconType: 'cancel',
          label: I18n.t('pages.proposal.table.cancelLabel'),
          onClick: () => { setStatus(id, StatusProposalStringEnum.CANCELADA) }
        },
        {
          iconType: 'thumbsUp',
          label: I18n.t('pages.proposal.table.approveLabel'),
          onClick: () => { setStatus(id, StatusProposalStringEnum.APROVADA) }
        },
        {
          iconType: 'thumbsDown',
          label: I18n.t('pages.proposal.table.rejectLabel'),
          onClick: () => { setStatus(id, StatusProposalStringEnum.REJEITADA) }
        })
        return array
      case StatusProposalEnum.EM_REVISAO:
        array.push({
          iconType: 'edit',
          label: I18n.t('pages.proposal.table.editLabel'),
          onClick: () => {
            editEventPage(id)
          }
        },
        {
          iconType: 'duplicate',
          label: I18n.t('pages.proposal.table.duplicateLabel'),
          onClick: () => {
            duplicateEventPage(id)
          }
        },
        {
          iconType: 'forward',
          label: I18n.t('pages.proposal.table.confirmLabel'),
          onClick: () => { setStatus(id, StatusProposalStringEnum.AGUARDANDO_RETORNO_CLIENTE) }
        },
        {
          iconType: 'cancel',
          label: I18n.t('pages.proposal.table.cancelLabel'),
          onClick: () => { setStatus(id, StatusProposalStringEnum.CANCELADA) }
        })
        return array
      case StatusProposalEnum.APROVADA:
        array.push({
          iconType: 'duplicate',
          label: I18n.t('pages.proposal.table.duplicateLabel'),
          onClick: () => {
            duplicateEventPage(id)
          }
        })
        return array
      case StatusProposalEnum.REJEITADA:
        array.push({
          iconType: 'duplicate',
          label: I18n.t('pages.proposal.table.duplicateLabel'),
          onClick: () => {
            duplicateEventPage(id)
          }
        })
        return array
      case StatusProposalEnum.CANCELADA:
        array.push({
          iconType: 'duplicate',
          label: I18n.t('pages.proposal.table.duplicateLabel'),
          onClick: () => {
            duplicateEventPage(id)
          }
        })
        return array
      default:
        array.push({
          iconType: 'duplicate',
          label: I18n.t('pages.proposal.table.duplicateLabel'),
          onClick: () => {
            duplicateEventPage(id)
          }
        })
        return array
    }
  }

  const handleExportList = (): void => {
    alert('export list')
  }

  const handleCardFiltersClick = (): void => {
  }

  const handleSelectedRowFilter = (selectedFiltersRowFilter: any): void => {
    cleanFilter()

    const selectedProposals = findKeyFilter(selectedFiltersRowFilter, 'Ref. proposta')
    if (selectedProposals !== undefined) {
      setFilter((filter: any) => ({
        ...filter,
        referenceProposal: [selectedProposals]
      }))
    }

    const selectedClients = findKeyFilter(selectedFiltersRowFilter, 'Cliente')
    if (selectedClients !== undefined) {
      setFilter((filter: any) => ({
        ...filter,
        idBusinessPartnerCostumer: [selectedClients]
      }))
    }

    const selectedProcessTypes = findKeyFilter(selectedFiltersRowFilter, 'Tipo de processo')
    if (selectedProcessTypes !== undefined) {
      setFilter((filter: any) => ({
        ...filter,
        operationType: [selectedProcessTypes]
      }))
    }

    const selectedOriginsDestinations = findKeyFilter(selectedFiltersRowFilter, 'Origem/Destino')
    if (selectedOriginsDestinations !== undefined) {
      const typeOrigin = selectedFiltersRowFilter[3].pickerSelecteds1
      const typeDestination = selectedFiltersRowFilter[3].pickerSelecteds2

      if (typeOrigin.length === 1 && typeDestination.length === 0) {
        const origins = selectedOriginsDestinations[0].split(' - ')
        setFilter((filter: any) => ({
          ...filter,
          idOrigin: [origins]
        }))
      }

      if (typeOrigin.length === 0 && typeDestination.length === 1) {
        const destinations = selectedOriginsDestinations[0].split(' - ')
        setFilter({
          ...filter,
          idDestination: [destinations]
        })
      }

      if (typeOrigin.length === 1 && typeDestination.length === 1) {
        const selectOriginsDestinations = selectedOriginsDestinations.split(' / ')

        const origins = selectOriginsDestinations[0].split(' - ')
        const destinations = selectOriginsDestinations[1].split(' - ')

        setFilter((filter: any) => ({
          ...filter,
          idOrigin: [origins[0]],
          idDestination: [destinations[0]]
        }))
      }
    }

    const selectedIncoterms = findKeyFilter(selectedFiltersRowFilter, 'Incoterm')
    if (selectedIncoterms !== undefined) {
      setFilter((filter: any) => ({
        ...filter,
        idIncoterm: [selectedIncoterms]
      }))
    }

    const selectedDates = findKeyFilter(selectedFiltersRowFilter, 'Período')
    if (selectedDates !== undefined) {
      const type = selectedFiltersRowFilter[5].checkBoxSelecteds
      const size = selectedDates.length

      if (type[0] === 'Dt. Abertura') {
        const openedDates = selectedDates[size - 1].split(' - ')

        const [openedDayBegin, openedMonthBegin, openedYearBegin] = openedDates[0].split('/')
        const [openedDayEnd, openedMonthEnd, openedYearEnd] = openedDates[1].split('/')

        const openedDtBeginFormated = `${String(openedYearBegin)}/${String(openedMonthBegin)}/${String(openedDayBegin)}`
        const openedDtEndFormated = `${String(openedYearEnd)}/${String(openedMonthEnd)}/${String(openedDayEnd)}`

        setFilter((filter: any) => ({
          ...filter,
          'openingDate.dtBegin': openedDtBeginFormated,
          'openingDate.dtEnd': openedDtEndFormated
        }))
      }

      if (type[0] === 'Dt. Validade' || type[1] === 'Dt. Validade') {
        const validateDates = selectedDates[size - 1].split(' - ')

        const [validateDayBegin, validateMonthBegin, validateYearBegin] = validateDates[0].split('/')
        const [validateDayEnd, validateMonthEnd, validateYearEnd] = validateDates[1].split('/')

        const validateDtBeginFormated = `${String(validateYearBegin)}/${String(validateMonthBegin)}/${String(validateDayBegin)}`
        const validateDtEndFormated = `${String(validateYearEnd)}/${String(validateMonthEnd)}/${String(validateDayEnd)}`

        setFilter((filter: any) => ({
          ...filter,
          'validityDate.dtBegin': validateDtBeginFormated,
          'validityDate.dtEnd': validateDtEndFormated
        }))
      }
    }
  }

  const findKeyFilter = (filterSelected: any, key: string): any => {
    for (const item of filterSelected) {
      if (item.filterName === key) {
        if (item.textFieldValueSelected !== '') {
          return item.textFieldValueSelected
        }
        if (item.pickerSelecteds1.length > 0 && item.pickerSelecteds2.length === 0) {
          return item.pickerSelecteds1
        }
        if (item.pickerSelecteds1.length === 0 && item.pickerSelecteds2.length > 0) {
          return item.pickerSelecteds2
        }
        if (item.pickerSelecteds1.length > 0 && item.pickerSelecteds2.length > 0) {
          return `${String(item.pickerSelecteds1)} / ${String(item.pickerSelecteds2)}`
        }
        if (item.checkBoxSelecteds1.length > 0) {
          return item.checkBoxSelecteds1
        }
        if (item.selectedDates.length > 0) {
          return item.selectedDates
        }
      }
    }
  }

  const cleanFilter = (): void => {
    delete filter.referenceProposal
    delete filter.idBusinessPartnerCostumer
    delete filter.operationType
    delete filter.idOrigin
    delete filter.idDestination
    delete filter.idIncoterm
    delete filter['openingDate.dtBegin']
    delete filter['openingDate.dtEnd']
    delete filter['validityDate.dtBegin']
    delete filter['validityDate.dtEnd']

    setFilter(() => ({
      page: 0,
      size: 10,
      direction: 'ASC',
      orderByList: 'openingDate'
    }))
  }

  const handleOrderSelect = (value: React.SetStateAction<string>): void => {
    setFilter((filter: any) => ({ ...filter, orderByList: value }))
    setOrderBy(value)
  }

  const handleOrderDirection = (): void => {
    if (orderAsc) {
      setFilter((filter: any) => ({ ...filter, direction: 'DESC' }))
      setOrderAsc(false)
    } else {
      setFilter((filter: any) => ({ ...filter, direction: 'ASC' }))
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
      pickerListOptions1: partnerSimpleNameList,
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

  const showMsgTotalResult = (): string => {
    const keys = Object.keys(filter)

    /* eslint-disable no-prototype-builtins */
    const page = filter.hasOwnProperty('page')
    const size = filter.hasOwnProperty('size')
    const direction = filter.hasOwnProperty('direction')
    const orderByList = filter.hasOwnProperty('orderByList')

    if (keys.length === 4 && (Boolean(page)) && (Boolean(size)) && (Boolean(direction)) && (Boolean(orderByList))) {
      return `Propostas (${totalProposalList}) - Últimos 30 dias`
    }
    return `Resultado do filtro (${totalProposalList})`
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
            onAction={() => history.push({
              pathname: '/novaProposta',
              state: { proposalId: null }
            })}
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
          addFilterLabel="Filtros avançados"
          handleSelectedFilters={handleSelectedRowFilter}
          setRadioValue={setRadioValue}
          handleClean={handleChangeModal}
          handleCleanRow={handleCleanModal}
        />
      </RowFilterContainer>
      <ListHeaderContainer>
        <LeftSideListHeaderContainer>
          <ListMainTitleSpan>
            {showMsgTotalResult()}
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
                  <MenuItem
                    key={`${String(item.value)}_key`}
                    value={item.value}
                  >
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
          <Table
            approvedLabel={(I18n.t('pages.proposal.table.approvedLabel'))}
            cancelLabel={(I18n.t('pages.proposal.table.cancelledLabel'))}
            inRevisionLabel={(I18n.t('pages.proposal.table.inRevisionLabel'))}
            isShowIconLate={true}
            openLabel={(I18n.t('pages.proposal.table.openLabel'))}
            rejectLabel={(I18n.t('pages.proposal.table.rejectedLabel'))}
            rows={getProposalItems(proposalList)}
            waitingForCustomerReturnLabel={(I18n.t('pages.proposal.table.waitingForCustomerReturnLabel'))}
          />
        </TableContainer>
        <PaginationContainer>
          <PaginationMainContainer>
            <Pagination
              onPageChange={(value) => setFilter((filter: any) => ({ ...filter, page: value }))}
              onRowsPerPageChange={(value) => setFilter((filter: any) => ({ ...filter, size: value, page: 0 }))}
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
