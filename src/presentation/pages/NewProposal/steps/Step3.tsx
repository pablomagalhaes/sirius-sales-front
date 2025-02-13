/* eslint-disable */
import React, {
  useEffect,
  useState,
  useContext,
  useImperativeHandle
} from 'react'
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
  MessageContainer,
  ChargeText,
  BottomTitle,
  BottomTextValue,
  BottomValueContainer,
  BottomContainer,
  ChargeContainer,
  EditIconContainer
} from '../style'
import ItemModal, {
  ItemModalData,
  initialState
} from '../../../components/ItemModal/ItemModal'
import ControlledSelect from '../../../components/ControlledSelect'
import ControlledInput from '../../../components/ControlledInput'
import ChargeTable, {
  CalculationDataProps
} from '../../../components/ChargeTable'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
import { withTheme } from 'styled-components'
import API from '../../../../infrastructure/api'
import { ProposalContext, ProposalProps } from '../context/ProposalContext'
import { CargoVolume } from '../../../../domain/CargoVolume'
import CwModal from '../../../components/CwModal/CwModal'
import FormatNumber from '../../../../application/utils/formatNumber'
import { ModalTypes } from '../../../../application/enum/enum'
import Autocomplete, {
  createFilterOptions
} from '@material-ui/lab/Autocomplete'
import { StyledPaper } from './StepsStyles'

interface Step3Props {
  theme?: any
  modal: string
  invalidInput: boolean
  setCostData: any
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  setSpecifications: (specifications: string) => void
  setTableItems: (tableItems: ItemModalData[]) => void
  setUndoMessage: React.Dispatch<
  React.SetStateAction<{
    step3: boolean
    step6origin: boolean
    step6destiny: boolean
    step5: boolean
  }>
  >
  undoMessage: {
    step3: boolean
    step6origin: boolean
    step6destiny: boolean
    step5: boolean
  }
  containerTypeList: any[]
  setCalculationData: (items: CalculationDataProps) => void
  setStepLoaded: (steps: any) => void
  updateTableIdsRef: any
  setCw: (item: any) => void
  setCwSale: (item: any) => void
}

interface CalculationData {
  weight: number | null
  cubageWeight: number | null
  cubage: number | null
}

interface ChargeableWeightResult {
  chargeableWeight: number | null
  chargeableWeightSale: number | null
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
  setCalculationData,
  setStepLoaded,
  updateTableIdsRef,
  setCw,
  setCwSale
}: Step3Props): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [cwOpen, setCwOpen] = useState(false)
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
  const [calculation, setCalculation] = useState<CalculationDataProps>({
    weight: 0,
    cubage: 0,
    cubageWeight: 0
  })
  const initialData = {
    description: '',
    specifications: '',
    temperature: '',
    dangerous: false,
    imo: '',
    codUn: ''
  }
  const [data, setData] = useState(initialData)
  const [chargeableWeight, setChargeableWeight] = useState<number | null>(null)
  const [chargeableWeightSale, setChargeableWeightSale] = useState<
  number | null
  >(null)
  const [cwSaleEditMode, setCwSaleEditMode] = useState(false)
  const [dangerousCodes, setDangerousCodes] = useState<any[]>([])
  const [copyCwSale, setCopyCwSale] = useState<number | null>(null)
  let packagingListVar

  useImperativeHandle(updateTableIdsRef, () => ({
    updateStep3Ids () {
      let tableDataId = 0
      if (proposal?.idProposal !== undefined && proposal?.idProposal !== null) {
        const newTableData = [...tableRows]
        for (const cargo of proposal.cargo[0].cargoVolumes) {
          newTableData[tableDataId].idCargoVolume = cargo?.id
          newTableData[tableDataId++].idCargo = cargo?.idCargo
          setTableRows(newTableData)
        }
      }
    }
  }))

  const isAir = (): boolean => {
    return modal === 'AIR'
  }

  useEffect(() => {
    setTableItems([...tableRows])
  }, [tableRows, setTableRows])

  useEffect(() => {
    setSpecifications(data.specifications)
    setTableRows([])
  }, [data.specifications])

  useEffect(() => {
    setCalculationData(calculation)
  }, [calculation])

  // Function to update other cargo related information
  const updateOtherCargoInformationInProposal = (chargeableWeight: number | null, chargeableWeightSale: number | null): void => {
    setProposal((currentProposal) => ({
      ...currentProposal,
      cargo: currentProposal.cargo.map((cargo, index) =>
        index === 0
          ? {
              ...cargo,
              txCargo: data.description,
              idCargoContractingType: modal === 'SEA'
                ? specificationsList.map((spe) => spe.toLowerCase()).indexOf(data.specifications) + 1
                : null,
              isDangerous: data.dangerous,
              idImoType: Number(data.imo),
              idTemperature: Number(data.temperature),
              vlCwPurchase: isAir() ? chargeableWeight : null,
              vlCwSale: isAir() ? chargeableWeightSale : null,
              idCargoDangerous: dangerousCodes.find((code) => code.codDangerousCode === data.codUn?.split(' - ')[0])?.id ?? null
            }
          : cargo
      )
    }))
  }

  function calculateChargeableWeights (calculation: CalculationData): ChargeableWeightResult {
    let chargeableWeight = null
    let chargeableWeightSale = null

    if (
      calculation.weight !== null &&
      calculation.cubageWeight !== null &&
      calculation.weight !== 0 &&
      calculation.cubageWeight !== 0
    ) {
      if (calculation.weight > calculation.cubageWeight) {
        chargeableWeight = calculation.weight
        chargeableWeightSale = calculation.weight
      } else {
        chargeableWeight = calculation.cubageWeight
        chargeableWeightSale = calculation.cubageWeight
      }
    }

    setChargeableWeight(chargeableWeight)
    setChargeableWeightSale(chargeableWeightSale)
    updateOtherCargoInformationInProposal(chargeableWeight, chargeableWeightSale)
    setCalculationData(calculation)
    return { chargeableWeight, chargeableWeightSale }
  }

  useEffect(() => {
    setCwSale(chargeableWeightSale)
  }, [chargeableWeightSale])

  useEffect(() => {
    setChargeableWeightSale(copyCwSale)
    setCw(proposal.cargo[0].vlCwPurchase)
    setChargeableWeight(proposal.cargo[0].vlCwPurchase)
  }, [copyCwSale])

  useEffect(() => {
    setTableRows([])
    setChargeData(initialState)
    setCopyTable([])
    setUndoMessage({
      step3: false,
      step6origin: false,
      step6destiny: false,
      step5: false
    })
    setData(initialData)
    setTableId(0)
  }, [modal])

  useEffect(() => {
    const getPackagingList = new Promise<void>((resolve) => {
      API.getPackaging()
        .then((response) => {
          setPackagingList(response)
          packagingListVar = response
          resolve(response)
        })
        .catch((err) => console.log(err))
    })

    const getImoList = new Promise<void>((resolve) => {
      API.getImo()
        .then((response) => {
          setImoList(response)
          resolve()
        })
        .catch((err) => console.log(err))
    })

    const getTemperatureList = new Promise<void>((resolve) => {
      API.getTemperature()
        .then((response) => {
          setTemperatureList(response)
          resolve()
        })
        .catch((err) => console.log(err))
    })

    const getDangerousCodesList = new Promise<void>((resolve) => {
      API.getDangerousCode()
        .then((response) => {
          setDangerousCodes(response)
          resolve(response)
        })
        .catch((err) => console.log(err))
    })

    void Promise.all([getPackagingList, getImoList, getTemperatureList, getDangerousCodesList]).then(
      (response: any) => {
        if (proposal.idProposal !== undefined && proposal.idProposal !== null) {
          const dangerCode = response[3].find((code) => code.id === proposal.cargo[0].idCargoDangerous)
          setCopyCwSale(proposal.cargo[0].vlCwSale)
          setCwSaleEditMode(true)
          setData({
            description: proposal.cargo[0].txCargo,
            specifications:
              proposal.idTransportMode === 2
                ? specificationsList[
                  Number(proposal.cargo[0].idCargoContractingType) - 1
                ].toLowerCase()
                : '',
            temperature: String(proposal.cargo[0].idTemperature),
            dangerous: proposal.cargo[0].isDangerous,
            imo: String(proposal.cargo[0].idImoType),
            codUn: String(proposal.cargo[0].idCargoDangerous !== null && dangerCode ? `${String(dangerCode.codDangerousCode)} - ${String(dangerCode.txDangerousCode)}` : '')
          })

          if (isAir()) {
            setChargeableWeight(proposal.cargo[0].vlCwPurchase)
            setChargeableWeightSale(proposal.cargo[0].vlCwSale)
          }

          let id = 0
          const loadedTableRows: ItemModalData[] = []
          proposal.cargo[0].cargoVolumes.forEach((cargo: CargoVolume) => {
            loadedTableRows.push({
              idCargoVolume: cargo.id,
              idCargo: proposal.cargo[0].id,
              amount: String(cargo.valueQuantity),
              cubage: FormatNumber.convertNumberToString(cargo?.valueCubage),
              diameter: FormatNumber.convertNumberToString(cargo?.valueDiameter),
              height: FormatNumber.convertNumberToString(cargo?.valueHeight),
              length: FormatNumber.convertNumberToString(cargo?.valueLength),
              rawWeight: FormatNumber.convertNumberToString(cargo?.valueGrossWeight),
              type: marineFCL()
                ? verifyContainerById(cargo.idContainer as string)
                : verifyPackagingById(cargo.idPackaging as number),
              width: FormatNumber.convertNumberToString(cargo?.valueWidth),
              id: id++,
              stack: cargo?.isStacked as any
            })
          })
          setTableRows(loadedTableRows)
          setTableId(loadedTableRows.length)
          setStepLoaded((currentState) => ({ ...currentState, step3: true }))
          setCwSaleEditMode(false)
        } else {
          setStepLoaded((currentState) => ({ ...currentState, step3: true }))
        }
      }
    )
  }, [])

  // Function to update only cargoVolumes
  const updateCargoVolumesInProposal = (value: CargoVolume[]): void => {
    setProposal((currentProposal) => ({
      ...currentProposal,
      cargo: currentProposal.cargo.map((cargo, index) =>
        index === 0 ? { ...cargo, cargoVolumes: value } : cargo
      )
    }))
  }

  useEffect(() => {
    setProposal({
      ...proposal,
      cargo: [{
        ...proposal.cargo[0],
        txCargo: data.description,
        idCargoContractingType:
          modal === 'SEA'
            ? specificationsList
              .map((spe) => spe.toLowerCase())
              .indexOf(data.specifications) + 1
            : null,
        isDangerous: data.dangerous,
        idImoType: Number(data.imo),
        idTemperature: Number(data.temperature),
        cargoVolumes: cargoVolume,
        vlCwPurchase: isAir() ? chargeableWeight : null,
        vlCwSale: isAir() ? chargeableWeightSale : null,
        idCargoDangerous: dangerousCodes.find((code) => code.codDangerousCode === data.codUn?.split(' - ')[0])?.id ?? null
      }]
    })
  }, [data, chargeableWeight, chargeableWeightSale, cargoVolume])

  useEffect(() => {
    setCostData(tableRows.length)
    const newCargoVolumes: CargoVolume[] = []
    tableRows.forEach((row) => {
      newCargoVolumes.push({
        id: row.idCargoVolume === undefined ? null : row.idCargoVolume,
        idCargo: row.idCargo === undefined ? null : row.idCargo,
        cdCargoType:
          modal === 'SEA'
            ? specificationsList
              .map((spe) => spe.toLowerCase())
              .indexOf(data.specifications) + 1
            : 1,
        idContainer: modal !== 'SEA' || !marineFCL() ? null : verifyContainerByType(row.type), // !marineFCL() ? null : containerTypeList.filter((cont) => cont.type === row.type)[0]?.id,
        idPackaging: marineFCL() ? null : packagingList.filter((pack) => pack.packaging === row.type)[0]?.id,
        valueQuantity: Number(row.amount),
        valueGrossWeight: Number(row.rawWeight?.replace(',', '.')),
        valueCubage: Number(row.cubage?.replace(',', '.')),
        valueLength: Number(row.length?.replace(',', '.')),
        valueHeight: Number(row.height?.replace(',', '.')),
        valueWidth: Number(row.width?.replace(',', '.')),
        valueDiameter: Number(row.diameter?.replace(',', '.')),
        isStacked: row.stack,
        container: row.type
      })
    })

    updateCargoVolumesInProposal(newCargoVolumes)
    setCargoVolume(newCargoVolumes)
  }, [tableRows])

  const marineFCL = (): boolean => {
    let specification: string = ''
    if (proposal.cargo[0].idCargoContractingType !== null) {
      specification =
      specificationsList[
        Number(proposal.cargo[0].idCargoContractingType) - 1
      ].toLowerCase()
    }
    return modal === 'SEA' && specification === 'fcl'
  }

  const handleCwClose = (): void => {
    setCwOpen(false)
  }

  const handleOpen = (): void => {
    setOpen(true)
    setUndoMessage({
      step3: false,
      step6origin: false,
      step6destiny: false,
      step5: false
    })
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
      } else {
        const elementIndex = tableRows.findIndex(
          (element) => element.id === item.id
        )
        const startTableRows = tableRows.slice(0, elementIndex)
        const endTableRows = tableRows.slice(elementIndex + 1)
        setTableRows([...startTableRows, item, ...endTableRows])
      }
    } else {
      const newItem = { ...item, id: tableId }
      setTableId((tableId) => tableId + 1)
      setTableRows([...tableRows, newItem])
    }
  }

  const handleCwEdit = (cwValue: string): void => {
    setChargeableWeightSale(Number(cwValue.replace(',', '.')))
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
    setUndoMessage({
      step3: true,
      step6origin: false,
      step6destiny: false,
      step5: false
    })
  }

  const validateDangerous = (): boolean => {
    return (
      !data.dangerous ||
      (data.dangerous && data.imo.length !== 0 && data.codUn && data.codUn?.length !== 0)
    )
  }

  const validateEspecification = (): boolean => {
    return (
      (modal === 'SEA' && data.specifications.length !== 0) || modal !== 'SEA'
    )
  }

  const validateTableRows = (): boolean => {
    return (
      tableRows.length > 0 ||
      data.description.length > 0 ||
      data.specifications.length > 0 ||
      data.temperature !== '' ||
      data.imo.length > 0 ||
      data.codUn?.length > 0 ||
      data.dangerous
    )
  }

  const validateFormComplete = (): void => {
    const step6 = modal === ModalTypes.Land
    if (
      validateDangerous() &&
      validateEspecification() &&
      data.description.length !== 0 &&
      data.temperature.length !== 0
    ) {
      setCompleted((currentState) => {
        return { ...currentState, step3: true, step6 }
      })
    } else {
      setCompleted((currentState) => {
        return { ...currentState, step3: false, step6 }
      })
    }
  }

  const validateFilled = (): void => {
    if (validateTableRows()) {
      setFilled((currentState) => {
        return { ...currentState, step3: true }
      })
    } else {
      setFilled((currentState) => {
        return { ...currentState, step3: false }
      })
    }
  }

  const verifyContainerByType = (container: string): string => {
    let id: string = ''
    for (let index = 0; index < containerTypeList.length; index++) {
      const element = containerTypeList[index]
      if (container === element.container) {
        id = element.idContainer
      }
    }
    return id
  }

  const verifyContainerById = (containerId: string): string => {
    let name: string = ''
    for (let index = 0; index < containerTypeList.length; index++) {
      const element = containerTypeList[index]
      if (containerId === element.idContainer) {
        name = element.container
      }
    }
    return name
  }

  const verifyPackagingById = (packagingId: number): string => {
    let name: string = ''
    for (let index = 0; index < packagingListVar.length; index++) {
      const element = packagingListVar[index]
      if (packagingId === element.id) {
        name = element.packaging
      }
    }
    return name
  }

  useEffect(() => {
    validateFormComplete()
    validateFilled()
  }, [data, modal, tableRows])

  useEffect(() => {
    if (!data.dangerous) {
      setData({ ...data, imo: '', codUn: '' })
    }
  }, [data.dangerous])

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 500
  })

  return (
    <Separator>
      <Title>
        3. {I18n.t('pages.newProposal.step3.title')}
        <Subtitle>{I18n.t('pages.newProposal.step3.subtitle')}</Subtitle>
      </Title>
      <FormControl variant="outlined" size="small" className="form-size">
        <Grid container spacing={5}>
          <Grid item xs={4}>
            <FormLabel component="legend" error={invalidInput && data.description.length === 0}>
              {I18n.t('pages.newProposal.step3.description')}
              {<RedColorSpan> *</RedColorSpan>}
            </FormLabel>
            <ControlledInput
              id="description"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              inputProps={{ maxLength: 30 }}
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
              <FormLabel component="legend" error={invalidInput && data.specifications === ''}>
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
            <FormLabel component="legend" error={invalidInput && data.temperature.length === 0}>
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
              invalid={invalidInput && data.temperature.length === 0}
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
          <Grid item xs={2}>
            <FormLabel component="legend">&nbsp;</FormLabel>
            <FormControlLabel
              value="dangerous"
              label={<b>{I18n.t('components.itemModal.hazardous')}</b>}
              control={
                <Checkbox
                  checked={data.dangerous}
                  onChange={() =>
                    setData({ ...data, dangerous: !data.dangerous })
                  }
                />
              }
            />
          </Grid>
          {data.dangerous && (
            <Grid item xs={3}>
              <FormLabel component="legend" error={
                  invalidInput &&
                  data.dangerous &&
                  (data.imo === null || data.imo.length === 0)
                }>
                {I18n.t('components.itemModal.imo')}
                {data.dangerous && <RedColorSpan> *</RedColorSpan>}
              </FormLabel>
              <ControlledSelect
                value={data.imo != null ? data.imo : ''}
                onChange={(e) => setData({ ...data, imo: e.target.value })}
                disableUnderline
                displayEmpty
                placeholder={data.imo != null ? data.imo : ''}
                invalid={
                  invalidInput &&
                  data.dangerous &&
                  (data.imo === null || data.imo.length === 0)
                }
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
              >
                <MenuItem disabled value="">
                  <SelectSpan placeholder={1}>
                    {I18n.t('pages.newProposal.step3.choose')}
                  </SelectSpan>
                </MenuItem>
                {imoList.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      <SelectSpan>{item.id} - {item.type}</SelectSpan>
                    </MenuItem>
                  )
                })}
              </ControlledSelect>
            </Grid>
          )}
          {data.dangerous && (
            <Grid item xs={4}>

              <FormLabel component="legend" error={
                  invalidInput &&
                  (data.codUn === null || data.codUn?.length === 0)
                }>
                {I18n.t('components.itemModal.codUn')}
                <RedColorSpan> *</RedColorSpan>
              </FormLabel>
              <Autocomplete
                onChange={(e, newValue) => {
                  setData({ ...data, codUn: newValue })
                }}
                options={[
                  '',
                  ...dangerousCodes.map((code) => `${String(code.codDangerousCode)} - ${String(code.txDangerousCode)}`)
                ]}
                value={data.codUn != null ? data.codUn : ''}
                filterOptions={filterOptions}
                filterSelectedOptions
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <ControlledInput
                      {...params}
                      id="search-cod-un"
                      toolTipTitle={I18n.t('components.itemModal.requiredField')}
                      invalid={
                        invalidInput &&
                        (data.codUn === null || data.codUn?.length === 0)
                      }
                      variant="outlined"
                      size="small"
                      placeholder={I18n.t('pages.newProposal.step2.choose')}
                    />
                  </div>
                )}
                PaperComponent={(params: any) => (
                  <StyledPaper {...params} />
                )}
              />
            </Grid>
          )}
          {tableRows.length > 0 && (
            <Grid item xs={12}>
              <ChargeTable
                charges={tableRows}
                onEdit={handleEdit}
                onDelete={handleDelete}
                modal={modal}
                specification={data.specifications}
                setCalculation={calculateChargeableWeights}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <BottomContainer>
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
              {isAir() && tableRows.length > 0
                ? (
                  <ChargeContainer>
                    <BottomValueContainer>
                      <BottomTitle>&nbsp;</BottomTitle>
                      <ChargeText>Chargeable Weight</ChargeText>
                    </BottomValueContainer>
                    <BottomValueContainer>
                      <BottomTitle>
                        {I18n.t('pages.newProposal.step3.buy')}:
                      </BottomTitle>
                      <BottomTextValue>
                        {chargeableWeight?.toFixed(2).replace('.', ',')}
                      </BottomTextValue>
                    </BottomValueContainer>
                    <ChargeContainer>
                      <BottomValueContainer>
                        <BottomTitle>
                          {I18n.t('pages.newProposal.step3.sale')}:
                        </BottomTitle>
                        <BottomTextValue>
                          {chargeableWeightSale?.toFixed(2).replace('.', ',')}
                        </BottomTextValue>
                      </BottomValueContainer>
                      <EditIconContainer>
                        <svg
                          onClick={() => setCwOpen(true)}
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.5732 3.34943C15.5658 3.74609 15.3729 4.23915 14.9613 4.65065C11.7168 7.89073 8.47601 11.1308 5.23519 14.3709C4.8681 14.7379 5.02383 14.6489 4.54921 14.7602C3.38489 15.0345 2.21686 15.294 1.05254 15.5609C0.692862 15.6425 0.485212 15.3014 0.551957 15.0456C0.681738 14.5266 0.796687 14.0002 0.915343 13.4775C1.0785 12.7768 1.23794 12.0724 1.40109 11.3681C1.43076 11.2457 1.47526 11.1382 1.56796 11.0456C3.73344 8.88426 5.89522 6.72297 8.057 4.56168C9.18424 3.43469 10.3115 2.3077 11.4387 1.18072C11.7428 0.873022 12.0987 0.661712 12.5252 0.583861C13.2557 0.450402 13.9083 0.613518 14.4496 1.13994C14.6128 1.29935 14.7722 1.46617 14.9354 1.62558C15.3692 2.05191 15.5769 2.57091 15.5732 3.34943ZM1.50863 14.6045C1.55683 14.597 1.57537 14.597 1.59391 14.5933C2.49496 14.3857 3.39601 14.1744 4.29706 13.9742C4.46392 13.9372 4.58629 13.8593 4.70495 13.7444C7.90868 10.534 11.1198 7.33095 14.3273 4.12423C14.3792 4.07233 14.4348 4.02043 14.483 3.96482C14.9057 3.47918 14.928 2.88603 14.5238 2.41521C14.2791 2.12976 14.0084 1.86655 13.7266 1.61446C13.4003 1.32159 13.0146 1.23633 12.5919 1.38832C12.2693 1.50324 12.0505 1.7405 11.8169 1.98889C11.8763 2.0482 11.9245 2.10381 11.9764 2.15571C12.3694 2.54867 12.7625 2.94163 13.1555 3.3346C13.2112 3.3902 13.2668 3.45323 13.3113 3.51625C13.4151 3.66454 13.4114 3.81653 13.3113 3.96482C13.2112 4.1094 13.074 4.16871 12.896 4.14276C12.7847 4.12423 12.7032 4.06491 12.629 3.99077C12.2248 3.58298 11.8169 3.17889 11.4091 2.7711C11.3497 2.71179 11.2867 2.65247 11.2459 2.60799C11.0531 2.80076 10.864 2.98612 10.6637 3.19002C10.7194 3.23821 10.7898 3.29752 10.8566 3.36425C11.2459 3.75351 11.6352 4.14276 12.0246 4.53202C12.0654 4.5728 12.1062 4.60987 12.1395 4.65436C12.2582 4.81377 12.2471 5.0362 12.1099 5.18078C11.9504 5.3476 11.765 5.37355 11.5796 5.24751C11.5129 5.20302 11.4536 5.14741 11.3979 5.0918C10.9975 4.69514 10.6007 4.29847 10.2039 3.9018C10.1557 3.85731 10.1075 3.81282 10.0556 3.76463C10.0074 3.80541 9.97405 3.83136 9.94438 3.86473C7.40439 6.40415 4.86439 8.93987 2.3281 11.4793C2.25765 11.5497 2.20944 11.6276 2.18349 11.7314C2.02775 12.4172 1.86831 13.0993 1.70886 13.7852C1.63841 14.0447 1.57537 14.3116 1.50863 14.6045Z"
                            fill="#1470CC"
                          />
                        </svg>
                      </EditIconContainer>
                    </ChargeContainer>
                  </ChargeContainer>
                  )
                : null}
            </BottomContainer>
          </Grid>
        </Grid>
      </FormControl>
      {undoMessage.step3 && (
        <MessageContainer>
          <Messages
            closable={true}
            severity="success"
            buttonText={I18n.t('pages.newProposal.step3.messageUndoDelete')}
            closeAlert={() => {
              setUndoMessage({
                step3: false,
                step6origin: false,
                step6destiny: false,
                step5: false
              })
            }}
            closeMessage=""
            goBack={() => {
              setTableRows(copyTable)
              setUndoMessage({
                step3: false,
                step6origin: false,
                step6destiny: false,
                step5: false
              })
            }}
            message={I18n.t('pages.newProposal.step3.messageDeleteItem')}
          />
        </MessageContainer>
      )}
      <CwModal
        dataProp={calculation}
        action={handleCwEdit}
        open={cwOpen}
        setClose={handleCwClose}
        editValue={chargeableWeightSale}
      />
    </Separator>
  )
}
export default withTheme(Step3)
