
const getModalFilter = (quickFilterList): string => {
  const modalFilter = quickFilterList.find((item) => item.type === 'modal')
  let type: string = ''
  if (modalFilter !== undefined) {
    switch (modalFilter.status) {
      case 'Aéreo':
        type = 'AIR'
        break
      case 'Marítimo':
        type = 'SEA'
        break
      case 'Rodoviário':
        type = 'LAND'
        break
      default:
        break
    }
  }
  return type
}

const getActivityFilter = (quickFilterList): string => {
  const activityFilter = quickFilterList.find((item) => item.type === 'activity')
  let type: string = ''
  if (activityFilter !== undefined) {
    switch (activityFilter.status) {
      case 'Importação':
        type = 'IMPORT'
        break
      case 'Exportação':
        type = 'EXPORT'
        break
      default:
        break
    }
  }
  return type
}

const getValidityFilter = (quickFilterList): string => {
  const validityFilter = quickFilterList
    .find((item) => item.type === 'warn' || item.type === 'main')
  let type: string = 'VALID'
  if (validityFilter !== undefined) {
    switch (validityFilter.status) {
      case 'Vencimento próximo':
        type = 'CLOSE_TO_VALIDITY'
        break
      case 'Vencidas':
        type = 'EXPIRED'
        break
      default:
        break
    }
  }
  return type
}

export { getValidityFilter, getActivityFilter, getModalFilter }
