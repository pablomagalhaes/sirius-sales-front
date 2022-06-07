export interface CargoVolume {
  id?: number | null
  idCargo?: number | null
  cdCargoType: number// modal tipo
  valueQuantity: number // qnt
  valueGrossWeight: number // peso bruto
  valueCubage: number // cubagem
  valueLength: number // comprimento
  valueHeight: number // altura
  valueWidth: number // largura
  valueDiameter: number // diametro
  isStacked: boolean // empilhar
}
