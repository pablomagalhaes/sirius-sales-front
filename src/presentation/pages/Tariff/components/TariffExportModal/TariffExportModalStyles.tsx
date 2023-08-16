import styled from 'styled-components'
import { Box } from '@material-ui/core'

styled(Box)`
  position: absolute;
  top: 13px;
  left: 171px;
  background: white;
`

export const ModalDiv = styled.div`
  background-color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.backgroundColor};
  border-radius: 4px;
  width: 412px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  outline: none;
`

export const MainDiv = styled.div`
  padding: 0 20px;

  .MuiGrid-spacing-xs-2 {
    margin: 0;
  }

  .MuiTypography-root {
    color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.subtitle};
    margin-left: 5px;
  }

  .MuiTypography-root{
  line-height: 21px !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  letter-spacing: 2% !important;
  }
`

export const ButtonDiv = styled.div`
  margin-top: 30px;
  margin-bottom: 5px;
  display: flex;
  justify-content: left;
  width: 100%;
  button {
    border: 0px !important;
  }
`

export const Message = styled.div`
  color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.subtitle};
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.02em;
  font-weight: normal;
  margin-bottom: 25px;
`

export const ExportDiv = styled.div`
  background-color: ${(props: any) => props.theme?.commercial?.components?.costTable?.backgroundColor};
  padding: 20px;
  
  .MuiGrid-root{
  line-height: 21px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  letter-spacing: 2% !important;
  }
`
