import React, { useState } from 'react'
import { Button } from 'fiorde-fe-components'
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Checkbox
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, Separator, SelectSpan, BoldSpan } from '../style'
import ItemModal, { ItemModalData, initialState } from '../../../components/ItemModal/ItemModal'
import ControlledSelect from '../../../components/ControlledSelect'
import ControlledInput from '../../../components/ControlledInput'
import ChargeTable from '../../../components/ChargeTable'

// mock
const temperatureList = [
  {
    name: 'Ambiente',
    value: 1
  },
  {
    name: 'Abaixo de -20',
    value: 2
  },
  {
    name: '-20',
    value: 3
  },
  {
    name: '-20 a -10',
    value: 4
  },
  {
    name: '-18 a 0',
    value: 5
  },
  {
    name: '-10',
    value: 6
  }
]

const Step3 = (): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [tableRows, setTableRows] = useState<ItemModalData[]>([])
  const [chargeData, setChargeData] = useState<ItemModalData>(initialState)

  const [data, setData] = useState({
    description: '',
    specifications: '',
    refrigereted: false,
    temperature: ''
  })

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
    } else {
      const newItem = { ...item, id: tableRows.length }
      setTableRows([...tableRows, newItem])
    }
  }

  const handleEdit = (row: ItemModalData): void => {
    setChargeData(row)
    setOpen(true)
  }

  const handleDelete = (index: number): void => {
    const newTable = tableRows.slice(0)
    newTable.splice(index, 1)
    setTableRows(newTable)
  }

  return (
    <Separator>
      <Title>
        3. {I18n.t('pages.newProposal.step3.title')}
        <Subtitle>{I18n.t('pages.newProposal.step3.subtitle')}</Subtitle>
      </Title>
      <FormControl variant="outlined" size="small" className='form-size'>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step3.description')}</FormLabel>
            <ControlledInput
              id="description"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={false}
              onChange={e => setData({ ...data, description: e.target.value })}
              value={data.description}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step3.specifications')}</FormLabel>
            <RadioGroup row aria-label="specifications" name="row-radio-buttons-group" onChange={e => setData({ ...data, specifications: e.target.value })}>
              <FormControlLabel value="flc" control={<Radio />} label="FLC" />
              <FormControlLabel value="lcl" control={<Radio className="radio-spacement" />} label="LCL" />
              <FormControlLabel
                value="refrigereted"
                control={
                  <Checkbox
                    className="radio-spacement"
                    onChange={() => setData({ ...data, refrigereted: !data.refrigereted })}
                    checked={data.refrigereted}
                  />
                }
                label={<BoldSpan checked={data.refrigereted}>{I18n.t('pages.newProposal.step3.refrigerated')}</BoldSpan>}
              />
            </RadioGroup>
          </Grid>
          {
            data.refrigereted && (
              <Grid item xs={3}>
                <FormLabel component="legend">{I18n.t('pages.newProposal.step3.temperature')}</FormLabel>
                <ControlledSelect
                  labelId="select-label-temperature"
                  id="temperature"
                  value={data.temperature}
                  onChange={e => setData({ ...data, temperature: e.target.value })}
                  displayEmpty
                  disableUnderline
                  invalid={false}
                  toolTipTitle={I18n.t('components.itemModal.requiredField')}
                >
                  <MenuItem disabled value="">
                    <SelectSpan placeholder={1}>{I18n.t('pages.newProposal.step3.choose')}</SelectSpan>
                  </MenuItem>
                  {temperatureList.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      <SelectSpan>{item.name}</SelectSpan>
                    </MenuItem>
                  ))}
                </ControlledSelect>
              </Grid>)
          }
          {
            tableRows.length > 0 && (
              <Grid item xs={12}>
                <ChargeTable charges={tableRows} onEdit={handleEdit} onDelete={handleDelete} />
              </Grid>)
          }
          <Grid item xs={12}>
            <Button
              onAction={handleOpen}
              text={I18n.t('pages.newProposal.step3.buttonAdd')}
              icon="add"
              backgroundGreen={false}
            />
            <ItemModal
              dataProp={chargeData}
              handleAdd={handleAdd}
              open={open}
              setClose={handleClose}
              title={I18n.t('pages.newProposal.step3.buttonAdd')}
            />
          </Grid>
        </Grid>
      </FormControl>
    </Separator>
  )
}

export default Step3
