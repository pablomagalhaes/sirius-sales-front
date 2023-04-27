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

import { columns, rows } from './constants'
import { convertToDecimal } from './helpers'
import API from '../../../infrastructure/api'

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
  const [data, setData] = useState<any[]>()
  const [seaType, setSeaType] = useState<string>('FCL')
  const [totalTariffList, setTotalTariffList] = useState<number>(0)
  const [tariffData, setTariffData] = useState<any[]>()
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

  const getTariffItems = (tariffList): string[] => {
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
    const breakDate = validity.split('/')
    const today = new Date()
    const date = new Date(parseInt(breakDate[2]), parseInt(breakDate[1]), parseInt(breakDate[0]))
    const timeDiff = date.getTime() - today.getTime()
    const timeAbsolute = Math.abs(timeDiff)
    const diffDays = Math.ceil(timeAbsolute / (1000 * 3600 * 24))
    if (timeDiff < 0) {
      return (
      <IconDisplay>
        <ControlledToolTip
          placement="top"
          title="Vencido"
          open={true}
          disabled={true}
          getTitle={false}
        >
          <div className='icon'><AlertClickedIcon/></div>
        </ControlledToolTip>
        <RedColorSpan>{validity}</RedColorSpan>
      </IconDisplay>
      )
    }
    if (diffDays <= 7) {
      return (
      <IconDisplay>
        <ControlledToolTip
          placement="top"
          title={`Vencimento em ${diffDays} dias`}
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
      void (async function () {
        const modal = filter.tariffModalType
        let payload = { ...filter, txRegion: region, txCountry: country }
        if (modal !== '' && modal === 'SEA') payload = { ...filter, txRegion: region, txCountry: country, txChargeType: seaType }
        await API.getTariffsByCountry(payload)
          .then((response) => {
            const tariffs = getTariffItems(response.content)
            if (tariffs.length > 0) {
              setData(tariffs)
              setTariffData(response.content)
            } else {
              setData([])
              setTariffData([])
            }
            setTotalTariffList(response.totalElements)
          })
          .catch((err) => console.log(err))
      })()
    }
  }, [expanded, filter, seaType, openModal])

  if (data !== undefined && data.length > 0) {
    return (
    <MainTariffContainer>
      {filter.tariffModalType === 'SEA' &&
        <div>
          <ListSwitcher
            firstLabel='FCL'
            secondLabel='LCL'
            onChange={(value: string) => setSeaType(value)}
          />
        </div>
      }
      <TableContainer>
        <Table >
          <TableHead>
            <TableRow>
              {filter.tariffModalType === 'SEA'
                ? columns[filter.tariffModalType][seaType].map((column: string) => <TableCell key={column}>{column}</TableCell>)
                : columns[filter.tariffModalType].map((column: string) => <TableCell key={column}>{column}</TableCell>)
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={index}
              >
                {filter.tariffModalType === 'SEA'
                  ? rows[filter.tariffModalType][seaType].map((each: string) =>
                    <TableCell key={each} align="left">
                      {each === 'validity' ? validityDisplay(row[each]) : row[each] }
                    </TableCell>)
                  : rows[filter.tariffModalType].map((each: string) =>
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
                              label: 'Ver detalhes ou editar tarifa',
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
            labelDisplay="exibindo"
            labelDisplayedRows="de"
            labelRowsPerPage="Propostas por página"
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
            tooltipBack="Anterior"
            tooltipFirst="Primeira"
            tooltipLast="Última"
            tooltipNext="Próxima"
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
            firstLabel='FCL'
            secondLabel='LCL'
            onChange={(value: string) => setSeaType(value)}
          />
        </div>
      }
    </MainTariffContainer>
    )
  }
}

export default TariffTable
