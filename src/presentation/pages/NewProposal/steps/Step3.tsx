import React, { useEffect, useState, useContext } from 'react'
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
import ChargeTable, { CalculationDataProps } from '../../../components/ChargeTable'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
import { withTheme } from 'styled-components'
import API from '../../../../infrastructure/api'
import { ProposalContext, ProposalProps } from '../context/ProposalContext'
import { CargoVolume } from '../../../../domain/CargoVolume'

interface Step3Props {
  theme?: any
  modal: string
  invalidInput: boolean
  setCostData: any
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  setSpecifications: (specifications: string) => void
  setTableItems: (tableItems: ItemModalData[]) => void
  setUndoMessage: React.Dispatch<React.SetStateAction<{
    step3: boolean
    step5origin: boolean
    step5destiny: boolean
    step6: boolean
  }>>
  undoMessage: { step3: boolean, step5origin: boolean, step5destiny: boolean, step6: boolean }
  containerTypeList: any[]
  setCalculationData: (items: CalculationDataProps) => void
}

const Step3 = ({
  modal,
  invalidInput,
  setCompleted,
  setCostData,
  setFilled,
  setSpecifications,
  setTableItems,
  setUndoMessage,
  undoMessage,
  containerTypeList,
  setCalculationData
}: Step3Props): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [tableRows, setTableRows] = useState<ItemModalData[]>([])
  const [chargeData, setChargeData] = useState<ItemModalData>(initialState)
  const [cargoVolume, setCargoVolume] = useState<CargoVolume[]>([])
  const [temperatureList, setTemperatureList] = useState<any[]>([])
  const [imoList, setImoList] = useState<any[]>([])
  const [copyTable, setCopyTable] = useState<ItemModalData[]>([])
  const [tableId, setTableId] = useState(0)
  const specificationsList = ['FCL', 'LCL', 'Break Bulk', 'Ro-Ro']
  const [packagingList, setPackagingList] = useState<any[]>([])
  const { proposal, setProposal }: ProposalProps = useContext(ProposalContext)
  const [calculation, setCalculation] = useState<CalculationDataProps>({ weight: 0, cubage: 0, cubageWeight: 0 })
  const initialData = {
    description: '',
    specifications: '',
    temperature: '',
    dangerous: false,
    imo: '',
    codUn: ''
  }
  const [data, setData] = useState(initialData)

  useEffect(() => {
    setSpecifications(data.specifications)
    setTableRows([])
  }, [data.specifications])

  useEffect(() => {
    setCalculationData(calculation)
  }, [calculation])

  useEffect(() => {
    setTableRows([])
    setChargeData(initialState)
    setCopyTable([])
    setUndoMessage({ step3: false, step5origin: false, step5destiny: false, step6: false })
    setData(initialData)
    setTableId(0)
  }, [modal])

  useEffect(() => {
    const getPackagingList = new Promise<void>((resolve) => {
      API.getPackaging()
        .then((response) => { setPackagingList(response); resolve(response) })
        .catch((err) => console.log(err))
    })

    const getImoList = new Promise<void>((resolve) => {
      API.getImo()
        .then((response) => { setImoList(response); resolve() })
        .catch((err) => console.log(err))
    })

    const getTemperatureList = new Promise<void>((resolve) => {
      API.getTemperature()
        .then((response) => { setTemperatureList(response); resolve() })
        .catch((err) => console.log(err))
    })

    void Promise.all([getPackagingList, getImoList, getTemperatureList]).then((response: any) => {
      if (proposal.id !== undefined && proposal.id !== null) {
        setData({
          description: proposal.cargo.cargo,
          specifications: proposal.idTransport === 'SEA' ? specificationsList[Number(proposal.cargo.idCargoContractingType) - 1].toLowerCase() : '',
          temperature: String(proposal.cargo.idTemperature),
          dangerous: proposal.cargo.isDangerous,
          imo: String(proposal.cargo.idImoType),
          codUn: String(proposal.cargo.codeUn)
        })

        let id = 0
        const loadedTableRows: ItemModalData[] = []
        proposal.cargo.cargoVolumes.forEach((cargo: CargoVolume) => {
          loadedTableRows.push({
            idCargoVolume: cargo.id,
            idCargo: proposal.cargo.id,
            amount: String(cargo.valueQuantity),
            cubage: completeDecimalPlaces(cargo.valueCubage),
            diameter: completeDecimalPlaces(cargo.valueDiameter),
            height: completeDecimalPlaces(cargo.valueHeight),
            length: completeDecimalPlaces(cargo.valueLength),
            rawWeight: completeDecimalPlaces(cargo.valueGrossWeight),
            type: marineFCL() ? '' : response[0].filter((pack) => Number(pack.id) === cargo.cdCargoType)[0]?.packaging, // TODO inserir esse campo depois de ajustada a tabela (container ou package)
            width: completeDecimalPlaces(cargo.valueWidth),
            id: id++,
            stack: cargo.isStacked
          })
        })
        setTableRows(loadedTableRows)
        setTableId(loadedTableRows.length)
      }
    })
  }, [])

  useEffect(() => {
    setProposal(
      {
        ...proposal,
        cargo: {
          ...proposal.cargo,
          cargo: data.description,
          idCargoContractingType: modal === 'SEA' ? (specificationsList.map((spe) => spe.toLowerCase()).indexOf(data.specifications) + 1) : 1,
          idPackaging: 0, // esse campo vai ser realocado para CargoVolume
          idContainerType: 'nul', // esse campo vai ser realocado para CargoVolume
          isDangerous: data.dangerous,
          idImoType: Number(data.imo),
          codeUn: Number(data.codUn),
          idTemperature: Number(data.temperature),
          cargoVolumes: cargoVolume
        }
      })
  }, [data, cargoVolume])

  useEffect(() => {
    setCostData(tableRows.length)
    const newCargoVolumes: CargoVolume[] = []
    tableRows.forEach((row) => {
      newCargoVolumes.push({
        id: row.idCargoVolume === undefined ? null : row.idCargoVolume,
        idCargo: row.idCargo === undefined ? null : row.idCargo,
        cdCargoType: marineFCL() ? 1 : packagingList.filter((pack) => pack.packaging === row.type)[0]?.id, // TODO quando for marineFCL salvar id (string 4 digitos)
        valueQuantity: Number(row.amount),
        valueGrossWeight: Number(row.rawWeight?.replace(',', '.')),
        valueCubage: Number(row.cubage?.replace(',', '.')),
        valueLength: Number(row.length?.replace(',', '.')),
        valueHeight: Number(row.height?.replace(',', '.')),
        valueWidth: Number(row.width?.replace(',', '.')),
        valueDiameter: Number(row.diameter?.replace(',', '.')),
        isStacked: row.stack
      })
    })
    setCargoVolume(newCargoVolumes)
  }, [tableRows])

  const marineFCL = (): boolean => {
    return modal === 'SEA' && data.specifications === 'fcl'
  }

  const completeDecimalPlaces = (num: number): string => {
    const decimalPlaces = String(num).split('.')[1]
    let completeNumber = String(num)
    if ((decimalPlaces === undefined) || decimalPlaces.length < 2) {
      completeNumber = completeNumber + ','
      for (let i = 0; i < 2 - (decimalPlaces === undefined ? 0 : decimalPlaces.length); i++) {
        completeNumber = completeNumber + '0'
      }
    }
    return completeNumber
  }

  const handleOpen = (): void => {
    setOpen(true)
    setUndoMessage({ step3: false, step5origin: false, step5destiny: false, step6: false })
  }

  const handleClose = (): void => {
    setOpen(false)
    setChargeData(initialState)
  }

  const handleAdd = (item: ItemModalData): void => {
    if (item.id !== null) {
      if (item.id === tableRows[0].id) {
        const endTableRows = tableRows.slice(1)
        setTableRows([item, ...endTableRows])
        setTableItems([item, ...endTableRows])
      } else {
        const elementIndex = tableRows.findIndex(element => element.id === item.id)
        const startTableRows = tableRows.slice(0, elementIndex)
        const endTableRows = tableRows.slice(elementIndex + 1)
        setTableRows([...startTableRows, item, ...endTableRows])
        setTableItems([...startTableRows, item, ...endTableRows])
      }
    } else {
      const newItem = { ...item, id: tableId }
      setTableId((tableId) => tableId + 1)
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
    setUndoMessage({ step3: true, step5origin: false, step5destiny: false, step6: false })
  }

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
      data.temperature !== '' ||
      data.imo.length > 0 ||
      data.codUn.length > 0 ||
      data.dangerous
    ) {
      setFilled((currentState) => {
        return { ...currentState, step3: true }
      })
    } else {
      setFilled((currentState) => {
        return { ...currentState, step3: false }
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
            <FormControlLabel value="dangerous" control={<Checkbox checked={data.dangerous} onChange={e => setData({ ...data, dangerous: !data.dangerous })} />} label={I18n.t('components.itemModal.yes')} />
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
                <SelectSpan placeholder={1}>{I18n.t('pages.newProposal.step3.choose')}</SelectSpan>
              </MenuItem>
              {imoList.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    <SelectSpan>{item.type}</SelectSpan>
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
                setCalculation={setCalculation}
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
              containerTypeList={containerTypeList}
              packagingList={packagingList}
            />
          </Grid>
        </Grid>
      </FormControl>
      {undoMessage.step3 &&
        <MessageContainer>
          <Messages
            closable={true}
            severity='success'
            buttonText={I18n.t('pages.newProposal.step3.messageUndoDelete')}
            closeAlert={() => { setUndoMessage({ step3: false, step5origin: false, step5destiny: false, step6: false }) }}
            closeMessage=''
            goBack={() => { setTableItems(copyTable); setTableRows(copyTable); setUndoMessage({ step3: false, step5origin: false, step5destiny: false, step6: false }) }}
            message={I18n.t('pages.newProposal.step3.messageDeleteItem')} />
        </MessageContainer>}
    </Separator >
  )
}
export default withTheme(Step3)
