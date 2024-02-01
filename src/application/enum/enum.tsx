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

enum ServiceTypes {
  Sea = 'FRETE MARITIMO',
  Land = 'FRETE RODOVIÁRIO INTERNACIONAL',
  Air = 'FRETE AÉREO'
}

enum IdProposalTypes {
  Sea = 2,
  Land = 3,
  Air = 1
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

enum OperationTypes {
  Import = 1,
  Export = 2
}

enum LocaleTypes {
  PT_BR = 'pt-BR',
  EN_US = 'en-US'
}

enum ProfitsPercentsTypes {
  Zero = 0,
  Ten = 10,
  Twenty = 20,
  Thirty = 30,
  Forty = 40,
  Fifty = 50,
}

enum ProposalTypes {
  Client = 1,
  RoutingOrder = 2
}

enum IncotermTypes {
  Fca = 'FCA',
  Exw = 'EXW',
  Dap = 'DAP',
  Ddp = 'DDP'
}

enum SpecificationsType {
  Fcl = 'fcl',
  Lcl = 'lcl',
  BreakBulk = 'break bulk',
  Roro = 'ro-ro'
}

enum FreightTypes {
  Import = 'IMPORT FREIGHT',
  Export = 'EXPORT FREIGHT'
}

const enum ID_CARGO_CONTRACTING_TYPE {
  FCL = 1,
  LCL = 2,
  BREAK_BULK = 3,
  RO_RO = 4
}

export {
  ModalTypes,
  OrderTypes,
  BusinessPartnerTypes,
  TariffTypes,
  OriginDestinyTypes,
  TxChargeTypes,
  IconTypes,
  AcitivityTypes,
  OperationTypes,
  LocaleTypes,
  ProfitsPercentsTypes,
  ProposalTypes,
  IncotermTypes,
  SpecificationsType,
  FreightTypes,
  ServiceTypes,
  IdProposalTypes,
  ID_CARGO_CONTRACTING_TYPE
}
