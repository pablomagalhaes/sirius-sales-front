import React, { useEffect, useState } from 'react'
import { Button, FloatingMenu, Pagination } from 'fiorde-fe-components'
import { Breadcrumbs, Link, Typography } from '@material-ui/core/'
import {
  TableContainer,
  PaginationContainer,
  PaginationMainContainer
} from './TariffProcessingTableStyle'
import {
  LeftSideListHeaderContainer,
  ListHeaderContainer,
  BottomSideContainer,
  RootContainer,
  TopButtonContainer,
  TopContainer,
  ButtonContainer,
  GridButton,
  RowButton,
  ColButton
} from './style'
import { useHistory } from 'react-router-dom'
import { I18n } from 'react-redux-i18n'

import ItemErrorModal from './ItemErrorModal/ItemErrorModal'
import { getModalFilter, getTariffByFilter, getActivityFilter, getValidityFilter } from './helpers'
import TariffUploadModal from './components/TariffUploadModal/TariffUploadModal'
import TariffProcessingTable from './TariffProcessingTable'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import useTariffs from '../../hooks/tariff/useTariffs'
import Filter from './components/filter'
// import { TariffContext, filterDefault } from './context/TariffContext'

import {
  TARIFF_PROCESSING_LINK_HOME,
  TARIFF_PROCESSING_LINK_TARIFF,
  TARIFF_PROCESSING_BUTTON_BACK,
  TARIFF_PROCESSING_BUTTON_UPLOAD,
  TARIFF_PROCESSING_SPAN_TITLE
} from '../../../ids'

const defaultFilter = {
  direction: 'ASC',
  orderByList: 'tariffType',
  page: 0,
  size: 10,
  tariffModalType: '',
  validityTariff: '',
  tariffType: ''
}

const TariffProcessing = (): JSX.Element => {
  // const { data: tariffList = [], changeFilterList } = useTariffs()
  // const { filter, setFilter }: any = useContext(TariffContext)
  const [filter, setFilter] = useState<any>(defaultFilter)
  const [openErrorModal, setOpenErrorModal] = useState(false)
  const [tariffList, setTariffList] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalFilesList, setTotalFilesList] = useState<number>(0)
  const [itemId, setItemId] = useState('')
  const history = useHistory()
  const [open, setOpen] = useState(false)
  const [uploadType, setUploadType] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quickFilterList, setQuickFilterList] = useState<any[]>([
    { type: 'activity', status: I18n.t('pages.tariff.upload.import') },
    { type: 'modal', status: I18n.t('pages.tariff.modals.air') }
  ])

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
    void getTariffByFilter(filter).then(result => {
      setTariffList(result.content)
      setTotalFilesList(result.totalElements)
    })
  }, [filter])

  const handleSelectedItem = (id: any): void => {
    setItemId(id)
    setOpenErrorModal(true)
  }

  const handleCloseErrorModal = (): void => {
    setOpenErrorModal(false)
    setItemId('')
  }

  const handleBack = (): void => {
    history.push('/tarifario')
  }

  const cleanFilter = (): void => {
    const tariffModalType = getModalFilter(quickFilterList)
    const tariffType = getActivityFilter(quickFilterList)
    const validityTariff = getValidityFilter(quickFilterList)

    setFilter(() => ({
      ...defaultFilter,
      tariffModalType,
      validityTariff,
      tariffType
    }))
  }

  return (
    <RootContainer>
      <TopContainer>
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <Link
            id={TARIFF_PROCESSING_LINK_HOME}
            color="inherit"
            onClick={() => history.push('/')}
            className="breadcrumbInitial"
            style={{ cursor: 'pointer' }}
          >
            Home
          </Link>
          <Link
            id={TARIFF_PROCESSING_LINK_TARIFF}
            color="inherit"
            onClick={() => history.push('/tarifario')}
            className="breadcrumbInitial"
            style={{ cursor: 'pointer' }}
          >
            Tarifário
          </Link>
          <span className="breadcrumbEnd" id={TARIFF_PROCESSING_SPAN_TITLE}>Tarifas em processamento</span>
        </Breadcrumbs>
        <TopButtonContainer>
            <GridButton>
              <RowButton>
                <ColButton>
                  <ButtonContainer>
                    <Button
                      id={TARIFF_PROCESSING_BUTTON_BACK}
                      disabled={false}
                      text={'Voltar ao Tarifário'}
                      backgroundGreen={false}
                      icon="arrowLeft"
                      onAction={handleBack}
                      position="left"
                    />
                  </ButtonContainer>
                </ColButton>
                <ColButton>
                  <ButtonContainer>
                    <Button
                      id={TARIFF_PROCESSING_BUTTON_UPLOAD}
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
                </ColButton>
              </RowButton>
            </GridButton>
        </TopButtonContainer>
      </TopContainer>
      <Typography variant="h5" component="h2" gutterBottom={true}>
        {I18n.t('pages.tariff.tariffProcessingTitle')}
      </Typography>

      <ListHeaderContainer>
        <LeftSideListHeaderContainer>
          <Filter
              cleanFilter={cleanFilter}
            />
        </LeftSideListHeaderContainer>
      </ListHeaderContainer>
      <BottomSideContainer>
        <TableContainer>
          <TariffProcessingTable
           rows={tariffList}
           handleSelectedItem={handleSelectedItem}
          />
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
          <ItemErrorModal
            open={openErrorModal}
            setClose={handleCloseErrorModal}
            title={I18n.t('pages.tariff.itemErrorModal.title')}
            itemId={itemId}
            tariffList={tariffList}
          />
      </BottomSideContainer>
    </RootContainer>
  )
}

export default TariffProcessing
