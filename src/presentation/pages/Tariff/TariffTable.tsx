import React, { useState, useEffect } from 'react'

import { Table, TableBody, TableContainer, TableHead, TableRow, Button, Popover } from '@material-ui/core'
import { Pagination, ListSwitcher, MenuIconCell, FloatingMenu, ControlledToolTip } from 'fiorde-fe-components'
import { PaginationContainer, PaginationMainContainer, MainTariffContainer, TableCell, IconDisplay, RedColorSpan } from './style'
import AirTariffModal from '../../components/AirTariffModal/AirTariffModal'
import SeaFclTariffModal from '../../components/SeaFclTariffModal/SeaFclTariffModal'
import SeaLclTariffModal from '../../components/SeaLclTariffModal/SeaLclTariffModal'
import LandTariffModal from '../../components/LandTariffModal/LandTariffModal'
import WarnIconClicked from '../../../application/icons/WarnClicked'
import AlertClickedIcon from '../../../application/icons/AlertClicked'
import moment from 'moment'
import { I18n } from 'react-redux-i18n'
import useTariffsByCountry from '../../hooks/useTariffsByCountry'

import { convertToDecimal } from './helpers'

export interface TariffTableProps {
  expanded: boolean
  country: string
  region: string
  filter: any
  setFilter: Function
}

const TariffTable = ({
  expanded,
  country,
  region,
  filter,
  setFilter
}: TariffTableProps): JSX.Element => {
  const { content: tariffData, totalElements: totalTariffList, setParams } = useTariffsByCountry()
  const [seaType, setSeaType] = useState<string>('FCL')
  const [state, setState] = useState({ anchorEl: null, currentKey: null })
  const [openModal, setOpenModal] = useState<boolean>(false)

  const handleClick = (event: any, key: any): void => {
    setState({ anchorEl: event.currentTarget, currentKey: key })
  }

  const handleClose = (): void => {
    setOpenModal(false)
    setState({ anchorEl: null, currentKey: null })
  }

  const { anchorEl, currentKey } = state
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const renderModal = (index: number | null): JSX.Element => {
    if (filter.tariffModalType !== '' && tariffData !== undefined && index !== null) {
      switch (filter.tariffModalType) {
        case 'AIR':
          return <AirTariffModal
                    dataProp={tariffData[index]}
                    open={openModal}
                    setClose={handleClose}
                  />
        case 'SEA':
          if (seaType === 'FCL') {
            return <SeaFclTariffModal
                    dataProp={tariffData[index]}
                    open={openModal}
                    setClose={handleClose}
                  />
          } else {
            return <SeaLclTariffModal
                    dataProp={tariffData[index]}
                    open={openModal}
                    setClose={handleClose}
                  />
          }
        case 'LAND':
          return <LandTariffModal
                    dataProp={tariffData[index]}
                    open={openModal}
                    setClose={handleClose}
                  />
        default:
          break
      }
    }
    return <></>
  }

  const getTariffItems = (tariffList: any): string[] => {
    const array: any = []
    for (const tariff of tariffList) {
      const id = tariff.idTariff
      const modal = filter.tariffModalType
      const agent = tariff.nmAgent
      const company = tariff.dsBusinessPartnerTransporter
      const transitTime = tariff.transitTime
      const currency = tariff.currency
      const originDestiny = modal === 'LAND' ? `${String(tariff.cityOrigin)} > ${String(tariff.cityDestination)}` : `${String(tariff.origin)} > ${String(tariff.destination)}`
      const validity = new Date(tariff.validityDate).toLocaleDateString('pt-BR')
      const values = [...tariff.tariffTypeValues].filter(each => each.tariffType.description !== 'MINIMUN').map(item => item.value)
      const value = `de ${convertToDecimal(Math.min(...values))} a ${convertToDecimal(Math.max(...values))}`
      const getTariffTypeValue = (type: string): string => {
        const res = tariff.tariffTypeValues.find(each => each.tariffType.description === type)
        if (res !== undefined) return convertToDecimal(res.value)
        return ''
      }
      const geralImoDed = `${getTariffTypeValue('VLGERALDED')} / ${getTariffTypeValue('VLIMODED')}`
      const geralImoCons = `${getTariffTypeValue('VLGERALCONS')} / ${getTariffTypeValue('VLIMOCONS')}`
      const minimun = getTariffTypeValue('MINIMUN')
      const under7w = getTariffTypeValue('VLATE7WM')
      const over = getTariffTypeValue('ACIMA')
      const container20 = getTariffTypeValue('VLCONTAINER20')
      const container40 = getTariffTypeValue('VLCONTAINER40')

      let item: any
      if (modal !== '') {
        switch (modal) {
          case 'AIR':
            item = { id, agent, airCompany: company, originDestiny, transitTime, validity, currency, minimun, value }
            break
          case 'SEA':
            if (seaType === 'LCL') item = { id, agent, seaCompany: company, originDestiny, transitTime, validity, currency, minimun, under7w, over }
            if (seaType === 'FCL') item = { id, agent, seaCompany: company, originDestiny, transitTime, validity, currency, container20, container40 }
            break
          case 'LAND':
            item = { id, agent, landCompany: company, originDestiny, transitTime, validity, currency, geralImoDed, geralImoCons }
            break
          default:
            break
        }
      }
      if (item !== undefined) array.push(item)
    }
    return array
  }
  const validityDisplay = (validity: string): JSX.Element => {
    const today = moment().startOf('day')
    const date = moment(validity, 'DD/MM/YYYY')
    const timeDiff = date.diff(today, 'days')
    if (timeDiff < 0) {
      return (
      <IconDisplay>
        <ControlledToolTip
          placement="top"
          title={I18n.t('pages.tariff.tariffTable.overdue')}
          open={true}
          disabled={true}
          getTitle={false}
        >
          <div className='icon'><AlertClickedIcon/></div>
        </ControlledToolTip>
        <RedColorSpan>{validity}</RedColorSpan>
      </IconDisplay>
      )
    } else if (timeDiff <= 7) {
      return (
      <IconDisplay>
        <ControlledToolTip
          placement="top"
          title={`${String(I18n.t('pages.tariff.tariffTable.validUntil'))} ${timeDiff} ${String(I18n.t('pages.tariff.tariffTable.days'))}`}
          open={true}
          disabled={true}
          getTitle={false}
        >
          <div className='icon'><WarnIconClicked/></div>
        </ControlledToolTip>
        {validity}
      </IconDisplay>
      )
    }
    return <>{validity}</>
  }

  useEffect(() => {
    if (expanded && !openModal) {
      const modal = filter.tariffModalType
      let payload = { ...filter, txRegion: region, txCountry: country }
      if (modal !== '' && modal === 'SEA') payload = { ...filter, txRegion: region, txCountry: country, txChargeType: seaType }
      setParams(payload)
    }
  }, [expanded, filter, seaType, openModal])

  if (tariffData.length > 0) {
    return (
    <MainTariffContainer>
      {filter.tariffModalType === 'SEA' &&
        <div>
          <ListSwitcher
            firstLabel={I18n.t('pages.tariff.modals.seaTypes.fcl')}
            secondLabel={I18n.t('pages.tariff.modals.seaTypes.lcl')}
            onChange={(value: string) => setSeaType(value)}
          />
        </div>
      }
      <TableContainer>
        <Table >
          <TableHead>
            <TableRow>
              {filter.tariffModalType === 'SEA'
                ? Object.values(I18n.t(`pages.tariff.tariffTable.columns.SEA.${seaType}`))
                  .map((column: string) => <TableCell key={column}>{column}</TableCell>)
                : Object.values(I18n.t(`pages.tariff.tariffTable.columns.${String(filter.tariffModalType)}`))
                  .map((column: string) => <TableCell key={column}>{column}</TableCell>)
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {getTariffItems(tariffData).map((row, index) => (
              <TableRow
                key={index}
              >
                {filter.tariffModalType === 'SEA'
                  ? Object.keys(I18n.t(`pages.tariff.tariffTable.columns.SEA.${seaType}`)).map((each: string) =>
                    <TableCell key={each} align="left">
                      {each === 'validity' ? validityDisplay(row[each]) : row[each] }
                    </TableCell>)
                  : Object.keys(I18n.t(`pages.tariff.tariffTable.columns.${String(filter.tariffModalType)}`)).map((each: string) =>
                    <TableCell key={each} align="left">
                      {each === 'validity' ? validityDisplay(row[each]) : row[each] }
                    </TableCell>)
                }
                <TableCell>
                  <div>
                      <Button onClick={(e) => handleClick(e, index)}>
                          <MenuIconCell />
                      </Button>
                      <Popover
                          id={id}
                          open={open && index === currentKey}
                          anchorEl={anchorEl}
                          onClose={handleClose}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center'
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center'
                          }}
                      >
                          <FloatingMenu
                            menuItems={[{
                              iconType: 'pricing',
                              label: I18n.t('pages.tariff.tariffTable.edit'),
                              onClick: () => setOpenModal(true)
                            }]}
                          />
                      </Popover>
                      {renderModal(state.currentKey)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationContainer>
        <PaginationMainContainer>
          <Pagination
            count={totalTariffList}
            labelDisplay={I18n.t('components.Pagination.labelDisplay')}
            labelDisplayedRows={I18n.t('components.Pagination.labelDisplayedRows')}
            labelRowsPerPage={I18n.t('components.Pagination.labelRowsPerPage')}
            onPageChange={(value) =>
              setFilter((filter: any) => ({ ...filter, page: value }))
            }
            onRowsPerPageChange={(value) =>
              setFilter((filter: any) => ({
                ...filter,
                size: value,
                page: 0
              }))
            }
            tooltipBack={I18n.t('components.Pagination.tooltipBack')}
            tooltipFirst={I18n.t('components.Pagination.tooltipFirst')}
            tooltipLast={I18n.t('components.Pagination.tooltipLast')}
            tooltipNext={I18n.t('components.Pagination.tooltipNext')}
            reducedPagination={true}
          />
        </PaginationMainContainer>
      </PaginationContainer>
    </MainTariffContainer>

    )
  } else {
    return (
    <MainTariffContainer>
      {filter.tariffModalType === 'SEA' &&
        <div>
          <ListSwitcher
            firstLabel={I18n.t('pages.tariff.modals.seaTypes.fcl')}
            secondLabel={I18n.t('pages.tariff.modals.seaTypes.lcl')}
            onChange={(value: string) => setSeaType(value)}
          />
        </div>
      }
    </MainTariffContainer>
    )
  }
}

export default TariffTable
