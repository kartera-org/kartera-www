import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BigNumber } from "bignumber.js";
import { ethers } from "ethers";
import { TextField } from '@material-ui/core';
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle';
import Button from "components/Button";
import styled from "styled-components";
import MessageModal from "components/MessageModal";
import ConfirmMessageModal from "components/ConfirmMessageModal";
import ConstituentsModal from "components/ConstituentsModal";
import copy from 'assets/copy.png';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import useKartera from "hooks/useKartera";
import useBaskets from "hooks/useBaskets";

import getIcon from "components/Icons";
import { numberWithCommas, displayAddress } from "utils/formatting";

import { useWeb3React } from '@web3-react/core';
import WalletButton from "components/WalletButton"

const Basket: React.FC = () => {

    const web3context = useWeb3React();
    const { active } = web3context;

    const {userBalance, ethBalance, accAddress} = useKartera();
    const { baskets, deposit, withdraw, txAddress, txMessage, processingTx, unsetTxMessage } = useBaskets();
    const [ constituentModalState, setConstituentModalState ] = useState(false);
    const [ messageModalState, setMessageModalState] = useState(false);

    const [modalMessage, setModalMessage] = useState('');
    const [modalHeader, setModalHeader] = useState('');
    const [modalLink, setModalLink] = useState('');

    const [confirmModalState, setConfirmModalState] = useState(false);
    const [confirmModalHeader, setConfirmModalHeader] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    const [selectedTokenIndx, setSelectedTokenIndx] = useState<number>(-1);
    const [numberOfTokens, setNumberOfTokens] = useState<string>('');

    const [infoBox, setInfoBox] = useState(false);

    const handleClose = ()=>{
        setConstituentModalState(false);
    }
    const closeMessageModal = ()=>{
        setMessageModalState(false);
    }
    const closeConfirmModal = () => {
        setConfirmModalState(false);
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

    const getTokenSymbol = () => {
        try{
            if(selectedTokenIndx>=0 && baskets){
                return baskets[0].constituents[selectedTokenIndx].symbol.toUpperCase()
            }else{
                return "Choose Token";
            }
        }catch(e){
            return "Choose Token";
        }
    }

    const IconImage = ()=>{
        if(selectedTokenIndx>=0 && baskets && baskets[0].constituents){
            try{
                const icon = getIcon(baskets[0].constituents[selectedTokenIndx].symbol);
                return icon;
            }catch(e){
                return null;
            }
        }else{
            return null;
        }
    }

    const depositAll = () => {
        if(baskets){
            setNumberOfTokens(baskets[0].constituents[selectedTokenIndx].userBalance)
        }
    }

    const withdrawAll = () => {
        if(baskets){
            setNumberOfTokens(baskets[0].userBalance)
        }
    }

    function handleDeposit() {
        setModalLink("");
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
        let isLessThanMax = new BigNumber(numberOfTokens).lte(new BigNumber(baskets[0].constituents[selectedTokenIndx].userBalance));
        if(parseFloat(numberOfTokens)<=0 || !isLessThanMax){
            setModalHeader("Error");
            setModalMessage("Unable to deposit tokens, # of token should be >0 and <= wallet balance.");
            setMessageModalState(true);
            setNumberOfTokens("");
            return;
        }
        setModalHeader("Message");
        setModalMessage("Processing deposit, please wait");
        setMessageModalState(true);
        try{
            basketaddr = baskets[0].address;
            tokenaddr = baskets[0].constituents[selectedTokenIndx].address;
            amount = ethers.utils.parseUnits(numberOfTokens, baskets[0].constituents[selectedTokenIndx].decimals).toString();
            deposit(basketaddr, tokenaddr, amount);
        } catch (e) {
            setModalHeader("Message");
            setModalMessage("Something went wrong, transaction failed.");
            setMessageModalState(true);
        }
        setNumberOfTokens("");
    }

    function confirmWithdraw() {

        setModalLink("");
        let basketaddr = '';
        let tokenaddr = '';
        let amount = '';
        
        if(!baskets){
            setModalHeader("Error");
            setModalMessage("Unable to withdraw tokens, error retreiving baskets.");
            setMessageModalState(true);
            return;
        }
        if(selectedTokenIndx<0){
            setModalHeader("Error");
            setModalMessage("Unable to withdraw tokens, please select token.");
            setMessageModalState(true);
            return;
        }
        let bgNtokens = new BigNumber(numberOfTokens);
        let isLessThanMax = bgNtokens.isLessThanOrEqualTo(baskets[0].userBalance)
        if(parseFloat(numberOfTokens)<=0 || !isLessThanMax){
            setModalHeader("Error");
            setModalMessage("Unable to withdraw tokens, # of token should be >0 and <= wallet balance.");
            setMessageModalState(true);
            return;
        }
        let returnedTkns = bgNtokens.div(new BigNumber(baskets[0].constituents[selectedTokenIndx].exchangeRate));
        let incentiveTokensReturned = bgNtokens.times(baskets[0].withdrawCost);

        if(incentiveTokensReturned.isGreaterThan(userBalance)){
            setModalHeader("Error");
            setModalMessage("You do not have enough KART balance to pay withdrawal fees. To earn KART lock your kETH in basket farm.");
            setMessageModalState(true);
            return;
        }
        setConfirmModalHeader("Confirm Withdraw");
        let msg = `Exchanging: ${numberOfTokens} kETH ${"\n\n"} Receiving: ${returnedTkns} ${baskets[0].constituents[selectedTokenIndx].symbol}.${"\n\n"} Withdraw Fee: ${incentiveTokensReturned} KART`;
        setConfirmModalMessage(msg);
        setConfirmModalState(true);
    }

    function handleWithdraw() {
        setConfirmModalState(false);
        if(!baskets){
            setModalHeader("Error");
            setModalMessage("Unable to withdraw tokens, error retreiving baskets.");
            setMessageModalState(true);
            return;
        }
        if(!withdraw){
            setModalHeader("Error");
            setModalMessage("Unable to withdraw tokens.");
            setMessageModalState(true);
            return;
        }
        setModalHeader("Message");
        setModalMessage("Processing withdrawal, please wait");
        setMessageModalState(true);
        try{
            let basketaddr = baskets[0].address;
            let tokenaddr = baskets[0].constituents[selectedTokenIndx].address;
            let amount = ethers.utils.parseUnits(numberOfTokens, 18).toString();
            withdraw(basketaddr, tokenaddr, amount);
        } catch (e) {
            setModalHeader("Message");
            setModalMessage("Something went wrong, transaction failed.");
            setMessageModalState(true);
        }
        setNumberOfTokens("");

    }

    const getBasketLiq = () => {
        if(baskets){
            let x = parseFloat(baskets[0].price) * parseFloat(baskets[0].totalSupply);
            let ts = numberWithCommas(x.toFixed(4));
            return(ts);                        
        }
    }

    const showInfoBox = () => {
        setMessageModalState(true);
        setModalHeader("Diversification-Kartera Baskets");
        setModalMessage(`When you deposit your tokens in a Kartera Basket you receive basket tokens equivalent to the deposited value. The basket is a diversified portfolio as its value is the combined value of all deposited tokens. ${"\n"}Kartera Basket also allows users to swap their tokens with any of its constituents for a small fee. This fee is added to the basket which increases the basket's value and therefore the value of the basket tokens associated with it. ${"\n"}You may withdraw tokens from the basket at anytime by returning your basket tokens. Withdrawal can be made in any available constituent tokens.`)
    }

    const showWithdrawCostInfo = () => {
        setMessageModalState(true);
        setModalHeader("Withdraw tokens from basket");
        setModalMessage("To withdraw deposits from the basket enter the number of kETH you wish to liquidate. The fee to withdraw from basket is 1 KART per $100 of liquidity withdrawn. KART tokens can be earned by locking kETH tokens in basket farm.")
    }

    useEffect(()=>{
        if(txMessage!==''){
            setModalHeader("Transaction Message");
            setModalLink(txAddress);
            setModalMessage(txMessage);
            setMessageModalState(true);
            unsetTxMessage();
        }
    }, [txMessage, ethBalance])

    return (
        <BasketContainer>
            <MessageModal state={messageModalState} handleClose={closeMessageModal} message={modalMessage} header={modalHeader} link={modalLink} />

            <ConfirmMessageModal state={confirmModalState} handleClose={closeConfirmModal} header={confirmModalHeader} message={confirmModalMessage} handleConfirm={handleWithdraw} />

            {
                
            
            !active?
            <>
                <Header>Connect wallet to diversify<sup><HelpOutlineIcon fontSize="small" onClick={()=>showInfoBox()}/></sup></Header>
                <br />
                
                <WalletButton large={true}/>
            </>
            :

            baskets?
            <>
            
            {baskets[0].constituents?
            <ConstituentsModal state={constituentModalState} handleClose={handleClose} handleSelectToken={handleSelectToken} constituents={baskets[0].constituents} />
            :<></>
            }
            <Header>{`${baskets[0].name} (${baskets[0].symbol})`}<sup><HelpOutlineIcon fontSize="small" onClick={()=>showInfoBox()}/></sup></Header>
            <AddLiquidityCard>
                <BlackText>Add Liquidity &amp; Receive kETH Tokens </BlackText>
                <BlackCaptionText>kETH is a diversified tokens that earns commissions from swap trades</BlackCaptionText>
                <InputDiv>
                   <TextField variant='filled' label={`# tokens : 0.0`} onChange={handleTextField} autoComplete='off' value={parseFloat(numberOfTokens)>=0?numberOfTokens:''}/>
                    <ChooseToken onClick={ ()=>{ setConstituentModalState(true)} } > 
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            {selectedTokenIndx>=0?
                                <img src={`${IconImage()}`} alt="icon" width="25px" /> 
                            :<></>}&nbsp;
                            {getTokenSymbol()}
                        </div>
                        <ExpandMoreIcon />
                    </ChooseToken>
                </InputDiv>

                <TokenActivityContainer>

                    <div style={{flex:2}}>
                    {selectedTokenIndx>=0 ?
                        <TokenInfoContainer>
                            <TokenRow>
                            <BlackItemText>{`Exchange Rate:  ${parseFloat(baskets[0].constituents[selectedTokenIndx].exchangeRate).toFixed(4)} ${baskets[0].symbol}/${baskets[0].constituents[selectedTokenIndx].symbol.toUpperCase()}`}</BlackItemText>
                            </TokenRow>
                            <BlackItemText style={{fontWeight:500}}>Wallet Balance </BlackItemText>
                            <TokenRow>
                                <BlackItemText>{`${numberWithCommas(baskets[0].constituents[selectedTokenIndx].userBalance)} ${baskets[0].constituents[selectedTokenIndx].symbol.toUpperCase()}`}</BlackItemText> &nbsp;
                                <MaxButton onClick={()=>{depositAll()}}>Max</MaxButton>
                            </TokenRow>
                            <TokenRow>
                                <BlackItemText>{`${numberWithCommas(baskets[0].userBalance)} kETH`}</BlackItemText> &nbsp;
                                <MaxButton onClick={()=>{withdrawAll()}}>Max</MaxButton>
                            </TokenRow>
                            <BlackItemText>{`${numberWithCommas(userBalance)} KART`}</BlackItemText>
                            {baskets[0].constituents[selectedTokenIndx].symbol.toUpperCase()!=="ETH"?
                            <BlackItemText>{`${numberWithCommas(ethBalance)} Eth`}</BlackItemText>
                            :<></>
                            }
                            <TokenRow>
                                <BlackItemText><Link to={{pathname:`https://etherscan.io/address/${accAddress}`}} target="_blank" style={{textDecoration:'none'}}>{displayAddress(accAddress)}</Link></BlackItemText>
                            </TokenRow>
                        </TokenInfoContainer>
                        :
                        <TokenInfoContainer>
                            <BlackItemText style={{fontWeight:500}}>Wallet Balance </BlackItemText>
                            <BlackItemText>{`${numberWithCommas(baskets[0].userBalance)} kETH`}</BlackItemText>
                            <BlackItemText>{`${numberWithCommas(userBalance)} KART`}</BlackItemText>
                            <BlackItemText>{`${numberWithCommas(ethBalance)} Eth`}</BlackItemText>
                            <TokenRow>
                                <BlackItemText><Link to={{pathname:`https://etherscan.io/address/${accAddress}`}} target="_blank" style={{textDecoration:'none'}}>{displayAddress(accAddress)}</Link></BlackItemText>
                            </TokenRow>
                        </TokenInfoContainer>
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
                    <Button text={"Withdraw"} onClick={()=>{confirmWithdraw()}}/>
                </ButtonGroup>
            </AddLiquidityCard>
            <BasketInfo>
                <Text>{`Basket Token Price: $${parseFloat(baskets[0].price).toFixed(4)}`}</Text>
                <Text>{`Basket Liquidity: $${getBasketLiq()}`}</Text>
                {
                    selectedTokenIndx>=0?
                    <Text>{`Basket Balance: ${numberWithCommas(baskets[0].constituents[selectedTokenIndx].basketBalance)} ${baskets[0].constituents[selectedTokenIndx].symbol.toUpperCase()}`}</Text>
                    :<></>
                }
                <Text>{`Withdraw Cost: ${numberWithCommas(baskets[0].withdrawCost)} KART/kETH`}<sup><HelpOutlineIcon fontSize="small" onClick={()=>showWithdrawCostInfo()}/></sup></Text>
                <ContractAddressContainer>
                <Link to={{pathname:`https://etherscan.io/address/${baskets[0].address}`}} target="_blank" style={{textDecoration:'none', color:"white"}}>
                    
                    {`${displayAddress(baskets[0].address)}`} </Link> &nbsp;
                    <img src={copy} alt="copy" width="20px" style={{cursor:"pointer"}} onClick={()=>{navigator.clipboard.writeText(baskets[0].address)}}/>
                </ContractAddressContainer>

            </BasketInfo>
            </>
            : <>
                <CircularProgress />
                <div>Please wait</div>
            </>
                
            }

        </BasketContainer>
      );
    };

const BasketContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 81vh;
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
    margin: 20px;
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
    font-size: 14px;
    font-weight: 400;
    color: black;
    margin: 7px 0;
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

const TokenInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 5px;
`;

const BalanceLabel = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: gray;
`;

const TokenRow = styled.div`
    display: flex;
    align-items: center;
`;

const MaxButton = styled.div`
    background-color: #eee;
    color: #bb44ee;
    padding: 5px;
    text-transform: uppercase;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
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


const BlackCaptionText = styled.div`
font-size: 12px;
font-weight: 250;
color: black;
`;


export default Basket;