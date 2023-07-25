import styled from 'styled-components'
import { FormLabel, Button } from '@material-ui/core'
import NumberFormat from 'react-number-format'

const NumberInput = styled(NumberFormat)`
  & .MuiOutlinedInput-marginDense input {
    height: 20px;
  }
`

const FormLabelInner = styled(FormLabel)`
  color: #000000!important;
  font-weight: bold!important;
  letter: 2%!important;
  font-size: 18px!important;
`

const ButtonInner = styled(Button)`
  margin-top: 15px!important;
`

export {
  NumberInput,
  FormLabelInner,
  ButtonInner
}
