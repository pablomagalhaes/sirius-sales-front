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
import { getModalFilter, getActivityFilter, getValidityFilter } from './helpers'
import TariffUploadModal from '../../components/TariffUploadModal/TariffUploadModal'
import { SelectorsValuesTypes } from '../../../application/enum/tariffEnum'
import { OrderTypes } from '../../../application/enum/enum'
import useTariffs from '../../hooks/tariff/useTariffs'
import Filter from './components/filter'
import { TariffContext, filterDefault } from './context/TariffContext'

const Tariff = (): JSX.Element => {
  const { data: tariffList = [], changeFilterList } = useTariffs()
  const { filter, setFilter }: any = useContext(TariffContext)

  const [orderAsc, setOrderAsc] = useState(true)
  const [orderBy, setOrderBy] = useState<string>(SelectorsValuesTypes.Validity)
  const [quickFilterList, setQuickFilterList] = useState<any[]>([
    { type: 'activity', status: I18n.t('pages.tariff.upload.import') },
    { type: 'modal', status: I18n.t('pages.tariff.modals.air') }
  ])
  const [tabs, setTabs] = useState<any[]>()
  const [countryExpanded, setCountryExpanded] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [uploadType, setUploadType] = useState('')

  const history = useHistory()

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

  const cleanFilter = (): void => {
    const tariffModalType = getModalFilter(quickFilterList)
    const tariffType = getActivityFilter(quickFilterList)
    const validityTariff = getValidityFilter(quickFilterList)

    changeFilterList(tariffType, tariffModalType, validityTariff)

    setFilter(() => ({
      ...filterDefault,
      tariffModalType,
      validityTariff,
      tariffType
    }))
  }

  useEffect(() => {
    createTabs()
  }, [tariffList, countryExpanded, filter])

  useEffect(() => {
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

  const handleExportTariff = (): void => {}

  const cardFilters = [
    {
      iconType: 'import',
      status: I18n.t('pages.tariff.constants.cardFilters.import'),
      uniqueChoice: true
    },
    {
      iconType: 'export',
      status: I18n.t('pages.tariff.constants.cardFilters.export'),
      uniqueChoice: true
    },
    {
      iconType: 'plane',
      status: I18n.t('pages.tariff.constants.cardFilters.air'),
      uniqueChoice: true
    },
    {
      iconType: 'ship',
      status: I18n.t('pages.tariff.constants.cardFilters.sea'),
      uniqueChoice: true
    },
    {
      iconType: 'truck',
      status: I18n.t('pages.tariff.constants.cardFilters.land'),
      uniqueChoice: true
    },
    {
      iconType: 'warn',
      status: I18n.t('pages.tariff.constants.cardFilters.closeToValidity'),
      uniqueChoice: true
    },
    {
      iconType: 'alert',
      status: I18n.t('pages.tariff.constants.cardFilters.overdue'),
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
            {I18n.t('pages.tariff.mainPage.home')}
          </Link>
          <span className="breadcrumbEnd">{I18n.t('pages.tariff.mainPage.tariff')}</span>
        </Breadcrumbs>
        <TopButtonContainer>
          <GridButton>
            <RowButton>
              <ColButton>
                <Link
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
          <ExportTariffContainer onClick={handleExportTariff}>
            <ExitToApp />
            <ExportListSpan>{I18n.t('pages.tariff.mainPage.export')}</ExportListSpan>
          </ExportTariffContainer>
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
