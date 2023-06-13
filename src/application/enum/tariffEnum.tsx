enum SelectorsValuesTypes {
  Agent = 'businessPartnerAgent.simpleName',
  PartnerTransporter = 'businessPartnerTransporter.simpleName',
  Origin = 'origin',
  Destination = 'destination',
  CityOrigin = 'originCity.nameCity',
  CityDestination = 'destinationCity.nameCity',
  Validity = 'validityDate',
}

enum TariffItemsTypes {
  Vlgeneralded= 'VLGERALDED',
  Vlimoded = 'VLIMODED',
  Vlgeneralcons = 'VLGERALCONS',
  Vlimocons = 'VLIMOCONS',
  Minimun = 'MINIMUN',
  Vluntil7wm = 'VLATE7WM',
  Over = 'ACIMA',
  Vlcontainer20 = 'VLCONTAINER20',
  Vlcontainer40 = 'VLCONTAINER40',
  Until45 = 'UNTIL45KG',
  Until100 = 'UNTIL100KG',
  Until300 = 'UNTIL300KG',
  Until500 = 'UNTIL500KG',
  Until1000 = 'UNTIL1000KG'
}

enum QuickFilterTypes {
  Activity = 'activity',
  Modal = 'modal'
}

enum ValidityTypes {
  Expired = 'EXPIRED',
  CloseValidity = 'CLOSE_TO_VALIDITY',
  Valid = 'VALID'
}

enum ImportTariff {
  company = 'dsBusinessPartnerTransporter',
  agent = 'nmAgent',
  validity = 'validityDate',
  currency = 'currency'
}

export {
  SelectorsValuesTypes,
  TariffItemsTypes,
  QuickFilterTypes,
  ValidityTypes,
  ImportTariff
}
