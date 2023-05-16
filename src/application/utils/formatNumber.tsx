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

const convertNumberToString = (value: number): string => String(value.toFixed(2)).replace('.', ',')

const convertStringToNumber = (value: string): number => Number(value.replace(',', '.'))

const FormatNumber = {
  rightToLeftFormatter,
  convertNumberToString,
  convertStringToNumber
}

export default FormatNumber
