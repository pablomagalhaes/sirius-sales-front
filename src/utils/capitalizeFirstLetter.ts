const capitalizeFirstLetter = (word: any): string => {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return word.charAt(0) + word.substring(1).toLowerCase()
  }
  export default capitalizeFirstLetter