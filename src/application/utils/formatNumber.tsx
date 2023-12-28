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

const rightToLeftFormatterPercentage = (newValue: string, decimal: number): string => {
  let value = newValue
  if (Number(value) === 0) return ''
  if (value.length > 5) value = value.slice(0, -1)

  let amount = ''
  if (amount.length > decimal) {
    amount = parseInt(value).toFixed(decimal)
  } else {
    amount = (parseInt(value) / 10 ** decimal).toFixed(decimal)
  }

  return String(amount).replace('.', ',') + '%'
}

const convertNumberToString = (value: number | undefined | null): string | null => {
  if (value !== null && value !== undefined) return String(value?.toFixed(2)).replace('.', ',')
  return null
}

const convertStringToNumber = (value: string | undefined | null): number | null => {
  if (value !== null && value !== undefined) return Number(value?.replace(',', '.'))
  return null
}

const convertNumberWithInterCoin = (locale: string, currencyType: string, value: number): string | null => {
  return new Intl.NumberFormat(locale, { currency: currencyType, minimumFractionDigits: 2 }).format(value)
}

const convertNumberToDecimal = (value: number): number => {
  return Number(value.toFixed(2))
}

const convertNumberToStringWithReplaceComma = (value: string): string => {
  return String(value).replace(/,/g, '.')
}

const FormatNumber = {
  rightToLeftFormatter,
  convertNumberToString,
  convertStringToNumber,
  convertNumberWithInterCoin,
  convertNumberToDecimal,
  rightToLeftFormatterPercentage,
  convertNumberToStringWithReplaceComma
}

export default FormatNumber
