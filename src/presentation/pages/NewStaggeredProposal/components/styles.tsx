import styled from 'styled-components'
import { FormLabel, Button } from '@material-ui/core'
import NumberFormat from 'react-number-format'

const NumberInput = styled(NumberFormat)`
  & .MuiOutlinedInput-marginDense input {
    height: 20px;
  }
`

const FormLabelHeader = styled(FormLabel)`
  color: #545454!important;
  font-weight: 400!important;
  letter: 2%!important;
  font-size: 14px!important;
  text-align: ${(props) => (props.center ? 'center' : 'left')};
  
`

const FormLabelInner = styled(FormLabel)`
  color: #222222!important;
  font-weight: 500!important;
  letter: 2%!important;
  font-size: 16px!important;
  text-align: ${(props) => (props.center ? 'center' : 'left')};
`

const ButtonInner = styled(Button)`
  margin-top: 15px!important;
`

export {
  NumberInput,
  FormLabelHeader,
  FormLabelInner,
  ButtonInner
}
