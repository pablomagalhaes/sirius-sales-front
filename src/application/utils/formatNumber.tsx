const rightToLeftFormatter = (value: string, decimal: number): string => {
  if (Number(value) === 0) return ''

  let amount = ''
  if (amount.length > decimal) {
    amount = parseInt(value).toFixed(decimal)
  } else {
    amount = (parseInt(value) / 10 ** decimal).toFixed(decimal)
  }

  return String(amount).replace('.', ',')
}

const convertNumberToString = (value: number | undefined): string => {
  if(value !== null) return String(value?.toFixed(2)).replace('.', ',')
  return null
}

const convertStringToNumber = (value: string | undefined): number => {
  if(value !== null) return Number(value?.replace(',', '.'))
  return null
}

const FormatNumber = {
  rightToLeftFormatter,
  convertNumberToString,
  convertStringToNumber
}

export default FormatNumber
