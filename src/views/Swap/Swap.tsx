import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { TextField } from '@material-ui/core';
import WalletButton from "components/WalletButton";
import styled from "styled-components";
import CustomModal from "components/CustomModal";
import MessageModal from "components/MessageModal";
import ConstituentsModal from "components/ConstituentsModal";
import copy from 'assets/copy.png';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import CircularProgress from '@material-ui/core/CircularProgress';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import getIcon from "components/Icons";
import { numberWithCommas, formatDollar, displayAddress } from "utils/formatting"

import useBaskets from "hooks/useBaskets";
import useKartera from "hooks/useKartera";
import { useWeb3React } from '@web3-react/core';

const Swap: React.FC = () => {

    const web3context = useWeb3React();
    const { active } = web3context;

    const { baskets, swap, swapRate, tradingAllowed, txAddress, txMessage, processingTx, unsetTxMessage } = useBaskets();
    const { ethBalance, accAddress } = useKartera();

    const [ messageModalState, setMessageModalState] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalHeader, setModalHeader] = useState('');
    const [modalLink, setModalLink] = useState('');

    const [ fromConstituentModalState, setFromConstituentModalState ] = useState(false);
    const [ toConstituentModalState, setToConstituentModalState ] = useState(false);

    const [selectedFromTokenIndx, setSelectedFromTokenIndx] = useState<number>(0);
    const [selectedToTokenIndx, setSelectedToTokenIndx] = useState<number>(-1);
    const [numberOfTokens, setNumberOfTokens] = useState<string>('');

    const [showSwapDetails, setShowSwapDetails] = useState(false);

    const [swapMessage, setSwapMessage] = useState("Select Token");
    const [showSwapButton, setShowSwapButton] = useState(false);

    const [exchangeRate, setExchangeRate] = useState('');
    const [tokensReceived, setTokensReceived] = useState<number>(-1);

    const [cmState, setCMState] = useState(false);
    const [cmHeader, setCMHeader] = useState("Message");
    const [cmMessage, setCMMessge] = useState("This is a test message.")

    const [fromBalance, setFromBalance] = useState('');
    const [toBalance, setToBalance] = useState('');

    const closeCMModal = ()=>{
        setCMState(false);
    }

    const closeMessageModal = ()=>{
        setMessageModalState(false);
    }

    const handleCloseFromConstituent = ()=>{
        setFromConstituentModalState(false);
    }

    const handleCloseToConstituent = ()=>{
        setToConstituentModalState(false);
    }

    const setBalances = (fromInd:any, toInd:any)=> {
        if(baskets){
            if(fromInd>=0){
                let bal = parseFloat(baskets[0].constituents[fromInd].userBalance).toFixed(4);
                setFromBalance(bal);
            }else{
                setFromBalance('');
            }

            if(toInd>=0){
                let bal = parseFloat(baskets[0].constituents[toInd].userBalance).toFixed(4);
                setToBalance(bal);
            }else{
                setToBalance('');
            }
        }
    }

    const handleSelectFromToken = (indx:number)=>{
        setSelectedFromTokenIndx(indx);
        setExchangeRate('');
        updateSwapButtonAndMessage(numberOfTokens, indx, selectedToTokenIndx);
        setBalances(indx, selectedToTokenIndx);
    }

    const handleSelectToToken = (indx:number)=>{
        setSelectedToTokenIndx(indx);
        setExchangeRate('');
        updateSwapButtonAndMessage(numberOfTokens, selectedFromTokenIndx, indx);
        setBalances(selectedFromTokenIndx, indx);
    }

    function handleFromTextField(e:any){
        let validNumber = new RegExp(/^\d*\.?\d*$/);
        let onlyNums = numberOfTokens;
        if (validNumber.test(e.target.value)) {
            onlyNums = e.target.value;
        }
        setNumberOfTokens(onlyNums);
        updateSwapButtonAndMessage(onlyNums, selectedFromTokenIndx, selectedToTokenIndx);
    }

    const FromIconImage = ()=>{
        if(selectedFromTokenIndx>=0 && baskets ){
            try{
                const icon = getIcon(baskets[0].constituents[selectedFromTokenIndx].symbol);
                return icon;
            }catch(e){
                return null;
            }
        }else{
            return null;
        }
    }

    const ToIconImage = ()=>{
        if(selectedToTokenIndx>=0 && baskets){
            try{
                const icon = getIcon(baskets[0].constituents[selectedToTokenIndx].symbol);
                return icon;
            }catch(e){
                return null;
            }
        }else{
            return null;
        }
    }

    const switchTokens = ()=> {
        let selectedFromid = selectedFromTokenIndx;
        let selectedToid = selectedToTokenIndx;
        setSelectedFromTokenIndx(selectedToTokenIndx);
        setSelectedToTokenIndx(selectedFromid);
        updateSwapButtonAndMessage(numberOfTokens, selectedToid, selectedFromid);
        setBalances(selectedToid, selectedFromid);
    }

    const updateSwapButtonAndMessage = async (numOfTokens:string, fromInd:any, toInd:any)=> {
        let exrate:number = 0;
        if(baskets && swapRate && fromInd>=0 && toInd>=0){
            let rate = await swapRate(baskets[0].address, baskets[0].constituents[fromInd].address, baskets[0].constituents[toInd].address);
            let formattedRate = ethers.utils.formatUnits(rate, baskets[0].constituents[toInd].decimals);
            exrate = parseFloat(formattedRate);
            formattedRate = exrate.toFixed(4);
            setExchangeRate(formattedRate);
        } else {
            setExchangeRate('');
        }
        let ntkns = parseFloat(numOfTokens);

        if(fromInd<0 || toInd<0 || fromInd==toInd) {
            setShowSwapButton(false);
            setSwapMessage("Select Token");
            return;
        }
        if(!ntkns || ntkns<=0) {
            setShowSwapButton(false);
            setSwapMessage("Enter Amount");
            return;
        }

        if(ntkns && ntkns>0){
            if(fromInd>=0 && toInd>=0){
                setShowSwapButton(true);
                setShowSwapDetails(true);
                let tokensReceived = exrate*ntkns;
                setTokensReceived(tokensReceived);
            } else {
                setShowSwapButton(false);
                setShowSwapDetails(false);
                setTokensReceived(0);
            }
        } else {
            setShowSwapButton(false);
            setShowSwapDetails(false);
            setTokensReceived(0);
        }
        if(processingTx){
            setShowSwapButton(true);
        }
    }

    const swapAllTokens = ()=> {
        if(baskets && selectedFromTokenIndx>=0){
            let n:string = baskets[0].constituents[selectedFromTokenIndx].userBalance;
            setNumberOfTokens(n);
            updateSwapButtonAndMessage(n, selectedFromTokenIndx, selectedToTokenIndx);
        }
    }

    const handleSwap = ()=> {
        let basketaddr = '';
        let fromtokenaddr = '';
        let totokenaddr = '';
        let amount = '';
        setModalLink("");

        if(!swap || !tradingAllowed){
            setModalHeader("Error");
            setModalMessage("Unable to swap tokens.");
            setMessageModalState(true);
            return;
        }
        if(!baskets){
            setModalHeader("Error");
            setModalMessage("Swap not available");
            setMessageModalState(true);
            return;
        }
        let swapAllowed = tradingAllowed(baskets[0].address);
        if(!swapAllowed) {
            setModalHeader("Error");
            setModalMessage("Swap transactions are not allowed at this time. Please try again later.");
            setMessageModalState(true);
            return;
        }
        if(selectedToTokenIndx<0){
            setModalHeader("Error");
            setModalMessage("Please select token.");
            setMessageModalState(true);
            return;
        }
        let ntkns = parseFloat(numberOfTokens);
        if(ntkns<=0 || ntkns > parseFloat(baskets[0].constituents[selectedFromTokenIndx].userBalance)){
            setModalHeader("Error");
            setModalMessage("# of token to swap should be >0 and <= wallet balance");
            setMessageModalState(true);
            return;
        }
        let x= tokensReceived * 100 / parseFloat(baskets[0].constituents[selectedToTokenIndx].basketBalance);
        if(x>10){
            setModalHeader("Error");
            setModalMessage("Swap exceeds maximum size allowed of 10% of token liquidity.");
            setMessageModalState(true);
            return;
        }
        setModalHeader("Message");
        setModalMessage("Processing swap, please wait");
        setMessageModalState(true);
        try{
            basketaddr = baskets[0].address;
            fromtokenaddr = baskets[0].constituents[selectedFromTokenIndx].address;
            totokenaddr = baskets[0].constituents[selectedToTokenIndx].address;
            let decimals = baskets[0].constituents[selectedFromTokenIndx].decimals;
            amount = ethers.utils.parseUnits(numberOfTokens.toString(), decimals).toString();
            swap(basketaddr, fromtokenaddr, totokenaddr, amount);
        } catch (e) {
            setModalHeader("Message");
            setModalMessage("Something went wrong, transaction failed.");
            setMessageModalState(true);
        }
        setNumberOfTokens('');
    }

    const showInfoBox = () => {
        setMessageModalState(true);
        setModalHeader("Swaps");
        setModalMessage("You may swap your tokens for any of the basket constituents. All swap trades happen at mid-market price from uniswap feed. Swapping at mid-market price is estimated to have savings enough to compensate for any gas cost associated with the transaction. A fee of 0.3% is applied to all trades that drain upto 1% of tokens from the basket. Fees go up linearly with every percent increase in trade size. Max trade size is capped at 10%. For more details on swap transaction fees please refer to contracts and documents.")
    }

    useEffect(()=>{
        if(txMessage!==''){
            setModalHeader("Transaction Message");
            setModalMessage(txMessage);
            setModalLink(txAddress);
            setMessageModalState(true);
            unsetTxMessage();
        }
        setBalances(selectedFromTokenIndx, selectedToTokenIndx);
    }, [txMessage, baskets])

    return (
        <SwapContainer>
            
            <>
            <CustomModal state ={cmState} message={cmMessage} header={cmHeader} handleClose={closeCMModal} />
            <MessageModal state={messageModalState} handleClose={closeMessageModal} message={modalMessage} header={modalHeader} link={modalLink} />
            {
            
            !active?
                <>
                <Header>Connect wallet to swap tokens<sup><HelpOutlineIcon fontSize="small" onClick={()=>showInfoBox()}/></sup></Header>
                <br />
                
                <WalletButton large={true}/>
                </>

            :

            baskets?
            <>
            <Header>{`Swap Tokens`}<sup><HelpOutlineIcon fontSize="small" onClick={()=>showInfoBox()}/></sup></Header>
            
            
            <ConstituentsModal state={fromConstituentModalState} handleClose={handleCloseFromConstituent} handleSelectToken={handleSelectFromToken} constituents={baskets[0].constituents} />
            
            <ConstituentsModal state={toConstituentModalState} handleClose={handleCloseToConstituent} handleSelectToken={handleSelectToToken} constituents={baskets[0].constituents} />

            <SwapCard>
                <BlackText>Swap</BlackText>
                <BlackCaptionText>Swaps trade at Uniswap mid market price.</BlackCaptionText>

                <InputDiv>
                   <TextField variant='filled' label={`# Tokens`} onChange={handleFromTextField} autoComplete='off' value={parseFloat(numberOfTokens)>-1?numberOfTokens:''}/>
                   <ChooseTokenContainer>
                       <BalanceLabel>{`Balance: ${fromBalance}`}</BalanceLabel>
                       <ChooseTokenRow>
                           <MaxButton onClick={()=>{swapAllTokens()}}>Max</MaxButton>
                            <ChooseToken onClick={ ()=>{ setFromConstituentModalState(true)} } > 
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                    <img src={`${FromIconImage()}`} alt="icon" width="25px" /> &nbsp;
                                    {selectedFromTokenIndx>=0 && baskets[0].constituents? baskets[0].constituents[selectedFromTokenIndx].symbol?.toUpperCase() : "Select"}
                                </div>
                                <ExpandMoreIcon />
                            </ChooseToken>
                        </ChooseTokenRow>
                    </ChooseTokenContainer>
                </InputDiv>

                <ArrowDownwardIcon color="secondary" fontSize="large" style={{alignSelf:"center" }} onClick={()=>switchTokens()}/>

                <InputDiv>
                   <TextField variant='filled' label={`# Received`} onChange={handleFromTextField} autoComplete='off' value={tokensReceived>-1?tokensReceived:''} disabled={true}/>
                   <ChooseTokenContainer>
                       <BalanceLabel>{`Balance: ${toBalance}`}</BalanceLabel>
                        <ChooseToken onClick={ ()=>{ setToConstituentModalState(true)} } > 
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                {selectedToTokenIndx>=0?
                                    <img src={`${ToIconImage()}`} alt="icon" width="25px" /> 
                                :<></>}&nbsp;
                                {selectedToTokenIndx>=0 ? baskets[0].constituents[selectedToTokenIndx].symbol.toUpperCase() : "Select "}
                            </div>
                            <ExpandMoreIcon />
                        </ChooseToken>
                    </ChooseTokenContainer>
                </InputDiv>

                {
                    showSwapButton?
                        !processingTx?
                            <SwapButton onClick={ ()=> handleSwap() }>Swap</SwapButton>
                            :
                            <SwapButton><CircularProgress /></SwapButton>
                    :
                    <MessageContainer>
                    {swapMessage}
                    </MessageContainer>
                }

                {
                    showSwapDetails?
                    <SwapDetails>
                        <SwapDetailsRow>
                            <SwapDetailsLabel style={{fontWeight:500}}>Exchange Rate*:</SwapDetailsLabel>
                            <SwapDetailsValue>{`${exchangeRate} ${baskets[0].constituents[selectedToTokenIndx].symbol.toUpperCase()} / ${baskets[0].constituents[selectedFromTokenIndx].symbol.toUpperCase()}`}</SwapDetailsValue>
                        </SwapDetailsRow>

                        <SwapDetailsRow>
                            <SwapDetailsLabel style={{fontWeight:500}}>Swap Fee:</SwapDetailsLabel>
                            <SwapDetailsValue>0.3%</SwapDetailsValue>
                        </SwapDetailsRow>

                        <SwapDetailsRow>
                            <SwapDetailsLabel style={{fontWeight:500}}>Basket Liquidity</SwapDetailsLabel>

                            <SwapDetailsLabel>{`${numberWithCommas(baskets[0].constituents[selectedFromTokenIndx].basketBalance)} ${baskets[0].constituents[selectedFromTokenIndx].symbol.toUpperCase()}`}</SwapDetailsLabel>

                            <SwapDetailsLabel>{`${numberWithCommas(baskets[0].constituents[selectedToTokenIndx].basketBalance)} ${baskets[0].constituents[selectedToTokenIndx].symbol.toUpperCase()}`}</SwapDetailsLabel>
                        </SwapDetailsRow>

                        <SwapDetailsRow>
                            <SwapDetailsLabel style={{fontWeight:500}}>Wallet</SwapDetailsLabel>

                            <SwapDetailsLabel>{`${numberWithCommas(ethBalance)} ETH`}</SwapDetailsLabel>

                            <SwapDetailsLabel><Link to={{pathname:`https://etherscan.io/address/${accAddress}`}} target="_blank" style={{textDecoration:'none'}}>{displayAddress(accAddress)}</Link></SwapDetailsLabel>
                        </SwapDetailsRow>

                        <SwapDetailsRow>
                            <SwapDetailsLabel>{}</SwapDetailsLabel>
                        </SwapDetailsRow>
                        <Footnote>*Fees not included</Footnote>
                    </SwapDetails>
                    :
                    <>
                        <SwapDetails>
                            <SwapDetailsRow>
                                <SwapDetailsLabel style={{fontWeight:500}}>Wallet</SwapDetailsLabel>

                                <SwapDetailsLabel>{`${numberWithCommas(ethBalance)} ETH`}</SwapDetailsLabel>

                                <SwapDetailsLabel><Link to={{pathname:`https://etherscan.io/address/${accAddress}`}} target="_blank" style={{textDecoration:'none', color:"black"}}>{displayAddress(accAddress)}</Link></SwapDetailsLabel>
                            </SwapDetailsRow>
                        </SwapDetails>
                    </>
                }

            </SwapCard>

            </>
            : <>
  
                   <CircularProgress />
                    <div>Please wait</div>                    
            </>
            }
            </>
        </SwapContainer>
      );
    };
    // background-image: linear-gradient(to bottom right, #150734, #28559A);

const SwapContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 81vh;
    color: white;
    padding: 20px;
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

const SwapCard = styled.div`
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
    align-items: center;
    border: 1px solid lightgray;
    border-radius: 10px;
    padding: 10px;
    margin: 20px;
    @media (max-width: 770px){
        flex-direction: column;
    }
`;

const ChooseTokenContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 5px;
`;

const BalanceLabel = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: gray;
`;

const ChooseTokenRow = styled.div`
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

const BlackText = styled.div`
    font-size: 20px;
    font-weight: 400;
    color: black;
`;

const SwapDetails = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: black;
    padding: 15px;
    margin: 0px 20px 0px 20px;
    @media (max-width: 770px){
    flex-direction: column;
    }
`;

const SwapDetailsRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 5px;
    @media (max-width: 770px){
    flex-direction: column;
    justify-content: center;
    }
`;

const SwapDetailsLabel = styled.div`
    text-align: left;
    font-size: 14px;
    font-weight: 300;
    flex: 1;
`;

const SwapDetailsValue = styled.div`
    text-align: right;
    font-size: 14px;
    font-weight: 300;
`;

const MessageContainer = styled.div`
    font-size: 25px;
    font-weight: 400;
    color: #5F5F5F;
    background-color: #F1F1F1;
    border-radius: 15px;
    text-align: center;
    border-radius: 10px;
    padding: 15px;
    margin: 20px 20px 0px 20px;
    @media (max-width: 770px){
        flex-direction: column;
    }
`;

const SwapButton = styled.div`
    display: flex;
    justify-content: space-around;
    font-size: 25px;
    font-weight: 500;
    color: #FFFFFF;
    background-color: #2e6ad1;
    border-radius: 15px;
    text-align: center;
    border-radius: 10px;
    padding: 15px;
    margin: 20px 20px 0px 20px;
    cursor: pointer;
    box-shadow: 0 3px 8px #000;
`;

const Footnote = styled.div`
    font-size: 12px;
    font-weight: 300;
    margin: 10px 0 0 -20px;
`;

const BlackCaptionText = styled.div`
    font-size: 12px;
    font-weight: 250;
    color: black;
`;

export default Swap;