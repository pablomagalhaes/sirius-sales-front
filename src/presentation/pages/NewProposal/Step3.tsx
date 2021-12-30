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
  Select,
  TextField
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, Separator, SelectPlaceholder } from './style'
import ItemModal from '../../components/ItemModal/ItemModal'

const Step3 = (): JSX.Element => {
  const [temperature, setTemperature] = useState('')
  const [open, setOpen] = useState(false)
  const handleOpen = (): void => setOpen(true)
  const handleClose = (): void => setOpen(false)
  const handleAdd = (item): void => console.log(item)
  // mock
  const temperatureList = [
    {
      name: 'teste',
      value: 1
    }
  ]

  const handleChange = (event): void => {
    setTemperature(event.target.value)
  }

  return (
    <Separator>
      <Title>
        3. {I18n.t('pages.newProposal.step3.title')}
        <Subtitle>{I18n.t('pages.newProposal.step3.subtitle')}</Subtitle>
      </Title>
      <FormControl variant="outlined" size="small">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step3.description')}</FormLabel>
            <TextField
              id="description"
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={3}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step3.specifications')}</FormLabel>
            <RadioGroup row aria-label="specifications" name="row-radio-buttons-group">
              <FormControlLabel value="flc" control={<Radio />} label="FLC" />
              <FormControlLabel value="lcl" control={<Radio />} label="LCL" />
            </RadioGroup>
          </Grid>
          <Grid item xs={3}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step3.temperature')}</FormLabel>
            <Select
              labelId="select-label-temperature"
              id="temperature"
              value={temperature}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem disabled value="">
                <SelectPlaceholder>{I18n.t('pages.newProposal.step3.choose')}</SelectPlaceholder>
              </MenuItem>
              {temperatureList.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Button
              onAction={handleOpen}
              text={I18n.t('pages.newProposal.step3.buttonAdd')}
              icon="add"
              backgroundGreen={false}
            />
            <ItemModal
              handleAdd={handleAdd}
              setOpen={handleOpen}
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
