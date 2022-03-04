import React, { useEffect, useState } from 'react'
import { Button } from 'fiorde-fe-components'
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  RadioGroup,
  Checkbox
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import {
  Title,
  Subtitle,
  Separator,
  SelectSpan,
  BoldSpan,
  StyledRadio
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

interface Step3Props {
  theme?: any
  modal: string
  invalidInput: boolean
  setCompleted: (completed: any) => void
  setCostData: any
}

const Step3 = ({
  modal,
  invalidInput,
  setCompleted,
  theme,
  setCostData
}: Step3Props): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [tableRows, setTableRows] = useState<ItemModalData[]>([])
  const [chargeData, setChargeData] = useState<ItemModalData>(initialState)

  useEffect(() => {
    setCostData(tableRows.length)
  }, [tableRows.length])

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

  const getColor = (value): any => {
    if (value === '' && invalidInput && modal === 'SEA') {
      console.log(theme?.commercial?.components?.itemModal?.redAsterisk)
      return theme?.commercial?.components?.itemModal?.redAsterisk
    }
  }

  useEffect(() => {
    if (
      data.description.length !== 0 &&
      ((modal === 'SEA' && data.specifications.length !== 0) ||
        modal !== 'SEA') &&
      ((data.refrigereted && data.temperature.length !== 0) ||
        !data.refrigereted)
    ) {
      setCompleted((currentState) => {
        return { ...currentState, step3: true }
      })
    } else {
      setCompleted((currentState) => {
        return { ...currentState, step3: false }
      })
    }
  }, [data, modal])

  return (
    <Separator>
      <Title>
        3. {I18n.t('pages.newProposal.step3.title')}
        <Subtitle>{I18n.t('pages.newProposal.step3.subtitle')}</Subtitle>
      </Title>
      <FormControl variant="outlined" size="small" className="form-size">
        <Grid container spacing={2}>
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
          {modal === 'SEA'
            ? (
            <Grid item xs={4}>
              <FormLabel component="legend">
                {I18n.t('pages.newProposal.step3.specifications')}
                {modal === 'SEA' && <RedColorSpan> *</RedColorSpan>}
              </FormLabel>
              <RadioGroup
                row
                aria-label="specifications"
                name="row-radio-buttons-group"
                onChange={(e) =>
                  setData({ ...data, specifications: e.target.value })
                }
              >
                <FormControlLabel
                  value="fcl"
                  control={
                    <StyledRadio color={getColor(data.specifications)} />
                  }
                  label="FCL"
                />
                <FormControlLabel
                  value="lcl"
                  control={
                    <StyledRadio
                      color={getColor(data.specifications)}
                      className="radio-spacement"
                    />
                  }
                  label="LCL"
                />
                <FormControlLabel
                  value="refrigereted"
                  control={
                    <Checkbox
                      className="radio-spacement"
                      onChange={() =>
                        setData({ ...data, refrigereted: !data.refrigereted })
                      }
                      checked={data.refrigereted}
                    />
                  }
                  label={
                    <BoldSpan checked={data.refrigereted}>
                      {I18n.t('pages.newProposal.step3.refrigerated')}
                    </BoldSpan>
                  }
                />
              </RadioGroup>
            </Grid>
              )
            : (
              <Grid item xs={4}>
                <FormControlLabel
                  value="refrigereted"
                  className="checkbox-div-spacement"
                  control={
                    <Checkbox
                      className="radio-spacement"
                      onChange={() =>
                        setData({ ...data, refrigereted: !data.refrigereted })
                      }
                      checked={data.refrigereted}
                    />
                  }
                  label={
                    <BoldSpan checked={data.refrigereted}>
                      {I18n.t('pages.newProposal.step3.refrigerated')}
                    </BoldSpan>
                  }
                />
            </Grid>
              )}
          {data.refrigereted && (
            <Grid item xs={3}>
              <FormLabel component="legend">
                {I18n.t('pages.newProposal.step3.temperature')}
                {data.refrigereted && <RedColorSpan> *</RedColorSpan>}
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
                  data.refrigereted &&
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
                  <MenuItem key={item.value} value={item.value}>
                    <SelectSpan>{item.name}</SelectSpan>
                  </MenuItem>
                ))}
              </ControlledSelect>
            </Grid>
          )}
          {tableRows.length > 0 && (
            <Grid item xs={12}>
              <ChargeTable
                charges={tableRows}
                onEdit={handleEdit}
                onDelete={handleDelete}
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
    </Separator>
  )
}
export default withTheme(Step3)
