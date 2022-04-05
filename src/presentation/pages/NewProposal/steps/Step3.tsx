import React, { useEffect, useState } from 'react'
import { Button, Messages } from 'fiorde-fe-components'
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Checkbox,
  Box
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import {
  Title,
  Subtitle,
  Separator,
  SelectSpan,
  MessageContainer
} from '../style'
import ItemModal, {
  ItemModalData,
  initialState
} from '../../../components/ItemModal/ItemModal'
import ControlledSelect from '../../../components/ControlledSelect'
import ControlledInput from '../../../components/ControlledInput'
import ChargeTable from '../../../components/ChargeTable'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
import { withTheme } from 'styled-components'
import API from '../../../../infrastructure/api'

interface Step3Props {
  theme?: any
  modal: string
  invalidInput: boolean
  setCostData: any
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  setSpecifications: (specifications: string) => void
  setTableItems: (tableItems: ItemModalData[]) => void
}

const Step3 = ({
  modal,
  invalidInput,
  setCompleted,
  setCostData,
  setFilled,
  setSpecifications,
  setTableItems
}: Step3Props): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [tableRows, setTableRows] = useState<ItemModalData[]>([])
  const [chargeData, setChargeData] = useState<ItemModalData>(initialState)
  const [temperatureList, setTemperatureList] = useState<any[]>([])
  const [imoList, setImoList] = useState<any[]>([])
  const specificationsList = ['Break Bulk', 'FCL', 'LCL', 'Ro-Ro']
  const [showSaveMessage, setShowSaveMessage] = useState(false)
  const [copyTable, setCopyTable] = useState<ItemModalData[]>([])

  useEffect(() => {
    void (async function () {
      await API.getImo()
        .then((response) => setImoList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  const saveMessageInfo = {
    closable: true,
    severity: 'success',
    buttonText: I18n.t('pages.newProposal.step3.messageUndoDelete'),
    closeAlert: () => { setShowSaveMessage(false) },
    closeMessage: '',
    goBack: () => { setTableRows(copyTable); setShowSaveMessage(false) },
    message: I18n.t('pages.newProposal.step3.messageDeleteItem')
  }

  useEffect(() => {
    setCostData(tableRows.length)
  }, [tableRows.length])

  useEffect(() => {
    void (async function () {
      await API.getTemperature()
        .then((response) => setTemperatureList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  const initialData = {
    description: '',
    specifications: '',
    refrigereted: false,
    temperature: '',
    dangerous: false,
    imo: '',
    codUn: ''
  }

  const [data, setData] = useState(initialData)

  useEffect(() => {
    setTableRows([])
  }, [data.specifications])

  useEffect(() => {
    setTableRows([])
    setChargeData(initialState)
    setCopyTable([])
    setShowSaveMessage(false)
    setData(initialData)
  }, [modal])

  const handleOpen = (): void => setOpen(true)

  const handleClose = (): void => {
    setOpen(false)
    setChargeData(initialState)
  }

  const handleAdd = (item: ItemModalData): void => {
    if (item.id !== null) {
      const startTableRows = tableRows.slice(0, item.id)
      const endTableRows = tableRows.slice(item.id + 1)
      setTableRows([...startTableRows, item, ...endTableRows])
      setTableItems([...startTableRows, item, ...endTableRows])
    } else {
      const newItem = { ...item, id: tableRows.length }
      setTableRows([...tableRows, newItem])
      setTableItems([...tableRows, newItem])
    }
  }

  const handleEdit = (row: ItemModalData): void => {
    setChargeData(row)
    setOpen(true)
  }

  const handleDelete = (index: number): void => {
    const newTable = tableRows.slice(0)
    setCopyTable(tableRows)
    newTable.splice(index, 1)
    setTableRows(newTable)
    setTableItems(newTable)
    setShowSaveMessage(true)
  }

  useEffect(() => {
    setSpecifications(data.specifications)
  }, [data.specifications])

  useEffect(() => {
    if (
      data.description.length !== 0 &&
      ((modal === 'SEA' && data.specifications.length !== 0) ||
        modal !== 'SEA') &&
      data.temperature.length !== 0
    ) {
      setCompleted((currentState) => {
        return { ...currentState, step3: true }
      })
    } else {
      setCompleted((currentState) => {
        return { ...currentState, step3: false }
      })
    }
    if (
      tableRows.length > 0 ||
      data.description.length > 0 ||
      data.specifications.length > 0 ||
      data.temperature.length > 0 ||
      data.imo.length > 0 ||
      data.codUn.length > 0 ||
      data.refrigereted ||
      data.dangerous
    ) {
      setFilled((currentState) => {
        return { ...currentState, step3: true };
      })
    } else {
      setFilled((currentState) => {
        return { ...currentState, step3: false };
      })
    }
  }, [data, modal, tableRows])

  return (
    <Separator>
      <Title>
        3. {I18n.t('pages.newProposal.step3.title')}
        <Subtitle>{I18n.t('pages.newProposal.step3.subtitle')}</Subtitle>
      </Title>
      <FormControl variant="outlined" size="small" className="form-size">
        <Grid container spacing={5}>
          <Grid item xs={4}>
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step3.description')}
              {<RedColorSpan> *</RedColorSpan>}
            </FormLabel>
            <ControlledInput
              id="description"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={invalidInput && data.description.length === 0}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              value={data.description}
              variant="outlined"
              size="small"
            />
          </Grid>
          {modal === 'SEA' && (
            <Grid item xs={2}>
              <FormLabel component="legend">
                {I18n.t('pages.newProposal.step3.specifications')}
                {modal === 'SEA' && <RedColorSpan> *</RedColorSpan>}
              </FormLabel>
              <ControlledSelect
                labelId="select-label-specifications"
                id="specifications"
                value={data.specifications}
                onChange={(e) =>
                  setData({ ...data, specifications: e.target.value })
                }
                displayEmpty
                disableUnderline
                invalid={invalidInput && data.specifications === ''}
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
              >
                <MenuItem disabled value="">
                  <SelectSpan placeholder={1}>
                    {I18n.t('pages.newProposal.step3.choose')}
                  </SelectSpan>
                </MenuItem>
                {specificationsList.map((item) => {
                  return (
                    <MenuItem key={`${item}_key`} value={item.toLowerCase()}>
                      <SelectSpan>{item}</SelectSpan>
                    </MenuItem>
                  )
                })}
              </ControlledSelect>
            </Grid>
          )}
          <Grid item xs={2}>
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step3.temperature')}
              {<RedColorSpan> *</RedColorSpan>}
            </FormLabel>
            <ControlledSelect
              labelId="select-label-temperature"
              id="temperature"
              value={data.temperature}
              onChange={(e) =>
                setData({ ...data, temperature: e.target.value })
              }
              displayEmpty
              disableUnderline
              invalid={
                invalidInput &&
                data.temperature.length === 0
              }
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
            >
              <MenuItem disabled value="">
                <SelectSpan placeholder={1}>
                  {I18n.t('pages.newProposal.step3.choose')}
                </SelectSpan>
              </MenuItem>
              {temperatureList.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  <SelectSpan>{item.temperature}</SelectSpan>
                </MenuItem>
              ))}
            </ControlledSelect>
          </Grid>
          <Box width="100%" />
          <Grid item xs={1}>
            <FormLabel component="legend">{I18n.t('components.itemModal.hazardous')}</FormLabel>
            <FormControlLabel value="dangerous" control={<Checkbox value={data.dangerous} onChange={e => setData({ ...data, dangerous: !data.dangerous })} />} label={I18n.t('components.itemModal.yes')} />
          </Grid>
          {data.dangerous && <Grid item xs={3}>
            <FormLabel component="legend">{I18n.t('components.itemModal.imo')}
              {data.dangerous && <RedColorSpan> *</RedColorSpan>}</FormLabel>
            <ControlledSelect
              value={data.imo != null ? data.imo : ''}
              onChange={e => (setData({ ...data, imo: e.target.value }))}
              disableUnderline
              displayEmpty
              placeholder={data.imo != null ? data.imo : ''}
              invalid={
                invalidInput && data.dangerous &&
                (data.imo === null || data.imo.length === 0)
              }
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
            >
              <MenuItem disabled value="">
                <span style={{ marginLeft: '10px' }}>{I18n.t('components.itemModal.choose')}</span>
              </MenuItem>
              {imoList.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    <span style={{ marginLeft: '10px' }}>{item.type}</span>
                  </MenuItem>
                )
              })}
            </ControlledSelect>
          </Grid>}
          {data.dangerous && <Grid item xs={2}>
            <FormLabel component="legend">{I18n.t('components.itemModal.codUn')}
              <RedColorSpan> *</RedColorSpan></FormLabel>
            <ControlledInput
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={
                invalidInput &&
                (data.codUn === null || data.codUn.length === 0)
              }
              value={data.codUn}
              onChange={e => (setData({ ...data, codUn: e.target.value }))}
              variant="outlined"
              size="small"
            />
          </Grid>}
          {tableRows.length > 0 && (
            <Grid item xs={12}>
              <ChargeTable
                charges={tableRows}
                onEdit={handleEdit}
                onDelete={handleDelete}
                modal={modal}
                specification={data.specifications}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <Button
              onAction={handleOpen}
              text={I18n.t('pages.newProposal.step3.buttonAdd')}
              icon="add"
              backgroundGreen={false}
              disabled={
                modal === '' ||
                (modal === 'SEA' && data.specifications.length === 0)
              }
              tooltip={
                modal === '' ||
                  (modal === 'SEA' && data.specifications.length === 0)
                  ? I18n.t('pages.newProposal.step3.buttonAddTooltip')
                  : I18n.t('pages.newProposal.step3.buttonAdd')
              }
            />
            <ItemModal
              dataProp={chargeData}
              handleAdd={handleAdd}
              open={open}
              setClose={handleClose}
              title={I18n.t('pages.newProposal.step3.buttonAdd')}
              modal={modal}
              specifications={data.specifications}
            />
          </Grid>
        </Grid>
      </FormControl>
      {showSaveMessage &&
        <MessageContainer>
          <Messages
            closable={true}
            severity='success'
            buttonText={I18n.t('pages.newProposal.step3.messageUndoDelete')}
            closeAlert={() => { setShowSaveMessage(false) }}
            closeMessage=''
            goBack={() => { setTableRows(copyTable); setShowSaveMessage(false) }}
            message={I18n.t('pages.newProposal.step3.messageDeleteItem')} />
        </MessageContainer>}
    </Separator >
  )
}
export default withTheme(Step3)
