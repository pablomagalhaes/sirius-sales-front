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
import { orderButtonMenuItems } from './constants'
import { I18n } from 'react-redux-i18n'
import TariffTable from './TariffTable'
import { getModalFilter, getActivityFilter, getValidityFilter } from './helpers'
import TariffUploadModal from '../../components/TariffUploadModal/TariffUploadModal'

const defaultFilter = {
  tariffModalType: '',
  validityTariff: '',
  tariffType: '',
  direction: 'ASC',
  orderByList: 'tariffType',
  page: 0,
  size: 10
}

const Tariff = (): JSX.Element => {
  const [filter, setFilter] = useState<any>(defaultFilter)
  const [businessPartnerList, setBusinessPartnerList] = useState<any[]>([])
  const [openedOrderSelect, setOpenedOrderSelect] = useState(false)
  const [orderAsc, setOrderAsc] = useState(true)
  const [orderBy, setOrderBy] = useState<string>('openingDate')
  const [originDestinationList, setOriginDestinationList] = useState<any[]>([])
  const [originDestinationCountries, setoriginDestinationCountries] = useState<any[]>([])
  const [originDestinationStates, setoriginDestinationStates] = useState<any[]>([])
  const [originDestinationCities, setoriginDestinationCities] = useState<any[]>([])
  const [partnerList, setPartnerList] = useState<any[]>([])
  const [partnerSimpleNameList, setPartnerSimpleNameList] = useState<any[]>([])
  const [currencyList, setCurrencyList] = useState<any[]>([])
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

  useEffect(() => {
    const simpleNameList: any[] = []
    const newPartnerList: any[] = []
    void (async function () {
      await API.getAgents()
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
      await API.getCountries()
        .then((response) => setoriginDestinationCountries(response))
        .catch((err) => console.log(err))
    })()
    void (async function () {
      await API.getMercosulStates()
        .then((response) => setoriginDestinationStates(response))
        .catch((err) => console.log(err))
    })()
    void (async function () {
      await API.getMercosulCities()
        .then((response) => setoriginDestinationCities(response))
        .catch((err) => console.log(err))
    })()
  }, [])

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

  useEffect(() => {
    if (filter.tariffModalType !== '') {
      if (filter.tariffModalType === 'SEA') {
        void getBusinessPartnerSea()
      } else {
        void getBusinessPartner(getBusinessPartnerType())
      }
    }
  }, [filter.tariffModalType])

  useEffect(() => {
    void (async function () {
      await API.getCurrencies()
        .then((response) => setCurrencyList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  const getBusinessPartner = async (type: string): Promise<any> => {
    const response = await API.getBusinessPartnerByType(type)
    if (response !== undefined) {
      setBusinessPartnerList([...response])
    }
  }

  const getBusinessPartnerSea = async (): Promise<any> => {
    const responseShipOwner = await API.getBusinessPartnerByType('ARMADOR')
    const responseColoader = await API.getBusinessPartnerByType('COLOADER')
    if (responseShipOwner !== undefined && responseColoader !== undefined) {
      setBusinessPartnerList([...responseColoader, ...responseShipOwner])
    }
  }

  const getBusinessPartnerType = (): string => {
    switch (filter.tariffModalType) {
      case 'AIR':
        return 'CIA. AEREA'
      case 'LAND':
        return 'TRANS. INTERNACIONAL'
    }
    return ''
  }

  const getOriginDestinyList = (land: string): string[] => {
    const actualList: string[] = []
    let type = ''

    switch (filter.tariffModalType) {
      case 'AIR':
        type = 'AEROPORTO'
        break
      case 'SEA':
        type = 'PORTO'
        break
      case 'LAND':
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
          actualList.push(`${String(item.name)}`)
        })
      }
      if (land === 'Estado') {
        originDestinationStates?.forEach((item): void => {
          actualList.push(`${String(item.txState)} (${String(item.txCountry)})`)
        })
      }
      if (land === 'Cidade') {
        originDestinationCities?.forEach((item): void => {
          actualList.push(`${String(item.txCity)} (${String(item.txCountry)})`)
        })
      }
    }
    return actualList
  }

  const getLandLabels = (): string[] => {
    let landLabels: string[] = []
    if (filter.tariffModalType === 'LAND') {
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
    const validity = getValidityFilter(quickFilterList)
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
          icon: item.closeToValidity === true ? 'error' : validity === 'EXPIRED' ? 'warn' : '',
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

    const selectedAgents = findKeyFilter(
      selectedFiltersRowFilter,
      'Agente'
    )
    if (selectedAgents !== undefined) {
      const agentIds: any = []
      selectedAgents.forEach(name => {
        const agent = partnerList.find(item => item.simpleName === name)
        agentIds.push(agent.id)
      })
      setFilter((filter: any) => ({
        ...filter,
        idBusinessPartnerAgent: [agentIds]
      }))
    }

    const selectedShippingCompany = findKeyFilter(selectedFiltersRowFilter, getCompanyLabels())
    if (selectedShippingCompany !== undefined) {
      const shippingCompanyId: any = []
      selectedShippingCompany.forEach(name => {
        const client = businessPartnerList.find(item => item.businessPartner.simpleName === name)
        shippingCompanyId.push(client.id)
      })

      setFilter((filter: any) => ({
        ...filter,
        idBusinessPartnerTransporter: [shippingCompanyId]
      }))
    }

    const selectedCurrencies = findKeyFilter(
      selectedFiltersRowFilter,
      'Moeda'
    )
    if (selectedCurrencies !== undefined) {
      setFilter((filter: any) => ({
        ...filter,
        idCurrency: [selectedCurrencies]
      }))
    }

    const selectedOriginsDestinations = findKeyFilter(
      selectedFiltersRowFilter,
      'Origem/Destino'
    )
    if (selectedOriginsDestinations !== undefined) {
      const modal: string = filter.tariffModalType
      if (modal.length > 0 && modal !== 'LAND') {
        const idOrigin = selectedOriginsDestinations.pickerSelecteds1
          .map((name: string) => name.split(' - ')[0])
        const idDestination = selectedOriginsDestinations.pickerSelecteds2
          .map((name: string) => name.split(' - ')[0])

        if (idOrigin.length > 0 && idOrigin[0] !== undefined) {
          setFilter((filter: any) => ({
            ...filter,
            idOrigin
          }))
        }
        if (idDestination.length > 0 && idDestination[0] !== undefined) {
          setFilter((filter: any) => ({
            ...filter,
            idDestination
          }))
        }
      }

      if (modal.length > 0 && modal === 'LAND') {
        const originCountry = selectedOriginsDestinations.pickerSelecteds1
          .map((locationFiltered: string) => originDestinationCountries
            .find((country) => country.name === locationFiltered)?.id)
          .map((id: string) => Number(id))

        const destinationCountry = selectedOriginsDestinations.pickerSelecteds2
          .map((locationFiltered: string) => originDestinationCountries
            .find((country) => country.name === locationFiltered)?.id)
          .map((id: string) => Number(id))

        const originState = selectedOriginsDestinations.pickerSelecteds3
          .map((locationFiltered: string) => originDestinationStates
            .find((state) => state.txState === locationFiltered.split(' (')[0] && state.txCountry === locationFiltered.split(' (')[1].slice(0, -1))?.idState)

        const destinationState = selectedOriginsDestinations.pickerSelecteds4
          .map((locationFiltered: string) => originDestinationStates
            .find((state) => state.txState === locationFiltered.split(' (')[0] && state.txCountry === locationFiltered.split(' (')[1].slice(0, -1))?.idState)

        const originCity = selectedOriginsDestinations.pickerSelecteds5
          .map((locationFiltered: string) => originDestinationCities
            .find((city) => city.txCity === locationFiltered.split(' (')[0] && city.txCountry === locationFiltered.split(' (')[1].slice(0, -1))?.idCity)

        const destinationCity = selectedOriginsDestinations.pickerSelecteds6
          .map((locationFiltered: string) => originDestinationCities
            .find((city) => city.txCity === locationFiltered.split(' (')[0] && city.txCountry === locationFiltered.split(' (')[1].slice(0, -1))?.idCity)

        console.log(originDestinationCountries)

        if (originCountry.length > 0 && originCountry[0] !== undefined) {
          setFilter((filter: any) => ({
            ...filter,
            originCountry
          }))
        }
        if (destinationCountry.length > 0 && destinationCountry[0] !== undefined) {
          setFilter((filter: any) => ({
            ...filter,
            destinationCountry
          }))
        }
        if (originState.length > 0 && originState[0] !== undefined) {
          setFilter((filter: any) => ({
            ...filter,
            originState
          }))
        }
        if (destinationState.length > 0 && destinationState[0] !== undefined) {
          setFilter((filter: any) => ({
            ...filter,
            destinationState
          }))
        }
        if (originCity.length > 0 && originCity[0] !== undefined) {
          setFilter((filter: any) => ({
            ...filter,
            originCity
          }))
        }
        if (destinationCity.length > 0 && destinationCity[0] !== undefined) {
          setFilter((filter: any) => ({
            ...filter,
            destinationCity
          }))
        }
      }
    }

    const selectedTransitTime = findKeyFilter(
      selectedFiltersRowFilter,
      'Transit Time'
    )
    if (selectedTransitTime !== undefined) {
      setFilter((filter: any) => ({
        ...filter,
        transitTime: selectedTransitTime
      }))
    }

    const selectedFrequencies = findKeyFilter(
      selectedFiltersRowFilter,
      'Frequência'
    )

    if (selectedFrequencies !== undefined) {
      const frequencyIds: number[] = []
      selectedFrequencies.forEach((selectedFrequency) => {
        switch (selectedFrequency) {
          case 'DIÁRIO':
            frequencyIds.push(1)
            break
          case 'SEMANAL':
            frequencyIds.push(2)
            break
          case 'QUINZENAL':
            frequencyIds.push(3)
            break
          case 'MENSAL':
            frequencyIds.push(4)
            break
          default:
            break
        }
      })
      setFilter((filter: any) => ({
        ...filter,
        idFrequency: [frequencyIds]
      }))
    }

    // const selectedDates = findKeyFilter(selectedFiltersRowFilter, 'Validade')
    // if (selectedDates !== undefined) {
    //   const type = selectedFiltersRowFilter[6].checkBoxSelecteds
    //   const size = selectedDates.length

    //   if (type[0] === 'Dt. Abertura') {
    //     const openedDates = selectedDates[size - 1].split(' - ')

    //     const [openedDayBegin, openedMonthBegin, openedYearBegin] =
    //       openedDates[0].split('/')
    //     const [openedDayEnd, openedMonthEnd, openedYearEnd] =
    //       openedDates[1].split('/')

    //     const openedDtBeginFormated = `${String(openedYearBegin)}/${String(
    //       openedMonthBegin
    //     )}/${String(openedDayBegin)}`
    //     const openedDtEndFormated = `${String(openedYearEnd)}/${String(
    //       openedMonthEnd
    //     )}/${String(openedDayEnd)}`

    //     setFilter((filter: any) => ({
    //       ...filter,
    //       'openingDate.dtBegin': openedDtBeginFormated,
    //       'openingDate.dtEnd': openedDtEndFormated
    //     }))
    //   }

    //   if (type[0] === 'Dt. Validade' || type[1] === 'Dt. Validade') {
    //     const validateDates = selectedDates[size - 1].split(' - ')

    //     const [validateDayBegin, validateMonthBegin, validateYearBegin] =
    //       validateDates[0].split('/')
    //     const [validateDayEnd, validateMonthEnd, validateYearEnd] =
    //       validateDates[1].split('/')

    //     const validateDtBeginFormated = `${String(validateYearBegin)}/${String(
    //       validateMonthBegin
    //     )}/${String(validateDayBegin)}`
    //     const validateDtEndFormated = `${String(validateYearEnd)}/${String(
    //       validateMonthEnd
    //     )}/${String(validateDayEnd)}`

    //     setFilter((filter: any) => ({
    //       ...filter,
    //       'validityDate.dtBegin': validateDtBeginFormated,
    //       'validityDate.dtEnd': validateDtEndFormated
    //     }))
    //   }
    // }
    const selectedEspecifications = findKeyFilter(
      selectedFiltersRowFilter,
      'Especificação'
    )
    if (selectedEspecifications !== undefined) {
      setFilter((filter: any) => ({
        ...filter,
        txChargeType: [selectedEspecifications]
      }))
    }
  }

  const findKeyFilter = (filterSelected: any, key: string): any => {
    for (const item of filterSelected) {
      if (item.filterName === key) {
        if (key === 'Origem/Destino') {
          return {
            pickerSelecteds1: item.pickerSelecteds1,
            pickerSelecteds2: item.pickerSelecteds2,
            pickerSelecteds3: item.pickerSelecteds3,
            pickerSelecteds4: item.pickerSelecteds4,
            pickerSelecteds5: item.pickerSelecteds5,
            pickerSelecteds6: item.pickerSelecteds6,
            radioButtonSelected: item.radioButtonSelected
          }
        }
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
    delete filter.idBusinessPartnerAgent
    delete filter.idBusinessPartnerTransporter
    delete filter.idCurrency
    delete filter.idOrigin
    delete filter.idDestination
    delete filter.originCountry
    delete filter.destinationCountry
    delete filter.originState
    delete filter.destinationState
    delete filter.originCity
    delete filter.destinationCity
    delete filter.transitTime
    delete filter.idFrequency
    delete filter.txChargeType
    delete filter['openingDate.dtBegin']
    delete filter['openingDate.dtEnd']
    delete filter['validityDate.dtBegin']
    delete filter['validityDate.dtEnd']

    setFilter((filter: any) => ({
      ...filter,
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

  const getCompanyLabels = (): string => {
    let label: string = 'Cia. Aérea'
    switch (filter.tariffModalType) {
      case 'AIR':
        label = 'Cia. Aérea'
        break
      case 'SEA':
        label = 'Armador/Coloader'
        break
      case 'LAND':
        label = 'Transportadora'
        break
      default:
        break
    }
    return label
  }

  const menuItemsSelector = [
    {
      label: getCompanyLabels(),
      pickerListOptions1: businessPartnerList.map(
        (item) => item.businessPartner.simpleName
      ),
      pickerLabel1: getCompanyLabels(),
      pickerLandLabels: []
    },
    {
      label: 'Origem/Destino',
      pickerListOptions1: getOriginDestinyList('País'),
      pickerListOptions2: getOriginDestinyList('Estado'),
      pickerListOptions3: getOriginDestinyList('Cidade'),
      pickerLabel1: 'Origem',
      pickerLabel2: 'Destino',
      pickerLandLabels: getLandLabels()

    },
    {
      label: 'Moeda',
      pickerListOptions1: currencyList.map((option) => option.id),
      pickerLabel1: 'Moeda',
      pickerLandLabels: []
    },
    {
      label: 'Transit Time',
      textField: 'Transit Time'
    },
    {
      label: 'Frequência',
      pickerListOptions1: ['DIÁRIO', 'SEMANAL', 'QUINZENAL', 'MENSAL'],
      pickerLabel1: 'Frequência',
      pickerLandLabels: []
    }
    // {
    //   label: 'Validade',
    //   checkboxList: ['Dt. Validade'],
    //   hasDatePicker: true,
    //   dateRanges: menuItems.dateRanges
    // }
  ]

  const specification = {
    label: 'Especificação',
    pickerListOptions1: ['FCL', 'LCL', 'Break Bulk', 'Ro-Ro'],
    pickerLabel1: 'Especificação',
    pickerLandLabels: []
  }

  const agent = {
    label: 'Agente',
    pickerListOptions1: partnerSimpleNameList,
    pickerLabel1: 'Agente',
    pickerLandLabels: []
  }

  const createMenuItems = (): any => {
    if (filter.tariffModalType === 'SEA' && filter.tariffType === 'IMPORT') return [agent, ...menuItemsSelector, specification]
    else if (filter.tariffType === 'IMPORT') return [agent, ...menuItemsSelector]
    else if (filter.tariffModalType === 'SEA' && filter.tariffType === 'EXPORT') return [...menuItemsSelector, specification]
    else return [...menuItemsSelector]
  }

  const handleChangeModal = (
    handleCleanAll: () => void,
    handleCleanButton: () => void,
    handlePickerChange1: (e: any, newValue: string[]) => void,
    handlePickerChange2: (e: any, newValue: string[]) => void,
    handlePickerChange3: (e: any, newValue: string[]) => void,
    handlePickerChange4: (e: any, newValue: string[]) => void,
    handlePickerChange5: (e: any, newValue: string[]) => void,
    handlePickerChange6: (e: any, newValue: string[]) => void
  ): void => {
    if (radioValue !== '') {
      handleCleanAll()
      handleCleanButton()
      handlePickerChange1(null, [])
      handlePickerChange2(null, [])
      handlePickerChange3(null, [])
      handlePickerChange4(null, [])
      handlePickerChange5(null, [])
      handlePickerChange6(null, [])
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
          menuItemsSelector={createMenuItems()}
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
