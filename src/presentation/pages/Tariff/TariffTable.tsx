import React, { useState, useEffect } from 'react'

import { Table, TableBody, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { Pagination } from 'fiorde-fe-components'
import { PaginationContainer, PaginationMainContainer } from './style'
import { TableCell } from './style'
import { columns, rows } from './constants'
import API from '../../../infrastructure/api'

export interface TariffTableProps {
  countriesExpanded: string[]
  country: string
  region: string
  filter: any
  setFilter: Function
}

const TariffTable = ({
  countriesExpanded,
  country,
  region,
  filter,
  setFilter
}: TariffTableProps): JSX.Element => {
  const [data, setData] = useState<any[]>()
  const [seaType, setSeaType] = useState<string>('FCL')
  const [totalTariffList, setTotalTariffList] = useState<number>(0)

  const getTariffItems = (tariffList): string[] => {
    const array: any = []
    for (const tariff of tariffList) {
      const modal = filter.tariffModalType
      const agent = tariff.nmAgent
      const company = tariff.dsBusinessPartnerTransporter
      const transitTime = tariff.transitTime
      const currency = tariff.currency
      const originDestiny = modal === 'LAND' ? tariff.cityOrigin + ' > ' + tariff.cityDestination : tariff.origin + ' > ' + tariff.destination
      const validity = new Date(tariff.validityDate).toLocaleDateString('pt-BR')
      const values = [...tariff.tariffTypeValues].filter(each => each.tariffType.description !== 'MINIMUN').map(item => item.value)
      const value = `de ${Math.min(...values)} a ${Math.max(...values)}`
      const getTariffTypeValue = (type: string) => tariff.tariffTypeValues.find(each => each.tariffType.description === type)
      const geralImoDed = getTariffTypeValue('VLGERALDED')?.idTariffTypeValues + ' / ' + getTariffTypeValue('VLIMODED')?.idTariffTypeValues
      const geralImoCons = getTariffTypeValue('VLGERALCONS')?.idTariffTypeValues + ' / ' + getTariffTypeValue('VLIMOCONS')?.idTariffTypeValues
      const minimun = getTariffTypeValue('MINIMUN')?.value
      const under7w = getTariffTypeValue('VLATE7WM')?.value
      const over = getTariffTypeValue('ACIMA')?.value
      const container20 = getTariffTypeValue('VLCONTAINER20')?.value
      const container40 = getTariffTypeValue('VLCONTAINER40')?.value

      let item: any
      if (modal !== '') {
        switch (modal) {
          case 'AIR':
            item = { agent, airCompany: company, originDestiny, transitTime, validity, currency, minimun, value }
            break
          case 'SEA':
            if (seaType === 'LCL') item = { agent, seaCompany: company, originDestiny, transitTime, validity, currency, minimun, under7w, over }
            if (seaType === 'FCL') item = { agent, seaCompany: company, originDestiny, transitTime, validity, currency, container20, container40 }
            break
          case 'LAND':
            item = { agent, landCompany: company, originDestiny, transitTime, validity, currency, geralImoDed, geralImoCons }
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
    console.log(countriesExpanded)
    if (countriesExpanded.some((each) => each === country)) {
      void (async function () {
        const modal = filter.tariffModalType
        let payload = { ...filter, txRegion: region, txCountry: country }
        if (modal !== '' && modal === 'SEA') payload = { ...filter, txRegion: region, txCountry: country, txChargeType: seaType }
        await API.getTariffsByCountry(payload)
          .then((response) => {
            const tariffs = getTariffItems(response.content)
            if (tariffs.length > 0) setData(tariffs)
            setTotalTariffList(response.totalElements)
          })
          .catch((err) => console.log(err))
      })()
    }
  }, [region, countriesExpanded, filter])

  if (data !== undefined) {
    return (
    <>
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
                  ? rows[filter.tariffModalType][seaType].map((each: string) => <TableCell key={each} align="left">{row[each]}</TableCell>)
                  : rows[filter.tariffModalType].map((each: string) => <TableCell key={each} align="left">{row[each]}</TableCell>)
                }
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
          />
        </PaginationMainContainer>
      </PaginationContainer>
    </>
    
    )
  } else return <></>
}

export default TariffTable
