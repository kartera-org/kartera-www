import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { TextField } from '@material-ui/core';
import Button from "components/Button";
import styled from "styled-components";
import MessageModal from "components/MessageModal";
import ConstituentsModal from "components/ConstituentsModal";
import copy from 'assets/copy.png';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import useBaskets from "hooks/useBaskets";
import { MakeDeposit } from "contexts/Basket/baskets";

import CircularProgress from '@material-ui/core/CircularProgress';

import getIcon from "components/Icons";
// import eth from "assets/images/eth.png";
// import link from "assets/images/link.png";
// import wbtc from "assets/images/wbtc.png";
// import uni from "assets/images/uni.png";
// import aave from "assets/images/aave.png";
// import snx from "assets/images/snx.png";
// import mkr from "assets/images/mkr.png";

const Basket: React.FC = () => {

    const { baskets, deposit, withdraw, txMessage, processingTx, unsetTxMessage } = useBaskets();
    const [ constituentModalState, setConstituentModalState ] = useState(false);
    const [ messageModalState, setMessageModalState] = useState(false);

    const [modalMessage, setModalMessage] = useState('');
    const [modalHeader, setModalHeader] = useState('');

    const [selectedTokenIndx, setSelectedTokenIndx] = useState<number>(-1);
    const [numberOfTokens, setNumberOfTokens] = useState<number>(-1);

    const handleClose = ()=>{
        setConstituentModalState(false);
    }
    const closeMessageModal = ()=>{
        setMessageModalState(false);
    }

    const handleSelectToken = (indx:number)=>{
        setSelectedTokenIndx(indx);
    }

    function handleTextField(e:any){
        let validNumber = new RegExp(/^\d*\.?\d*$/);
        let onlyNums = numberOfTokens;
        if (validNumber.test(e.target.value)) {
            onlyNums = e.target.value;
        }
        setNumberOfTokens(onlyNums);
    }

    function handleDeposit() {
        let basketaddr = '';
        let tokenaddr = '';
        let amount = '';
        
        if(!deposit){
            setModalHeader("Error");
            setModalMessage("Unable to deposit tokens.");
            setMessageModalState(true);
            return;
        }
        if(!baskets || !baskets[0].constituents){
            setModalHeader("Error");
            setModalMessage("Unable to deposit tokens, error retreiving baskets.");
            setMessageModalState(true);
            return;
        }
        if(selectedTokenIndx<0){
            setModalHeader("Error");
            setModalMessage("Unable to deposit tokens, please select token.");
            setMessageModalState(true);
            return;
        }

        if(numberOfTokens<=0){
            setModalHeader("Error");
            setModalMessage("Unable to deposit tokens, # of token should be >0.");
            setMessageModalState(true);
            return;
        }
        setModalHeader("Message");
        setModalMessage("Processing deposit, please wait");
        setMessageModalState(true);
        try{
            basketaddr = baskets[0].address;
            tokenaddr = baskets[0].constituents[selectedTokenIndx].address;
            amount = ethers.utils.parseEther(numberOfTokens.toString()).toString();
            deposit(basketaddr, tokenaddr, amount);
        } catch (e) {
            setModalHeader("Message");
            setModalMessage("Something went wrong, transaction failed.");
            setMessageModalState(true);
        }
        setNumberOfTokens(-1);
    }

    function handleWithdraw() {
        let basketaddr = '';
        let tokenaddr = '';
        let amount = '';
        
        if(!withdraw){
            setModalHeader("Error");
            setModalMessage("Unable to deposit tokens.");
            setMessageModalState(true);
            return;
        }
        if(!baskets || !baskets[0].constituents){
            setModalHeader("Error");
            setModalMessage("Unable to deposit tokens, error retreiving baskets.");
            setMessageModalState(true);
            return;
        }
        if(selectedTokenIndx<0){
            setModalHeader("Error");
            setModalMessage("Unable to deposit tokens, please select token.");
            setMessageModalState(true);
            return;
        }

        if(numberOfTokens<=0){
            setModalHeader("Error");
            setModalMessage("Unable to deposit tokens, # of token should be >0.");
            setMessageModalState(true);
            return;
        }
        setModalHeader("Message");
        setModalMessage("Processing deposit, please wait");
        setMessageModalState(true);
        try{
            basketaddr = baskets[0].address;
            tokenaddr = baskets[0].constituents[selectedTokenIndx].address;
            amount = ethers.utils.parseUnits(numberOfTokens.toString(), 18).toString();
            withdraw(basketaddr, tokenaddr, amount);
        } catch (e) {
            setModalHeader("Message");
            setModalMessage("Something went wrong, transaction failed.");
            setMessageModalState(true);
        }
        setNumberOfTokens(-1);

    }

    useEffect(()=>{
        if(txMessage!==''){
            setModalHeader("Transaction Message");
            setModalMessage(txMessage);
            setMessageModalState(true);
            unsetTxMessage();
        }
    }, [txMessage])

    const IconImage = ()=>{
        if(selectedTokenIndx>=0 && baskets && baskets[0].constituents){
            const icon = getIcon(baskets[0].constituents[selectedTokenIndx].symbol);
            return icon;
        }else{
            return null;
        }
    }

    return (
        <BasketContainer>
            {baskets?
            <>
            <MessageModal state={messageModalState} handleClose={closeMessageModal} message={modalMessage} header={modalHeader} />
            {baskets[0].constituents?
            <ConstituentsModal state={constituentModalState} handleClose={handleClose} handleSelectToken={handleSelectToken} constituents={baskets[0].constituents} />
            :<></>
            }
            <Header>{`${baskets[0].name} (${baskets[0].symbol})`}</Header>

            {/* <ContractAddressContainer>
                {baskets[0].address}&nbsp;
                <img src={copy} alt="copy" width="20px"/>
            </ContractAddressContainer> */}

            <AddLiquidityCard>
                <BlackText>Deposit Tokens</BlackText>

                <InputDiv>
                   <TextField variant='filled' label={`# tokens : 0.0`} onChange={handleTextField} autoComplete='off' value={numberOfTokens>-1?numberOfTokens:''}/>
                    <ChooseToken onClick={ ()=>{ setConstituentModalState(true)} } > 
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            {selectedTokenIndx>=0?
                                <img src={`${IconImage()}`} alt="icon" width="25px" /> 
                            :<></>}&nbsp;
                            {selectedTokenIndx>=0 && baskets[0].constituents? baskets[0].constituents[selectedTokenIndx].symbol : "Choose Token"}
                        </div>
                        <ExpandMoreIcon />
                    </ChooseToken>
                </InputDiv>

                <TokenActivityContainer>

                    <div style={{flex:1}}>
                    {selectedTokenIndx>=0 && baskets[0].constituents?
                        <>
                        <BlackItemText>{`Exchange Rate:  ${baskets[0].constituents[selectedTokenIndx].exchangeRate}`}</BlackItemText>
                        <BlackItemText>{`Wallet Balance: ${baskets[0].constituents[selectedTokenIndx].userBalance}`}</BlackItemText>
                        <BlackItemText>{`Basket Balance: ${baskets[0].constituents[selectedTokenIndx].basketBalance}`}</BlackItemText>
                        </>
                        :
                        <></>
                    }
                    </div>
                    <div style={{display:'flex', flexDirection:'column', flex:1, justifyContent:'center', alignItems:'center'}}>
                    {processingTx?
                        <>
                            <CircularProgress />
                            <div style={{color:"#000000"}}>Processing</div>
                        </>
                        :
                        <></>
                    }
                    </div>
                </TokenActivityContainer>

                <ButtonGroup>
                    <Button text={"Deposit"} onClick={()=>{handleDeposit()}}/>
                    <Button text={"Withdraw"} onClick={()=>{handleWithdraw()}}/>
                </ButtonGroup>
            </AddLiquidityCard>
            <BasketInfo>
                <Text>{`Basket Token Price: $${baskets[0].price}`}</Text>
                <Text>{`Basket Liquidity: $`}</Text>
                <Text>{`Wallet Balance: ${baskets[0].userBalance} kETH`}</Text>
            </BasketInfo>
            </>
            :
            'Connect wallet to view baskets'}
        </BasketContainer>
      );
    };

    const BasketContainer = styled.div`
        display: flex;
        flex-direction: column;
        padding-top: 50px;
        align-items: center;
        min-height: 100vh;
        background-image: linear-gradient(to bottom right, #150734, #28559A);
        color: white;
    `;

    const AddLiquidityCard = styled.div`
        display: flex;
        flex-direction: column;
        background-color: white;
        border-radius: 25px;
        min-height: 250px;
        padding: 20px;
        @media (max-width: 770px){
            padding: 5%;
        }
    `;

    const Header = styled.div`
        font-size: 30px;
        font-weight: 700;
        color: white;
        text-transform: uppercase;
        margin: 50px;
        @media (max-width: 770px){
            margin-top: 10px;
        }
    `;

    const ContractAddressContainer = styled.div`
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        font-weight: 500;
        color: white;
        margin: 10px;
    `;

    const TokenActivityContainer = styled.div`
        display: flex;
        justify-content: space-around;
        align-items: center;
    `;

    const Text = styled.div`
        font-size: min(max(3.5vw, 18px), 20px);
        font-weight: 400;
        color: white;
        margin: 5px 0;
    `;

    const BlackText = styled.div`
        font-size: 20px;
        font-weight: 400;
        color: black;
    `;

    const BlackItemText = styled.div`
        font-size: 16px;
        font-weight: 400;
        color: black;
        margin: 10px 0;
    `;

    const ChooseToken = styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #18273F;
        width: 35%;
        height: 30px;
        padding: 10px;
    `;

    const ButtonGroup = styled.div`
        display:flex;
        justify-content: center;
        @media (max-width: 770px){
            flex-direction: column;
            align-items: center;
        }
    `;

    const InputDiv = styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid lightgray;
        border-radius: 10px;
        padding: 10px;
        margin: 20px;
        @media (max-width: 770px){
            flex-direction: column;
        }
    `;

    const BasketInfo = styled.div`
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: center;
        margin: 50px 0;
        @media (max-width: 770px){
            padding: 10px;
        }
    `;



export default Basket;