import React, { useState } from 'react'
import { Table, TableCell, TableRow } from '@material-ui/core'
import { Pagination } from 'fiorde-fe-components'
import {
  TableContainer,
  PaginationContainer,
  PaginationMainContainer,
  TableHeader,
  TableBod
} from './TariffProcessingTableStyle'

import moment from 'moment'
import { I18n } from 'react-redux-i18n'

import { chooseStatusColor, capitalizeFirstLetter } from './helpers'
export interface TariffProcessingTableProps {
  rows: any[]
  handleSelectedItem: (id: any) => void
}

const defaultFilter = {
  direction: 'ASC',
  orderByList: 'tariffType',
  page: 0,
  size: 10,
  tariffModalType: '',
  validityTariff: '',
  tariffType: ''
}

const TariffProcessingTable = ({
  rows,
  handleSelectedItem
}: TariffProcessingTableProps): JSX.Element => {
  const [state, setState] = useState({ anchorEl: null, currentKey: null })
  const [filter, setFilter] = useState<any>(defaultFilter)
  const [totalFilesList, setTotalFilesList] = useState<number>(3)

  const handleClick = (event: any, key: any, id: any): void => {
    setState({ anchorEl: event.currentTarget, currentKey: key })
    handleSelectedItem(id)
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Nome do arquivo</TableCell>
              <TableCell>Data/hora do processamento</TableCell>
              <TableCell>Usuário</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Modal</TableCell>
              <TableCell>Agente</TableCell>
              <TableCell>Status do processamento</TableCell>
            </TableRow>
          </TableHeader>
          <TableBod>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.txFileName}</TableCell>
                <TableCell>
                  {moment(row.dtProcess).format('DD/MM/YYYY HH:MM')}
                </TableCell>
                <TableCell>{row.userCreation}</TableCell>
                <TableCell>{capitalizeFirstLetter(row.tariffType)}</TableCell>
                <TableCell>{capitalizeFirstLetter(row.tariffModalType)}</TableCell>
                {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */}
                <TableCell>{row.nmAgent && capitalizeFirstLetter(row.nmAgent)}</TableCell>
                <TableCell>
                  <div
                    style={{
                      borderRadius: '50%',
                      height: '15px',
                      width: '15px',
                      float: 'left',
                      marginRight: '5px',
                      backgroundColor: `${chooseStatusColor(row.txStatus)}`
                    }}>
                  </div>
                  <div
                    style={{
                      lineHeight: '16px',
                      marginLeft: '10px',
                      cursor: 'pointer'
                    }}
                    onClick={
                      row.txStatus ===
                      I18n.t('pages.tariff.tariffTableProcessing.sucessLabel')
                        ? () => {}
                        : (e) => handleClick(e, index, row.idUploadFile)
                    }
                  >
                    {capitalizeFirstLetter(row.txStatus)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBod>
        </Table>
        <PaginationContainer>
          <PaginationMainContainer>
            <Pagination
              count={totalFilesList}
              labelDisplay="exibindo"
              labelDisplayedRows="de"
              labelRowsPerPage="Arquivos por página"
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
      </TableContainer>
    </>
  )
}

export default TariffProcessingTable
