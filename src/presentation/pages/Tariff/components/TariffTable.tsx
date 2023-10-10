import React, { useState, useEffect, useContext } from 'react'

import { Table, TableBody, TableContainer, TableHead, TableRow, Button, Popover } from '@material-ui/core'
import { Pagination, ListSwitcher, MenuIconCell, FloatingMenu } from 'fiorde-fe-components'
import { PaginationContainer, PaginationMainContainer, MainTariffContainer, TableCell } from '../style'
import AirTariffModal from './AirTariffModal/AirTariffModal'
import SeaFclTariffModal from './SeaFclTariffModal/SeaFclTariffModal'
import SeaLclTariffModal from './SeaLclTariffModal/SeaLclTariffModal'
import LandTariffModal from './LandTariffModal/LandTariffModal'
import { I18n } from 'react-redux-i18n'
import useTariffsByCountry from '../../../hooks/tariff/useTariffsByCountry'
import { TariffContext } from '../context/TariffContext'
import { TariffItemsTypes } from '../../../../application/enum/tariffEnum'
import { ModalTypes, TxChargeTypes } from '../../../../application/enum/enum'
import ValidityDisplay from '../../../components/ValidityDisplay/ValidityDisplay'

import { convertToDecimal } from '../helpers'

export interface TariffTableProps {
  expanded: boolean
  country: string
  region: string
  countriesRefetch: Function
}

const TariffTable = ({
  expanded,
  country,
  region,
  countriesRefetch
}: TariffTableProps): JSX.Element => {
  const { content: tariffData, totalElements: totalTariffList, setParams, refetch, params } = useTariffsByCountry()
  const { filter, setFilter }: any = useContext(TariffContext)

  const [seaType, setSeaType] = useState<string>(TxChargeTypes.Fcl)
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
        case ModalTypes.Air:
          return <AirTariffModal
                    dataProp={tariffData[index]}
                    open={openModal}
                    setClose={handleClose}
                  />
        case ModalTypes.Sea:
          if (seaType === TxChargeTypes.Fcl) {
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
        case ModalTypes.Land:
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
      const originDestiny = modal === ModalTypes.Land ? `${String(tariff.originCity)} > ${String(tariff.destinationCity)}` : `${String(tariff.origin)} > ${String(tariff.destination)}`
      const validity = new Date(tariff.validityDate).toLocaleDateString('pt-BR')
      const values = [...tariff.tariffTypeValues].filter(each => each.tariffType.description !== 'MINIMUN').map(item => item.value)
      const value = `de ${convertToDecimal(Math.min(...values))} a ${convertToDecimal(Math.max(...values))}`
      const getTariffTypeValue = (type: string): string => {
        const res = tariff.tariffTypeValues.find(each => each.tariffType.description === type)
        if (res !== undefined) return convertToDecimal(res.value)
        return ''
      }
      const geralImoDed = `${getTariffTypeValue(TariffItemsTypes.Vlgeneralded)} / ${getTariffTypeValue(TariffItemsTypes.Vlimoded)}`
      const geralImoCons = `${getTariffTypeValue(TariffItemsTypes.Vlgeneralcons)} / ${getTariffTypeValue(TariffItemsTypes.Vlimocons)}`
      const minimun = getTariffTypeValue(TariffItemsTypes.Minimun)
      const under7w = getTariffTypeValue(TariffItemsTypes.Vluntil7wm)
      const over = getTariffTypeValue(TariffItemsTypes.Over)
      const container20 = getTariffTypeValue(TariffItemsTypes.Vlcontainer20)
      const container40 = getTariffTypeValue(TariffItemsTypes.Vlcontainer40)

      let item: any
      if (modal !== '') {
        switch (modal) {
          case ModalTypes.Air:
            item = { id, agent, airCompany: company, originDestiny, transitTime, validity, currency, minimun, value }
            break
          case ModalTypes.Sea:
            if (seaType === TxChargeTypes.Lcl) item = { id, agent, seaCompany: company, originDestiny, transitTime, validity, currency, minimun, under7w, over }
            if (seaType === TxChargeTypes.Fcl) item = { id, agent, seaCompany: company, originDestiny, transitTime, validity, currency, container20, container40 }
            break
          case ModalTypes.Land:
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

  useEffect(() => {
    const payload = filter.tariffModalType === ModalTypes.Sea
      ? { ...filter, txRegion: region, txCountry: country, txChargeType: seaType }
      : { ...filter, txRegion: region, txCountry: country }
    if (expanded && !openModal) {
      setParams(payload)
    }
  }, [expanded, filter, seaType, openModal])

  useEffect(() => {
    if (params !== undefined) {
      refetch()
      countriesRefetch()
    }
  }, [params])

  if (tariffData.length > 0) {
    return (
    <MainTariffContainer>
      {filter.tariffModalType === ModalTypes.Sea &&
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
              {filter.tariffModalType === ModalTypes.Sea
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
                {filter.tariffModalType === ModalTypes.Sea
                  ? Object.keys(I18n.t(`pages.tariff.tariffTable.columns.SEA.${seaType}`)).map((each: string) =>
                    <TableCell key={each} align="left">
                      {each === 'validity' ? <ValidityDisplay validity={row[each]} /> : row[each] }
                    </TableCell>)
                  : Object.keys(I18n.t(`pages.tariff.tariffTable.columns.${String(filter.tariffModalType)}`)).map((each: string) =>
                    <TableCell key={each} align="left">
                      {each === 'validity' ? <ValidityDisplay validity={row[each]} /> : row[each] }
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
            initialPage={filter.page}
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
      {filter.tariffModalType === ModalTypes.Sea &&
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
