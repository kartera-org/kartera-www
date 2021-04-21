import React, { useEffect, useState } from "react";
import { BigNumber } from "bignumber.js";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { TextField } from '@material-ui/core';
import Button from "components/SmallButton";
import WalletButton from "components/WalletButton";
import styled from "styled-components";
import MessageModal from "components/MessageModal";
import copy from 'assets/copy.png';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import useKartera from "hooks/useKartera";
import useBaskets from "hooks/useBaskets";
import useFarm from "hooks/useFarm";
import { useWeb3React } from '@web3-react/core';

import CircularProgress from '@material-ui/core/CircularProgress';

import getIcon from "components/Icons";
import { numberWithCommas, formatDollar, displayAddress } from "utils/formatting";


const Farm: React.FC = () => {

    const web3context = useWeb3React();
    const { active } = web3context;

    const {userBalance, ethBalance, accAddress, karteraFarmBalance} = useKartera();
    const { baskets } = useBaskets();
    const {kFarmUserBalance, kFarmBasketBalance, kFarmTotalSupply, bFarmBasketBalance, bFarmUserDeposits, bFarmUserRewards, txAddress, txMessage, processingTx, depositBasketTokens, withdrawBasketTokens, withdrawAllBasketTokens, collectBasketFarmRewards, depositKartTokens, withdrawKartTokens, unsetTxMessage} = useFarm();
    const [ messageModalState, setMessageModalState] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalHeader, setModalHeader] = useState('');
    const [modalLink, setModalLink] = useState('');

    const [selectedTokenIndx, setSelectedTokenIndx] = useState<number>(-1);
    const [numberOfBasketTokens, setNumberOfBasketTokens] = useState<string>("");
    const [numberOfKarteraTokens, setNumberOfKarteraTokens] = useState<string>("");

    const closeMessageModal = ()=>{
        setMessageModalState(false);
    }

    const handleBasketDeposit = () => {
        setModalLink("");
        let basketaddr = '';
        let tokenaddr = '';
        let amount = '';
        if(!baskets){
            setModalHeader("Error");
            setModalMessage("Unable to deposit tokens, error retreiving baskets.");
            setMessageModalState(true);
            return;
        }
        
        if(!depositBasketTokens){
            setModalHeader("Error");
            setModalMessage("Unable to deposit tokens.");
            setMessageModalState(true);
            return;
        }
        let isLessThanMax = new BigNumber(numberOfBasketTokens).lte(new BigNumber(baskets[0].userBalance));
        if(parseFloat(numberOfBasketTokens)<=0 || !isLessThanMax){
            setModalHeader("Error");
            setModalMessage("Unable to deposit tokens, # of token should be >0 and <= wallet balance.");
            setMessageModalState(true);
            setNumberOfBasketTokens("");
            return;
        }
        setModalHeader("Message");
        setModalMessage("Processing deposit, please wait");
        setMessageModalState(true);

        try{
            basketaddr = baskets[0].address;
            amount = ethers.utils.parseEther(numberOfBasketTokens).toString();
            depositBasketTokens(basketaddr, amount);
        } catch (e) {
            setModalHeader("Message");
            setModalMessage("Something went wrong, transaction failed.");
            setMessageModalState(true);
        }
        setNumberOfBasketTokens("");

    }

    const handleBasketWithdraw = () => {
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
        
        if(!withdrawBasketTokens){
            setModalHeader("Error");
            setModalMessage("Unable to withdraw tokens.");
            setMessageModalState(true);
            return;
        }
        let isLessThanMax = new BigNumber(numberOfBasketTokens).lte(new BigNumber(bFarmUserDeposits));
        if(parseFloat(numberOfBasketTokens)<=0 || !isLessThanMax){
            setModalHeader("Error");
            setModalMessage("Unable to withdraw tokens, # of token should be >0 and <= wallet balance.");
            setMessageModalState(true);
            setNumberOfBasketTokens("");
            return;
        }
        setModalHeader("Message");
        setModalMessage("Processing withdraw, please wait");
        setMessageModalState(true);

        try{
            basketaddr = baskets[0].address;
            amount = ethers.utils.parseEther(numberOfBasketTokens).toString();
            withdrawBasketTokens(basketaddr, amount);
        } catch (e) {
            setModalHeader("Error");
            setModalMessage("Something went wrong, transaction failed.");
            setMessageModalState(true);
        }
        setNumberOfBasketTokens("");
    }

    const handleBasketWithdrawAll = () => {
        setModalLink("");
        let basketaddr = '';
        if(!baskets){
            setModalHeader("Error");
            setModalMessage("Unable to withdraw tokens, error retreiving baskets.");
            setMessageModalState(true);
            return;
        }
        if(!withdrawAllBasketTokens){
            setModalHeader("Error");
            setModalMessage("Unable to withdraw tokens.");
            setMessageModalState(true);
            return;
        }
        setModalHeader("Message");
        setModalMessage("Processing withdraw, please wait");
        setMessageModalState(true);

        try{
            basketaddr = baskets[0].address;
            withdrawAllBasketTokens(basketaddr);
        } catch (e) {
            setModalHeader("Error");
            setModalMessage("Something went wrong, transaction failed.");
            setMessageModalState(true);
        }
    }

    const handleCollectRewards = () => {
        setModalLink("");
        let basketaddr = '';
        if(!baskets){
            setModalHeader("Error");
            setModalMessage("Unable to collect rewards, error retreiving baskets.");
            setMessageModalState(true);
            return;
        }
        if(!collectBasketFarmRewards){
            setModalHeader("Error");
            setModalMessage("Unable to collect rewards.");
            setMessageModalState(true);
            return;
        }
        setModalHeader("Message");
        setModalMessage("Processing transaction, please wait");
        setMessageModalState(true);

        try{
            basketaddr = baskets[0].address;
            collectBasketFarmRewards(basketaddr);
        } catch (e) {
            setModalHeader("Error");
            setModalMessage("Something went wrong, transaction failed.");
            setMessageModalState(true);
        }
    }

    const handleKartDeposit = () => {
        setModalLink("");
        let basketaddr = '';
        let tokenaddr = '';
        let amount = '';
        setModalLink("");
        if(!baskets){
            setModalHeader("Error");
            setModalMessage("Unable to deposit tokens, error retreiving baskets.");
            setMessageModalState(true);
            return;
        }
        
        if(!depositKartTokens){
            setModalHeader("Error");
            setModalMessage("Unable to withdraw tokens.");
            setMessageModalState(true);
            return;
        }
        let isLessThanMax = new BigNumber(numberOfKarteraTokens).lte(new BigNumber(userBalance));
        if(parseFloat(numberOfKarteraTokens)<=0 || !isLessThanMax){
            setModalHeader("Error");
            setModalMessage("Unable to deposit tokens, # of token should be >0 and <= wallet balance.");
            setMessageModalState(true);
            setNumberOfKarteraTokens("");
            return;
        }
        setModalHeader("Message");
        setModalMessage("Processing deposit, please wait");
        setMessageModalState(true);

        try{
            basketaddr = baskets[0].address;
            amount = ethers.utils.parseEther(numberOfKarteraTokens).toString();
            depositKartTokens(amount);
        } catch (e) {
            setModalHeader("Error");
            setModalMessage("Something went wrong, transaction failed.");
            setMessageModalState(true);
        }
        setNumberOfKarteraTokens("");
    }

    const handleKartWithdraw = () => {
        setModalLink("");
        let basketaddr = '';
        let tokenaddr = '';
        let amount = '';
        setModalLink("");
        if(!baskets){
            setModalHeader("Error");
            setModalMessage("Unable to withdraw tokens, error retreiving baskets.");
            setMessageModalState(true);
            return;
        }
        
        if(!withdrawKartTokens){
            setModalHeader("Error");
            setModalMessage("Unable to withdraw tokens.");
            setMessageModalState(true);
            return;
        }
        let isLessThanMax = new BigNumber(numberOfKarteraTokens).lte(new BigNumber(kFarmUserBalance));
        if(parseFloat(numberOfKarteraTokens)<=0 || !isLessThanMax){
            setModalHeader("Error");
            setModalMessage("Unable to withdraw tokens, # of token should be >0 and <= wallet balance.");
            setMessageModalState(true);
            setNumberOfKarteraTokens("");
            return;
        }
        setModalHeader("Message");
        setModalMessage("Processing withdraw, please wait");
        setMessageModalState(true);

        try{
            basketaddr = baskets[0].address;
            amount = ethers.utils.parseEther(numberOfKarteraTokens).toString();
            withdrawKartTokens(amount);
        } catch (e) {
            setModalHeader("Error");
            setModalMessage("Something went wrong, transaction failed.");
            setMessageModalState(true);
        }
        setNumberOfKarteraTokens("");
    }

    const handleTextFieldB = (e:any) => {
        let validNumber = new RegExp(/^\d*\.?\d*$/);
        let onlyNums = numberOfBasketTokens;
        if (validNumber.test(e.target.value)) {
            onlyNums = e.target.value;
        }
        setNumberOfBasketTokens(onlyNums);
    }

    const handleTextFieldK = (e:any) => {
        let validNumber = new RegExp(/^\d*\.?\d*$/);
        let onlyNums = numberOfKarteraTokens;
        if (validNumber.test(e.target.value)) {
            onlyNums = e.target.value;
        }
        setNumberOfKarteraTokens(onlyNums);
    }

    const depositAllB = () => {
        if(baskets){
            setNumberOfBasketTokens(baskets[0].userBalance);
        }
    }

    const withdrawAllB = () => {
        setNumberOfBasketTokens(bFarmUserDeposits);
    }

    const depositAllK = () => {
        setNumberOfKarteraTokens(userBalance)
    }

    const withdrawAllK = () => {
        setNumberOfKarteraTokens(kFarmUserBalance)
    }

    const showInfoBox = () => {
        setMessageModalState(true);
        setModalHeader("Kartera Farms");
        setModalMessage("KART can be earned by locking basket tokens in the Basket Farm. Anyone holding KART tokens has a claim on swap fees and voting rights on governance proposals. Swap fees are collected by KART holders who have locked their tokens in the Kartera Farm.")
    }

    useEffect(()=>{
        if(txMessage!==''){
            setModalHeader("Transaction Message");
            setModalMessage(txMessage);
            setModalLink(txAddress);
            setMessageModalState(true);
            unsetTxMessage();
        }
    }, [txMessage, ethBalance, active])


    return (
        <FarmContainer>
        <MessageModal state={messageModalState} handleClose={closeMessageModal} message={modalMessage} header={modalHeader} link={modalLink}/>
        { !active?
            <>
            <Header>Connect wallet to lock tokens <sup><HelpOutlineIcon fontSize="small" onClick={()=>showInfoBox()}/></sup></Header>
            <br />
            
            <WalletButton large={true}/>
            </>
        :
        <>
            <Header>Kartera Farms<sup><HelpOutlineIcon fontSize="small" onClick={()=>showInfoBox()}/></sup></Header>
            <FarmCardContainer>

                <FarmCard>
                    <BlackText>Basket Farm</BlackText>
                    <BlackCaptionText>Lock basket tokens in farm to earn KART tokens. </BlackCaptionText>

                    <InputDiv>
                    <TextField variant='filled' label={`# tokens`} onChange={handleTextFieldB} autoComplete='off' value={parseFloat(numberOfBasketTokens)>0?numberOfBasketTokens:''}/>
                    </InputDiv>

                    <TokenInfoContainer>
                        <BlackItemText style={{fontWeight:500}}>Wallet Balance </BlackItemText>
                        <TokenRow>
                            <BlackItemText>{`${baskets?numberWithCommas(baskets[0].userBalance):0} ${baskets?baskets[0].symbol:''}`}</BlackItemText> &nbsp;
                            <MaxButton onClick={()=>{depositAllB()}}>Max</MaxButton>
                        </TokenRow>

                        <BlackItemText style={{fontWeight:500}}>Basket Farm </BlackItemText>
                        <TokenRow>
                            <BlackItemText>{`Locked: ${bFarmUserDeposits} ${baskets?baskets[0].symbol:''}`}</BlackItemText> &nbsp;
                            <MaxButton onClick={()=>{withdrawAllB()}}>Max</MaxButton>
                        </TokenRow>
                        <TokenRow>
                            <BlackItemText>{`Rewards: ${numberWithCommas(bFarmUserRewards)} KART`}</BlackItemText> &nbsp;
                        </TokenRow>
                    </TokenInfoContainer>

                    <ButtonGroup>
                        <Button text={"Deposit"} backgroundColor={"#2e6ad1"} onClick={()=>{handleBasketDeposit()}}/>
                        <Button text={"Withdraw"} backgroundColor={"#2e6ad1"} onClick={()=>{handleBasketWithdraw()}}/>
                    </ButtonGroup>

                    <ButtonGroup>
                        <Button text={"Collect"} backgroundColor={"#2e6ad1"} onClick={()=>{handleCollectRewards()}}/>
                        <Button text={"Withdraw All"} backgroundColor={"#2e6ad1"} onClick={()=>{handleBasketWithdrawAll()}}/>
                    </ButtonGroup>

                </FarmCard>
                <FarmCard>
                    <BlackText>Kartera Farm</BlackText>
                    <BlackCaptionText>Lock KART tokens in farm to earn 0.05% fom swap fees </BlackCaptionText>

                    <InputDiv>
                    <TextField variant='filled' label={`# tokens`} onChange={handleTextFieldK} autoComplete='off' value={parseFloat(numberOfKarteraTokens)>0?numberOfKarteraTokens:''}/>
                    </InputDiv>

                    <TokenInfoContainer>
                        <BlackItemText style={{fontWeight:500}}>Wallet Balance </BlackItemText>
                        <TokenRow>
                            <BlackItemText>{`${numberWithCommas(userBalance)} KART`}</BlackItemText> &nbsp;
                            <MaxButton onClick={()=>{depositAllK()}}>Max</MaxButton>
                        </TokenRow>

                        <TokenRow>
                            <BlackItemText>{`${numberWithCommas(kFarmUserBalance)} xKART`}</BlackItemText> &nbsp;
                            <MaxButton onClick={()=>{withdrawAllK()}}>Max</MaxButton>
                        </TokenRow>

                        <BlackItemText style={{fontWeight:500}}>Kartera Farm </BlackItemText>

                        <TokenRow>
                            <BlackItemText>{`Total Supply: ${numberWithCommas(kFarmTotalSupply)} xKART`}</BlackItemText> &nbsp;
                        </TokenRow>

                        <TokenRow>
                            <BlackItemText>{`Total Locked: ${numberWithCommas(karteraFarmBalance)} KART`}</BlackItemText> &nbsp;
                        </TokenRow>

                        <TokenRow>
                            <BlackItemText>{`Basket Earnings: ${numberWithCommas(kFarmBasketBalance)} kETH`}</BlackItemText> &nbsp;
                        </TokenRow>

                    </TokenInfoContainer>

                    <ButtonGroup>
                        <Button text={"Deposit"} backgroundColor={"#2e6ad1"} onClick={()=>{handleKartDeposit()}}/>
                        <Button text={"Withdraw"} backgroundColor={"#2e6ad1"} onClick={()=>{handleKartWithdraw()}}/>
                    </ButtonGroup>

                </FarmCard>
            </FarmCardContainer>

            <AccountInfoContainer>
                <Text style={{fontWeight:500}}>Wallet Balance </Text>
                <TokenRow>
                    <Text>{`${numberWithCommas(ethBalance)} ETH`}</Text> &nbsp;
                </TokenRow>
                <ContractAddressContainer>
                    <Link to={{pathname:`https://etherscan.io/address/${accAddress}`}} target="_blank" style={{textDecoration:'none', color:"white"}}>
                    {`${displayAddress(accAddress)}`} </Link> &nbsp;
                    <img src={copy} alt="copy" width="20px" style={{cursor:"pointer"}} onClick={()=>{navigator.clipboard.writeText(accAddress)}}/>
                </ContractAddressContainer>

            </AccountInfoContainer>


        </>
        }
        </FarmContainer>
      );
    };

const FarmContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 81vh;
    color: white;
    @media (max-width: 770px){
        justify-content: center;
    }
`;

const FarmCardContainer = styled.div`
display: flex;
align-items: center;
justify-content: center;
color: white;
@media (max-width: 770px){
    flex-direction: column;
    justify-content: center;
    width: 85%;
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

const FarmCard = styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 25px;
    min-height: 250px;
    padding: 20px;
    min-width:250px;
    height: 425px;
    margin: 1% 7%;
    @media (max-width: 770px){
        padding: 5%;
        height: 525px;
    }
`;

const BlackText = styled.div`
    font-size: 20px;
    font-weight: 400;
    color: black;
`;

const BlackCaptionText = styled.div`
    font-size: 12px;
    font-weight: 250;
    color: black;
    flex-wrap: wrap;
`;

const BlackItemText = styled.div`
    font-size: 14px;
    font-weight: 400;
    color: black;
    margin: 7px 0;
`;

const ButtonGroup = styled.div`
    display:flex;
    justify-content: space-between;
    @media (max-width: 770px){
        flex-direction: column;
        align-items: center;
    }
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

const AccountInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
    margin: 1%;
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

const Text = styled.div`
    font-size: max(min(3.5vw, 18px), 16px);
    font-weight: 300;
    color: white;
    margin: 5px 0;
`;


export default Farm;