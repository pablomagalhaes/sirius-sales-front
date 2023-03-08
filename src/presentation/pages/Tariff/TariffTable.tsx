import React, { useState, useEffect } from 'react'

import { Table, TableBody, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { TableCell } from './style'
import { columns, rows } from './constants'
import API from '../../../infrastructure/api'

export interface TariffTableProps {
  countriesExpanded: string[]
  country: string
  region: string
  filter: any
}

const TariffTable = ({
  countriesExpanded,
  country,
  region,
  filter
}: TariffTableProps): JSX.Element => {
  const [data, setData] = useState<any[]>()
  const [seaType, setSeaType] = useState<string>('LCL')

  const getLandTariffItems = (tariffList): string[] => {
    const getTariffValues = (tariffTypeValues, type) => {
      const resp = tariffTypeValues.find(each => each.tariffType.description === type)
      if (resp !== undefined) return resp.idTariffTypeValues
      return '-'
    }
    const array: any = []
    for (const tariff of tariffList) {
      const originDestiny = tariff.cityOrigin + ' > ' + tariff.cityDestination
      const validity = new Date(tariff.validityDate).toLocaleDateString('pt-BR')
      const geralImoDed = getTariffValues(tariff.tariffTypeValues, 'VLGERALDED') + ' / ' + getTariffValues(tariff.tariffTypeValues, 'VLIMODED')
      const geralImoCons = getTariffValues(tariff.tariffTypeValues, 'VLGERALCONS') + ' / ' + getTariffValues(tariff.tariffTypeValues, 'VLIMOCONS')
      const item = {
        agent: tariff.nmAgent,
        landCompany: tariff.dsBusinessPartnerTransporter,
        originDestiny,
        transitTime: tariff.transitTime,
        validity,
        currency: tariff.currency,
        geralImoDed,
        geralImoCons
      }

      array.push(item)
    }
    return array
  }

  const getTariffItems = (tariffs): any[] => {
    const modal = filter.tariffModalType
    let items: any[] = []
    if (modal !== '') {
      switch (modal) {
        case 'AIR':
          // items = getAirTariffItems(tariffs)
          break
        case 'SEA':
          // if (seaType === 'LCL') items = getSeaLclTariffItems(tariffs)
          // if (seaType === 'FCL') items = getSeaFclTariffItems(tariffs)
          break
        case 'LAND':
          items = getLandTariffItems(tariffs)
          break
        default:
          break
      }
    }
    return items
  }

  useEffect(() => {
    console.log(countriesExpanded)
    if (countriesExpanded.some((each) => each === country)) {
      // setData([mockedData])
      void (async function () {
        await API.getTariffsByCountry({ ...filter, txRegion: region, txCountry: country })
          .then((response) => {
            const tariffs = getTariffItems(response.content)
            if (tariffs.length > 0) setData(tariffs)
          })
          .catch((err) => console.log(err))
      })()
    }
  }, [region, countriesExpanded, filter])

  if (data !== undefined) {
    return (
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
    )
  } else return <></>
}

export default TariffTable
