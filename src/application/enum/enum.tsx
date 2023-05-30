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

export { ModalTypes, OrderTypes, BusinessPartnerTypes, TariffTypes, OriginDestinyTypes }
