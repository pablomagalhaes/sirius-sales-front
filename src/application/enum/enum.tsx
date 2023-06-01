enum ModalTypes {
  Sea = 'SEA',
  Land = 'LAND',
  Air = 'AIR'
}

enum OrderTypes {
  Ascendent = 'ASC',
  Descendent = 'DESC'
}

enum BusinessPartnerTypes {
  Coloader = 'COLOADER',
  ShipOwner = 'ARMADOR',
  Land = 'TRANS. INTERNACIONAL',
  Air = 'CIA. AEREA'
}

enum TariffTypes {
  Import = 'import',
  Export = 'export'
}

enum OriginDestinyTypes {
  Airport = 'AEROPORTO',
  Seaport = 'PORTO',
  Landport = 'RODOVIARIO',
  Country = 'País',
  City = 'Cidade',
  State = 'Estado'
}

enum TxChargeTypes {
  Lcl = 'LCL', 
  Fcl = 'FCL'
}

enum IconTypes {
  Error = 'error',
  Warn = 'warn',
  Import = 'import',
  Export = 'export',
  Plane = 'plane',
  Ship = 'ship',
  Truck = 'truck',
  Alert = 'alert',
  Main = 'main'
}

enum AcitivityTypes {
  Import = 'IMPORT',
  Export = 'EXPORT'
}

export { 
  ModalTypes, 
  OrderTypes, 
  BusinessPartnerTypes, 
  TariffTypes, 
  OriginDestinyTypes, 
  TxChargeTypes, 
  IconTypes,
  AcitivityTypes
}
