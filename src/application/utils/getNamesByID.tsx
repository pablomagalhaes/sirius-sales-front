function getTxCalculationTypeById (calculationTypes: any, id: number): string | null {
  const foundItem = calculationTypes?.find(item => item.idCalculationType === id)
  return foundItem?.txCalculationType
}

const GetNamesByID = {
  getTxCalculationTypeById
}

export default GetNamesByID
