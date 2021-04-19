import React from 'react';
import styled from "styled-components";
import { makeStyles } from '@material-ui/core/styles';
import {Modal, Typography} from '@material-ui/core';
import { ConstituentI } from 'contexts/Basket/types';
import getIcon from "components/Icons";

interface MessageModalI{
  header?:string;
  message?:string;
  state:boolean;
  handleClose(): void;
  handleSelectToken: any;
  constituents: ConstituentI[];
}

function rand(){
    return Math.round(Math.random() * 20) - 10;
  }
  
function getModalStyle() {
const top = 25;
const left = 50;
    
return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${50}%, -${50}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
    position: 'absolute',
    width: '75%',
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    },
}));

const ConstituentsModal=(props:MessageModalI)=>{
    const classes = useStyles();

    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const body = (
            <ModalBody>
                <BodyHeader>Select Token</BodyHeader>
                {props.constituents.map((item, index) => {
                return (
                  <BodyItem key={`menu${index}`} onClick={()=>{props.handleSelectToken(index); props.handleClose()}}>
                      <TokenContainer>
                        <img src={`${getIcon(item.symbol)}`} alt="" width="25px"/> &nbsp;
                        <BodyText>{`${item.name} (${item.symbol})`}</BodyText>
                    </TokenContainer>
                      <SelectButton>Select</SelectButton>
                  </BodyItem>
                )})}
            </ModalBody>
    );

    return (
        <Modal
            open={props.state}
            onClose={props.handleClose}
        >
        {body}
        </Modal>
    );
}

const ModalBody = styled.div`
    position: fixed;
    width: 600px;
    top: 50%;
    left: 50%;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transform: translate(-50%, -50%);
    @media (max-width: 770px){
        width: 75%;
    }
`;

const BodyHeader = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 2px solid black;
    font-size: 30px;
    font-weight:500;
`;

const BodyItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    border-top: 1px solid lightgray;
    &:hover{
        background-color: lightgray;
    }
`;

const TokenContainer = styled.div`
    display: flex;
    align-items: center;
`;

const BodyText = styled.div`
    font-size: 14px;
    font-weight: 400;
`;

const SelectButton = styled.div`
    display:flex;
    align-items: center;
    justify-content: center;
    padding: 7px;
    border-radius: 5px;
    background-color: #3778C2;
    color: white;
    cursor: pointer;
`;

export default ConstituentsModal;