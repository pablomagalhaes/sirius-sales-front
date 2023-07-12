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

const convertNumberToString = (value: number | undefined | null): string | null => {
  if (value !== null && value !== undefined) return String(value?.toFixed(2)).replace('.', ',')
  return null
}

const convertStringToNumber = (value: string | undefined | null): number | null => {
  if (value !== null && value !== undefined) return Number(value?.replace(',', '.'))
  return null
}

const FormatNumber = {
  rightToLeftFormatter,
  convertNumberToString,
  convertStringToNumber
}

export default FormatNumber
