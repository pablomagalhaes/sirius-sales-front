import React, { useEffect, useState } from 'react'
import {
  Accordion,
  Button,
  FloatingMenu,
  RowFilter,
  Tabs,
  QuickFilters
} from 'fiorde-fe-components'
import { Breadcrumbs, Link, Select, MenuItem } from '@material-ui/core/'
import {
  ArrowIconContainer,
  BottomSideContainer,
  DropdownMenuContainer,
  ExportTariffContainer,
  ExportListSpan,
  LeftSideListHeaderContainer,
  ListHeaderContainer,
  ListTextSpan,
  MidleContainer,
  OrderByContainer,
  RightSideListHeaderContainer,
  RootContainer,
  TopButtonContainer,
  TopContainer,
  ButtonContainer,
  MidleTypography
} from './style'
import { ExitToApp } from '@material-ui/icons/'
import { useHistory } from 'react-router-dom'
import UpArrow from '../../../application/icons/UpArrow'
import API from '../../../infrastructure/api'
import ArrowDown from '../../../application/icons/ArrowDown'
import { orderButtonMenuItems, menuItems } from './constants'
import { I18n } from 'react-redux-i18n'
import { StatusProposalStringEnum } from '../../../application/enum/statusProposalEnum'
import TariffTable from './TariffTable'
import { getModalFilter, getActivityFilter, getValidityFilter } from './helpers'
import TariffUploadModal from '../../components/TariffUploadModal/TariffUploadModal'

const defaultFilter = {
  direction: 'ASC',
  orderByList: 'tariffType',
  page: 0,
  size: 10,
  tariffModalType: '',
  validityTariff: '',
  tariffType: ''
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
  const [quickFilterList, setQuickFilterList] = useState<any[]>([
    { type: 'activity', status: 'Importação' },
    { type: 'modal', status: 'Aéreo' }
  ])
  const [tabs, setTabs] = useState<any[]>()
  const [countryExpanded, setCountryExpanded] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [uploadType, setUploadType] = useState('')

  const history = useHistory()

  // useEffect(() => {
  //   const newIncotermList: any[] = []
  //   void (async function () {
  //     await API.getIncoterms()
  //       .then((response) => {
  //         response.forEach((item: any) => {
  //           newIncotermList.push(item?.id)
  //         })
  //         return setIncotermList(newIncotermList)
  //       })
  //       .catch((err) => console.log(err))
  //   })()
  // }, [])

  // useEffect(() => {
  //   const simpleNameList: any[] = []
  //   const newPartnerList: any[] = []
  //   void (async function () {
  //     await API.getPartner()
  //       .then((response) => {
  //         response.forEach((item: any) => {
  //           simpleNameList.push(item?.businessPartner?.simpleName)
  //           newPartnerList.push(item?.businessPartner)
  //         })
  //         setPartnerSimpleNameList(simpleNameList)
  //         setPartnerList(newPartnerList)
  //       })
  //       .catch((err) => console.log(err))
  //   })()
  // }, [])

  // useEffect(() => {
  //   void (async function () {
  //     await API.getOriginDestination()
  //       .then((response) => { setOriginDestinationList(response) })
  //       .catch((err) => console.log(err))
  //   })()
  //   void (async function () {
  //     const actualList: any[] = []
  //     await API.getCountries()
  //       .then((response) => response.forEach((item: any) => actualList.push(String(item.name))))
  //       .then(() => setoriginDestinationCountries(actualList))
  //       .catch((err) => console.log(err))
  //   })()
  //   void (async function () {
  //     const actualList: any[] = []
  //     await API.getMercosulStates()
  //       .then((response) => response.forEach((item: any) => actualList.push(`${String(item.txState)} (${String(item.txCountry)})`)))
  //       .then(() => setoriginDestinationStates(actualList))
  //       .catch((err) => console.log(err))
  //   })()
  //   void (async function () {
  //     const actualList: any[] = []
  //     await API.getMercosulCities()
  //       .then((response) => response.forEach((item: any) => actualList.push(`${String(item.txCity)} (${String(item.txCountry)})`)))
  //       .then(() => setoriginDestinationCities(actualList))
  //       .catch((err) => console.log(err))
  //   })()
  // }, [])

  const floatingButtonMenuItems = [
    {
      iconType: 'import',
      label: I18n.t('pages.tariff.upload.import'),
      onClick: () => { setUploadType(I18n.t('pages.tariff.upload.import')); setOpen(true) }
    }, {
      iconType: 'export',
      label: I18n.t('pages.tariff.upload.export'),
      onClick: () => { setUploadType(I18n.t('pages.tariff.upload.export')); setOpen(true) }
    }
  ]

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

  const getTariffByFilter = (): void => {
    if (filter.tariffModalType !== '' && filter.tariffType !== '') {
      void (async function () {
        await API.getTariffs(filter.tariffType, filter.tariffModalType, filter.validityTariff)
          .then((response) => {
            setTariffList(response)
          })
          .catch((err) => console.log(err))
      })()
    }
  }

  const createTabs = (): void => {
    const regionsTabs: any[] = []
    if (tariffList?.length > 0) {
      tariffList.forEach((item) => {
        const content: any[] = []
        item.countries.forEach((country: string) => content.push({
          title: country,
          component: <TariffTable
            region={item.region}
            expanded={countryExpanded === country}
            country={country}
            filter={filter}
            setFilter={setFilter}
          />,
          disable: false,
          onChange: (country: string, expanded: boolean): void => { setCountryExpanded(country) },
          expanded: countryExpanded === country
        }))
        regionsTabs.push({
          title: item.region,
          icon: '',
          component: <Accordion content={content} />
        })
      })
    }
    setTabs(regionsTabs)
  }

  const getQuickFilters = (): void => {
    const tariffModalType = getModalFilter(quickFilterList)
    const tariffType = getActivityFilter(quickFilterList)
    const validityTariff = getValidityFilter(quickFilterList)
    setFilter((filter: any) => ({
      ...filter,
      tariffModalType,
      validityTariff,
      tariffType
    }))
  }

  useEffect(() => {
    createTabs()
  }, [tariffList, countryExpanded])

  useEffect(() => {
    getQuickFilters()
    setCountryExpanded('')
  }, [quickFilterList])

  useEffect(() => {
    getTariffByFilter()
  }, [filter])

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
      orderByList: 'tariffType',
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

  const cardFilters = [
    {
      iconType: 'import',
      status: 'Importação',
      uniqueChoice: true
    },
    {
      iconType: 'export',
      status: 'Exportação',
      uniqueChoice: true
    },
    {
      iconType: 'plane',
      status: 'Aéreo',
      uniqueChoice: true
    },
    {
      iconType: 'ship',
      status: 'Marítimo',
      uniqueChoice: true
    },
    {
      iconType: 'truck',
      status: 'Rodoviário',
      uniqueChoice: true
    },
    {
      iconType: 'warn',
      status: 'Vencimento próximo',
      uniqueChoice: true
    },
    {
      iconType: 'alert',
      status: 'Vencidas',
      uniqueChoice: true
    }
  ]

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

              >
              <FloatingMenu menuItems={floatingButtonMenuItems} />
            </Button>
            <TariffUploadModal setClose={() => setOpen(false)} open={open} type={uploadType}/>
          </ButtonContainer>
        </TopButtonContainer>
      </TopContainer>
      <MidleContainer>
        <MidleTypography>Exibir por:</MidleTypography>
        <QuickFilters
          cardFilters={cardFilters}
          onFilterClick={(selectedFilterCards) => setQuickFilterList(selectedFilterCards)}
          initialSelected={quickFilterList}
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
