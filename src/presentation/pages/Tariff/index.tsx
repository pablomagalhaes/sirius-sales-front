import React, { useEffect, useState } from 'react'
import {
  Accordion,
  Button,
  RowFilter,
  Tabs,
  QuickFilters
} from 'fiorde-fe-components'
import { Breadcrumbs, Link, Select, MenuItem } from '@material-ui/core/'
import {
  ArrowIconContainer,
  BottomSideContainer,
  CloseExpirationContainer,
  DropdownMenuContainer,
  ExportTariffContainer,
  ExportListSpan,
  LeftSideListHeaderContainer,
  ListHeaderContainer,
  ListMainTitleSpan,
  ListTextSpan,
  MidleContainer,
  OrderByContainer,
  PaginationContainer,
  PaginationMainContainer,
  RightSideListHeaderContainer,
  RootContainer,
  RowFilterContainer,
  TableContainer,
  TopButtonContainer,
  TopContainer,
  ButtonContainer
} from './style'
import { ExitToApp } from '@material-ui/icons/'
import { useHistory } from 'react-router-dom'
import UpArrow from '../../../application/icons/UpArrow'
import API from '../../../infrastructure/api'
import ArrowDown from '../../../application/icons/ArrowDown'
import { orderButtonMenuItems, menuItems } from './constants'
import { I18n } from 'react-redux-i18n'
import { StatusProposalStringEnum } from '../../../application/enum/statusProposalEnum'

const defaultFilter = {
  direction: 'ASC',
  orderByList: 'openingDate',
  page: 0,
  size: 10
}

const Tariff = (): JSX.Element => {
  const [filter, setFilter] = useState<any>(defaultFilter)
  const [incotermList, setIncotermList] = useState<any[]>([])
  const [openedOrderSelect, setOpenedOrderSelect] = useState(false)
  const [orderAsc, setOrderAsc] = useState(true)
  const [orderBy, setOrderBy] = useState<string>('openingDate')
  const [originDestinationList, setOriginDestinationList] = useState<any[]>([])
  const [originDestinationCountries, setoriginDestinationCountries] = useState<any[]>([])
  const [originDestinationStates, setoriginDestinationStates] = useState<any[]>([])
  const [originDestinationCities, setoriginDestinationCities] = useState<any[]>([])
  const [partnerList, setPartnerList] = useState<any[]>([])
  const [partnerSimpleNameList, setPartnerSimpleNameList] = useState<any[]>([])
  const [tariffList, setTariffList] = useState<any[]>([])
  const [radioValue, setRadioValue] = useState('')
  // const [totalTariffList, setTotalTariffList] = useState<number>(0)
  const [quickFilterList, setQuickFilterList] = useState<any[]>([])
  const [tabs, setTabs] = useState<any[]>()

  const history = useHistory()

  useEffect(() => {
    const newIncotermList: any[] = []
    void (async function () {
      await API.getIncoterms()
        .then((response) => {
          response.forEach((item: any) => {
            newIncotermList.push(item?.id)
          })
          return setIncotermList(newIncotermList)
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
        .then((response) => { setOriginDestinationList(response) })
        .catch((err) => console.log(err))
    })()
    void (async function () {
      const actualList: any[] = []
      await API.getCountries()
        .then((response) => response.forEach((item: any) => actualList.push(String(item.name))))
        .then(() => setoriginDestinationCountries(actualList))
        .catch((err) => console.log(err))
    })()
    void (async function () {
      const actualList: any[] = []
      await API.getMercosulStates()
        .then((response) => response.forEach((item: any) => actualList.push(`${String(item.txState)} (${String(item.txCountry)})`)))
        .then(() => setoriginDestinationStates(actualList))
        .catch((err) => console.log(err))
    })()
    void (async function () {
      const actualList: any[] = []
      await API.getMercosulCities()
        .then((response) => response.forEach((item: any) => actualList.push(`${String(item.txCity)} (${String(item.txCountry)})`)))
        .then(() => setoriginDestinationCities(actualList))
        .catch((err) => console.log(err))
    })()
  }, [])

  const getOriginDestinyList = (land: string): string[] => {
    const actualList: string[] = []
    let type = ''

    switch (radioValue) {
      case 'Aéreo':
        type = 'AEROPORTO'
        break
      case 'Marítimo':
        type = 'PORTO'
        break
      case 'Rodoviário':
        type = 'RODOVIARIO'
        break
      default:
        break
    }
    if (type !== 'RODOVIARIO') {
      originDestinationList?.forEach((item): void => {
        if (item.type === type) {
          actualList.push(`${String(item.id)} - ${String(item.name)}`)
        }
      })
    } else {
      if (land === 'País') {
        originDestinationCountries?.forEach((item): void => {
          actualList.push(item)
        })
      }
      if (land === 'Estado') {
        originDestinationStates?.forEach((item): void => {
          actualList.push(item)
        })
      }
      if (land === 'Cidade') {
        originDestinationCities?.forEach((item): void => {
          actualList.push(item)
        })
      }
    }
    return actualList
  }

  const getLandLabels = (): string[] => {
    let type = ''
    let landLabels: string[] = []
    switch (radioValue) {
      case 'Aéreo':
        type = 'AEROPORTO'
        break
      case 'Marítimo':
        type = 'PORTO'
        break
      case 'Rodoviário':
        type = 'RODOVIARIO'
        break
      default:
        break
    }

    if (type === 'RODOVIARIO') {
      landLabels = ['País', 'Estado', 'Cidade']
    }
    return landLabels
  }

  const getModalFilter = (): string => {
    const modalFilter = quickFilterList.find((item) => item.type === "modal")
    let type: string =  ''
    if(modalFilter !== undefined) {
      switch (modalFilter.status) {
        case 'Aéreo':
          type = 'AIR'
          break
        case 'Marítimo':
          type = 'SEA'
          break
        case 'Rodoviário':
          type = 'LAND'
          break
        default:
          break
      }
    }
    return type
  }

  const getActivityFilter = (): string => {
    const activityFilter = quickFilterList.find((item) => item.type === "activity")
    let type: string =  ''
    if(activityFilter !== undefined) {
      switch (activityFilter.status) {
        case 'Importação':
          type = 'IMPORT'
          break
        case 'Exportação':
          type = 'EXPORT'
          break
        default:
          break
      }
    }
    return type
  }

  const getValidityFilter = (validity: string): string => {
    const validityFilter = quickFilterList.find((item) => item.type === validity)
    let type: string =  ''
    if(validityFilter !== undefined) {
      switch (validityFilter.status) {
        case 'Vencimento próximo':
          type = 'CLOSE_TO_VALIDITY'
          break
        case 'Vencidas':
          type = 'EXPIRED'
          break
        default:
          break
      }
    }
    return type
  }

  const getTariffByFilter = (): void => {
    const modal = getModalFilter()
    const activity = getActivityFilter()
    if (modal !== '' && activity !== '') {
      void (async function () {
        await API.getTariffs(activity, modal, 'EXPIRED')
          .then((response) => {
            const regionsTabs: any[] = []
            response.forEach((item) => {
              const countries: any[]= []
              item.countries.forEach((country) => countries.push({title: country, component: 'teste', disable: false}))
              regionsTabs.push({
                title: item.region,
                icon: '',
                component: <Accordion content={countries} />
              })
            })
            setTabs(regionsTabs)
            setTariffList(response)
            // setTotalTariffList(response.totalElements)
          })
          .catch((err) => console.log(err))
      })()
    }
    console.log(quickFilterList)

  }

  useEffect(() => {
    getTariffByFilter()
  }, [quickFilterList])


  const handleSelectedRowFilter = (selectedFiltersRowFilter: any): void => {
    cleanFilter()

    const selectedProposals = findKeyFilter(
      selectedFiltersRowFilter,
      'Ref. proposta'
    )
    if (selectedProposals !== undefined) {
      setFilter((filter: any) => ({
        ...filter,
        referenceProposal: [selectedProposals]
      }))
    }

    const selectedClients = findKeyFilter(selectedFiltersRowFilter, 'Cliente')
    if (selectedClients !== undefined) {
      const clientIds: any = []
      selectedClients.forEach(name => {
        const client = partnerList.find(item => item.simpleName === name)
        clientIds.push(client.id)
      })

      setFilter((filter: any) => ({
        ...filter,
        idBusinessPartnerCustomer: [clientIds]
      }))
    }

    const selectedProcessTypes = findKeyFilter(
      selectedFiltersRowFilter,
      'Tipo de processo'
    )
    if (selectedProcessTypes !== undefined) {
      setFilter((filter: any) => ({
        ...filter,
        operationType: [selectedProcessTypes]
      }))
    }

    const selectedOriginsDestinations = findKeyFilter(
      selectedFiltersRowFilter,
      'Modal/Origem/Destino'
    )
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
        const selectOriginsDestinations =
          selectedOriginsDestinations.split(' / ')
        const origins = selectOriginsDestinations[0].split(' - ')
        const destinations = selectOriginsDestinations[1].split(' - ')

        setFilter((filter: any) => ({
          ...filter,
          idOrigin: [origins[0]],
          idDestination: [destinations[0]]
        }))
      }
    }

    const selectedIncoterms = findKeyFilter(
      selectedFiltersRowFilter,
      'Incoterm'
    )
    if (selectedIncoterms !== undefined) {
      setFilter((filter: any) => ({
        ...filter,
        idIncoterm: [selectedIncoterms]
      }))
    }

    const selectedStatus = findKeyFilter(
      selectedFiltersRowFilter,
      'Status'
    )
    if (selectedStatus !== undefined) {
      const statusList: string[] = selectedStatus.map((status: string): string => {
        switch (status) {
          case 'Aberta':
            return StatusProposalStringEnum.ABERTA
          case 'Ag. Retorno Cliente':
            return StatusProposalStringEnum.AGUARDANDO_RETORNO_CLIENTE
          case 'Em Revisão':
            return StatusProposalStringEnum.EM_REVISAO
          case 'Aprovada':
            return StatusProposalStringEnum.APROVADA
          case 'Rejeitada':
            return StatusProposalStringEnum.REJEITADA
          case 'Cancelada':
            return StatusProposalStringEnum.CANCELADA
          case 'Cancelamento Automatico':
            return StatusProposalStringEnum.CANCELAMENTO_AUTOMATICO
          default:
            return ''
        }
      })
      setFilter((filter: any) => ({
        ...filter,
        status: [statusList]
      }))
    }

    const selectedDates = findKeyFilter(selectedFiltersRowFilter, 'Período')
    if (selectedDates !== undefined) {
      const type = selectedFiltersRowFilter[5].checkBoxSelecteds
      const size = selectedDates.length

      if (type[0] === 'Dt. Abertura') {
        const openedDates = selectedDates[size - 1].split(' - ')

        const [openedDayBegin, openedMonthBegin, openedYearBegin] =
          openedDates[0].split('/')
        const [openedDayEnd, openedMonthEnd, openedYearEnd] =
          openedDates[1].split('/')

        const openedDtBeginFormated = `${String(openedYearBegin)}/${String(
          openedMonthBegin
        )}/${String(openedDayBegin)}`
        const openedDtEndFormated = `${String(openedYearEnd)}/${String(
          openedMonthEnd
        )}/${String(openedDayEnd)}`

        setFilter((filter: any) => ({
          ...filter,
          'openingDate.dtBegin': openedDtBeginFormated,
          'openingDate.dtEnd': openedDtEndFormated
        }))
      }

      if (type[0] === 'Dt. Validade' || type[1] === 'Dt. Validade') {
        const validateDates = selectedDates[size - 1].split(' - ')

        const [validateDayBegin, validateMonthBegin, validateYearBegin] =
          validateDates[0].split('/')
        const [validateDayEnd, validateMonthEnd, validateYearEnd] =
          validateDates[1].split('/')

        const validateDtBeginFormated = `${String(validateYearBegin)}/${String(
          validateMonthBegin
        )}/${String(validateDayBegin)}`
        const validateDtEndFormated = `${String(validateYearEnd)}/${String(
          validateMonthEnd
        )}/${String(validateDayEnd)}`

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
        if (
          item.pickerSelecteds1.length > 0 &&
          item.pickerSelecteds2.length === 0
        ) {
          return item.pickerSelecteds1
        }
        if (
          item.pickerSelecteds1.length === 0 &&
          item.pickerSelecteds2.length > 0
        ) {
          return item.pickerSelecteds2
        }
        if (
          item.pickerSelecteds1.length > 0 &&
          item.pickerSelecteds2.length > 0
        ) {
          return `${String(item.pickerSelecteds1)} / ${String(
            item.pickerSelecteds2
          )}`
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
    delete filter.idBusinessPartnerCustomer
    delete filter.operationType
    delete filter.idOrigin
    delete filter.idDestination
    delete filter.idIncoterm
    delete filter.status
    delete filter['openingDate.dtBegin']
    delete filter['openingDate.dtEnd']
    delete filter['validityDate.dtBegin']
    delete filter['validityDate.dtEnd']

    setFilter(() => ({
      direction: 'ASC',
      orderByList: 'openingDate',
      page: 0,
      size: 10
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
      label: 'Modal/Origem/Destino',
      radioButtonList: menuItems.modal,
      pickerListOptions1: getOriginDestinyList('País'),
      pickerListOptions2: getOriginDestinyList('Estado'),
      pickerListOptions3: getOriginDestinyList('Cidade'),
      pickerLabel1: 'Origem',
      pickerLabel2: 'Destino',
      title1: 'Modal',
      pickerLandLabels: getLandLabels()

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
    },
    {
      label: 'Status',
      checkboxList1: menuItems.statusTypes,
      pickerLabel1: 'Status'
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

  const handleExportTariff = (): void => {}

  const data = [
    {
        title: 'Argentina',
        component: 'teste',
        disable: true,
    },
    {
        title: 'Brasil',
        component: (
            <Button
                backgroundGreen={true}
                disabled={false}
                icon={''}
                onAction={function (arg: any): void {
                    throw new Error('Function not implemented.');
                }}
                text={'Clique aqui'}
                tooltip={''}
            />
        ),
        disable: false,
    },
    { title: 'México', component: 'texto 3', disable: false },
    { title: 'Estados Unidos', component: 'texto 4', disable: false },
  ];

  // const tabs = [
  //   {
  //       title: 'Europa',
  //       icon: '',
  //       component: 'teste'
  //   },
  //   { title: 'Americas', icon: '', component: <Accordion content={data} /> },
  //   { title: 'Asia', icon: '', component: 'texto simples' },
  //   { title: 'Oceania', icon: '', component: 4 },
  //   { title: 'Africa', icon: '', component: 5 },
  // ];

  const cardFilters = [
    {
        iconType: 'import',
        status: 'Importação',
        uniqueChoice: true,
    },
    {
        iconType: 'export',
        status: 'Exportação',
        uniqueChoice: true,
    },
    {
        iconType: 'truck',
        status: 'Rodoviário',
        uniqueChoice: true,
    },
    {
        iconType: 'plane',
        status: 'Aéreo',
        uniqueChoice: true,
    },
    {
        iconType: 'ship',
        status: 'Marítimo',
        uniqueChoice: true,
    },
    {
        iconType: 'warn',
        status: 'Vencimento próximo',
    },
    {
        iconType: 'alert',
        status: 'Vencidas',
    },
  ];

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
          <span className="breadcrumbEnd">Tarifário</span>
        </Breadcrumbs>
        <TopButtonContainer>
          <ButtonContainer>
            <Button
              disabled={false}
              text={'Fazer upload de tarifas'}
              tooltip={'Fazer upload de tarifas'}
              backgroundGreen={true}
              icon="upload"
              onAction={() => { }}
              popover
              position="left"

              />
          </ButtonContainer>
        </TopButtonContainer>
      </TopContainer>
      <MidleContainer>
        Exibir por: 
        <QuickFilters
          cardFilters={cardFilters}
          onFilterClick={(selectedFilterCards) => setQuickFilterList(selectedFilterCards)}
        />
      </MidleContainer>
      <ListHeaderContainer>
        <LeftSideListHeaderContainer>
          <RowFilter
            addFilterLabel="Filtros avançados"
            applyLabel="Aplicar"
            approveLabel="Salvar Filtro"
            cleanLabel="Limpar"
            handleClean={handleChangeModal}
            handleCleanRow={handleCleanModal}
            handleSelectedFilters={handleSelectedRowFilter}
            menuItemsSelector={menuItemsSelector}
            myFilterLabel="Meus Filtros"
            setRadioValue={setRadioValue}
          />
        </LeftSideListHeaderContainer>
        <RightSideListHeaderContainer>
          <ExportTariffContainer onClick={handleExportTariff}>
            <ExitToApp />
            <ExportListSpan>Exportar tarifas</ExportListSpan>
          </ExportTariffContainer>
          <OrderByContainer>
            <ListTextSpan>Ordenar por:</ListTextSpan>
            <DropdownMenuContainer showArrow={openedOrderSelect}>
              <Select
                className="select-style"
                disableUnderline
                onChange={(e) => handleOrderSelect(String(e.target.value))}
                onOpen={() => setOpenedOrderSelect(!openedOrderSelect)}
                placeholder={orderBy}
                value={orderBy}
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
        {tabs !== undefined && <Tabs tabs={tabs}/>}
      </BottomSideContainer>
    </RootContainer>
  )
}

export default Tariff
