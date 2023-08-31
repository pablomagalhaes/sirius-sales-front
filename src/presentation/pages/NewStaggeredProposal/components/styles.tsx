import styled from 'styled-components'
import { FormLabel, Button } from '@material-ui/core'
import NumberFormat from 'react-number-format'

const NumberInput = styled(NumberFormat)`
  & .MuiOutlinedInput-marginDense input {
    height: 20px;
  }
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

const RedText = styled.p`
font-family: DM Sans;
font-size: 16px;
color: #ff0000;
font-style: normal;
font-weight: 200;
text-align: left;
margin: 10px 50px 0px 0px;
`

export {
  NumberInput,
  FormLabelInner,
  ButtonInner,
  RedText
}
