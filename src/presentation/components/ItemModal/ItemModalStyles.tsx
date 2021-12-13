import styled from 'styled-components'
import { Select } from '@material-ui/core'

export const ModalDiv = styled.div`
background: #FFFFFF;
border-radius: 4px;
width: 545px;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
outline: none;
`
export const RowReverseDiv = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-self: flex-end;
  width: 100%;
  margin-right:35px;
`

export const Form = styled.div`
margin-top:26px;
margin-left:24px;
margin-right:30px;
font-family: DM Sans;
font-style: normal;
font-weight: normal;
font-size: 14px;
line-height: 150%;
letter-spacing: 0.02em;
color: #545454;
`
export const RowDiv = styled.div`
display: flex;
flex-direction:row;
margin-bottom:${(props: { margin: boolean }) => (props.margin) ? '24px' : '0px'};
`

export const Label = styled.span`
width:${(props) => props.width};
`

export const HeaderDiv = styled.div`
display:flex;
flex-direction:row;
align-items: center;
letter-spacing: 0.02em;
color: #222222;
width:100%;
font-family: DM Sans;
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 150%;
margin-top: 23px;
padding-bottom: 22px;
border-bottom: 1px solid #E5E5E5;
`
export const Title = styled.span`
margin-left: 24px;
width:70%;
`
export const StyledSelect = styled(Select)`
display: flex;
flex-direction: row;
align-items: center;
padding: 6px 8px 5px 16px;
background: #FFFFFF;
border: 1px solid #D9DCE6;
box-sizing: border-box;
border-radius: 4px;
width: 192px;
height: 32px;
margin-top:12px;

& .MuiSelect-root {
    font-family: DM Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 150%;
    etter-spacing: 0.02em;
    color: ${props => (props.placeholder) === '' ? '#999DAC' : '#222222'};
}

& .MuiSvgIcon-root {
  color: #545454;
  margin-right:5px;
}
`
export const Input = styled.input`
border: 1px solid #E5E5E5;
margin-top:12px;
box-sizing: border-box;
border-radius: 4px;
width:126px;
height:32px;
margin-left:21px;
font-family: DM Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 150%;
    etter-spacing: 0.02em;
    color: #222222;
`
export const MeasureInput = styled.input`
border: 1px solid #E5E5E5;
margin-top:12px;
box-sizing: border-box;
border-radius: 4px;
width:50px;
height:32px;
margin-right:${(props: { margin: boolean }) => (props.margin) ? '21px' : '0px'};
font-family: DM Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 150%;
    etter-spacing: 0.02em;
    color: #222222;
`
export const CheckBox = styled.input`
border: 2px solid #B5B8C2;
box-sizing: border-box;
border-radius: 2px;
margin-right:11px;
margin-top:15px;
`
export const CheckBoxLabel = styled.span`
color: #000000;
margin-right:11px;
margin-top:18px;
`
export const AlertIconDiv = styled.span`
margin-right:59px;
margin-top:18px;
`
export const ButtonDiv = styled.div`
margin-top:40px;
margin-bottom:40px;
`
