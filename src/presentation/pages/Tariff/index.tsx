import React, { useEffect, useState, useContext } from 'react'
import {
  Accordion,
  Button,
  FloatingMenu,
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
  MidleTypography,
  GridButton,
  RowButton,
  ColButton
} from './style'
import { ExitToApp } from '@material-ui/icons/'
import { useHistory } from 'react-router-dom'
import UpArrow from '../../../application/icons/UpArrow'
import ArrowDown from '../../../application/icons/ArrowDown'
import { orderButtonMenuItems } from './constants'
import { I18n } from 'react-redux-i18n'
import TariffTable from './components/TariffTable'
import { getModalFilter, getActivityFilter, getValidityFilter , orderCsv } from './helpers'
import TariffUploadModal from './components/TariffUploadModal/TariffUploadModal'
import TariffExportModal from './components/TariffExportModal/TariffExportModal'
import { SelectorsValuesTypes, QuickFilterTypes, ValidityTypes } from '../../../application/enum/tariffEnum'
import { OrderTypes, IconTypes } from '../../../application/enum/enum'
import useTariffs from '../../hooks/tariff/useTariffs'
import Filter from './components/filter'
import { TariffContext, filterDefault } from './context/TariffContext'
import API from '../../../infrastructure/api'

import {
  TARIFF_MAINPAGE_SPAN_TARIFF,
  TARIFF_MAINPAGE_LINK_HOME,
  TARIFF_MAINPAGE_LINK_TARIFFPROCESSING,
  TARIFF_BUTTON_UPLOAD
} from '../../../ids'

const Tariff = (): JSX.Element => {
  const { data: tariffList = [], changeFilterList, refetch } = useTariffs()
  const { filter, setFilter }: any = useContext(TariffContext)

  const [orderAsc, setOrderAsc] = useState(true)
  const [orderBy, setOrderBy] = useState<string>(SelectorsValuesTypes.Validity)
  const [quickFilterList, setQuickFilterList] = useState<any[]>([
    { type: QuickFilterTypes.Activity, status: I18n.t('pages.tariff.upload.import') },
    { type: QuickFilterTypes.Modal, status: I18n.t('pages.tariff.modals.air') }
  ])
  const [tabs, setTabs] = useState<any[]>()
  const [tabSelection, setTabSelection] = useState<string>('')
  const [countryExpanded, setCountryExpanded] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [openExport, setOpenExport] = useState(false)
  const [uploadType, setUploadType] = useState('')
  const [exportData, setExportData] = useState<any>([])

  const history = useHistory()

  const floatingButtonMenuItems = [
    {
      iconType: IconTypes.Import,
      label: I18n.t('pages.tariff.upload.import'),
      onClick: () => { setUploadType(I18n.t('pages.tariff.upload.import')); setOpen(true) }
    }, {
      iconType: IconTypes.Export,
      label: I18n.t('pages.tariff.upload.export'),
      onClick: () => { setUploadType(I18n.t('pages.tariff.upload.export')); setOpen(true) }
    }
  ]

  useEffect(() => {
    const collection = document.getElementsByClassName('MuiTab-wrapper')
    for (let i = 0; i < collection.length; i++) {
      const tabText = collection[i].firstElementChild.textContent
      collection[i].addEventListener('click', () => setTabSelection(tabText))
      collection[i].firstElementChild.addEventListener('click', () => setTabSelection(tabText))
    }
  }, [tabs])

  useEffect(() => {
    if (tariffList.length > 0) setTabSelection(tariffList[0].region)
  }, [tariffList])

  const createTabs = async (): Promise<void> => {
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
            countriesRefetch={refetch}
          />,
          disable: false,
          onChange: (country: string, expanded: boolean): void => { setCountryExpanded(country) },
          expanded: countryExpanded === country
        }))
        regionsTabs.push({
          title: item.region,
          icon: item.closeToValidity === true ? IconTypes.Error : validity === ValidityTypes.Expired ? IconTypes.Warn : '',
          component: <Accordion content={content} />
        })
      })
    }
    setTabs(regionsTabs)
  }

  const cleanFilter = (): void => {
    const tariffModalType = getModalFilter(quickFilterList)
    const tariffType = getActivityFilter(quickFilterList)
    const validityTariff = getValidityFilter(quickFilterList)

    setFilter(() => ({
      ...filterDefault,
      tariffModalType,
      validityTariff,
      tariffType
    }))
  }

  useEffect(() => {
    if (!open) createTabs()
  }, [tariffList, countryExpanded, filter, open])

  useEffect(() => {
    refetch()
    cleanFilter()
    setCountryExpanded('')
  }, [quickFilterList])

  const handleOrderDirection = (): string => {
    if (orderAsc) {
      return OrderTypes.Ascendent
    }
    return OrderTypes.Descendent
  }

  useEffect(() => {
    setFilter((filter: any) => ({ ...filter, orderByList: `${orderBy},${handleOrderDirection()}` }))
  }, [orderAsc, orderBy])

  useEffect(() => {
    setOrderBy(SelectorsValuesTypes.Validity)
  }, [filter.tariffModalType])

  useEffect(() => {
    const newFilter = { ...filter, page: 0 }
    changeFilterList(newFilter)
  }, [filter])

  const cardFilters = [
    {
      iconType: IconTypes.Import,
      status: I18n.t('pages.tariff.constants.cardFilters.import'),
      uniqueChoice: true
    },
    {
      iconType: IconTypes.Export,
      status: I18n.t('pages.tariff.constants.cardFilters.export'),
      uniqueChoice: true
    },
    {
      iconType: IconTypes.Plane,
      status: I18n.t('pages.tariff.constants.cardFilters.air'),
      uniqueChoice: true
    },
    {
      iconType: IconTypes.Ship,
      status: I18n.t('pages.tariff.constants.cardFilters.sea'),
      uniqueChoice: true
    },
    {
      iconType: IconTypes.Truck,
      status: I18n.t('pages.tariff.constants.cardFilters.land'),
      uniqueChoice: true
    },
    {
      iconType: IconTypes.Warn,
      status: I18n.t('pages.tariff.constants.cardFilters.closeToValidity'),
      uniqueChoice: true
    },
    {
      iconType: IconTypes.Alert,
      status: I18n.t('pages.tariff.constants.cardFilters.overdue'),
      uniqueChoice: true
    }
  ]

  const handleExport = async (): Promise<void> => {
    const region = String(tabSelection).replace(/ /g,'')
    const countriesToExport = tariffList.find((each: any) => each.region === region)?.countries
    let tariffsToExport = []
    await Promise.all(countriesToExport?.map(async (country: string) => {
      const payload = { ...filter, txRegion: region, txCountry: country }
      await API.getTariffsByCountry(payload)
        .then((response) => {
          tariffsToExport = [...tariffsToExport, ...response.content]
        })
        .catch((err) => console.log(err))
    }))
    const exportByAgent = {}
    tariffsToExport.forEach((tariff: any) => {
      !exportByAgent[tariff.nmAgent]
        ? exportByAgent[tariff.nmAgent] = [orderCsv(tariff)]
        : exportByAgent[tariff.nmAgent].push(orderCsv(tariff))
    })
    setExportData(exportByAgent)
  }

  const createExportPath = (): string => {
    return `${String(quickFilterList.find((filter) => filter?.type === QuickFilterTypes.Activity)?.status)} > 
    ${String(quickFilterList.find((filter) => filter?.type === QuickFilterTypes.Modal)?.status)} > ${String(tabSelection)}`
  }

  return (
    <RootContainer>
      <TopContainer>
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <Link
            id={TARIFF_MAINPAGE_LINK_HOME}
            color="inherit"
            onClick={() => history.push('/')}
            className="breadcrumbInitial"
            style={{ cursor: 'pointer' }}
          >
            {I18n.t('pages.tariff.mainPage.home')}
          </Link>
          <span className="breadcrumbEnd" id={TARIFF_MAINPAGE_SPAN_TARIFF}>{I18n.t('pages.tariff.mainPage.tariff')}</span>
        </Breadcrumbs>
        <TopButtonContainer>
          <GridButton>
            <RowButton>
              <ColButton>
                <Link
                  id={TARIFF_MAINPAGE_LINK_TARIFFPROCESSING}
                  color="inherit"
                  onClick={() => history.push('/tarifario-processamentos')}
                  className="breadcrumbInitial"
                  style={{ cursor: 'pointer', textAlign: 'left', color: '#087a7a' }}
                >
                  Ver todos os processamentos
                </Link>
              </ColButton>
              <ColButton>
              <ButtonContainer>
                <Button
                  id={TARIFF_BUTTON_UPLOAD}
                  disabled={false}
                  text={I18n.t('pages.tariff.upload.mainLabel')}
                  tooltip={I18n.t('pages.tariff.upload.mainLabel')}
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
              </ColButton>
            </RowButton>
          </GridButton>
        </TopButtonContainer>
      </TopContainer>
      <MidleContainer>
        <MidleTypography>{I18n.t('pages.tariff.mainPage.display')}</MidleTypography>
        <QuickFilters
          cardFilters={cardFilters}
          onFilterClick={(selectedFilterCards) => setQuickFilterList(selectedFilterCards)}
          initialSelected={quickFilterList}
        />
      </MidleContainer>
      <ListHeaderContainer>
        <LeftSideListHeaderContainer>
          <Filter
            cleanFilter={cleanFilter}
          />
        </LeftSideListHeaderContainer>
        <RightSideListHeaderContainer>
          <ExportTariffContainer onClick={() => { setOpenExport(true); handleExport() }}>
            <ExitToApp />
            <ExportListSpan>{I18n.t('pages.tariff.mainPage.export')}</ExportListSpan>
          </ExportTariffContainer>
          <TariffExportModal setClose={() => setOpenExport(false)} open={openExport} createExportPath={createExportPath} exportData={exportData}/>
          <OrderByContainer>
            <ListTextSpan>{I18n.t('pages.tariff.mainPage.orderBy')}:</ListTextSpan>
            <DropdownMenuContainer>
              <Select
                className="select-style"
                disableUnderline
                onChange={(e) => setOrderBy(String(e.target.value))}
                placeholder={orderBy}
                value={orderBy}
              >
                {orderButtonMenuItems(filter.tariffModalType).map((item) => (
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
              onClick={() => setOrderAsc((order) => !order)}
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
