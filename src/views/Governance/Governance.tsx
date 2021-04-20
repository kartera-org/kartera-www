import React, { useState, useEffect } from "react";
import Button from "components/Button";
import WalletButton from "components/WalletButton";
import styled from "styled-components";
import MessageModal from "components/MessageModal";
import { displayAddress } from "utils/formatting"
import CircularProgress from '@material-ui/core/CircularProgress';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import useGovernance from "hooks/useGovernance";
import { useWeb3React } from '@web3-react/core';

const Governance: React.FC = () => {
    const web3context = useWeb3React();
    const { active } = web3context;
    const { proposals } = useGovernance();

    const [modalHeader, setModalHeader] = useState('');
    const [ messageModalState, setMessageModalState] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const closeMessageModal = ()=>{
        setMessageModalState(false);
    }

    const showInfoBox = () => {
        setMessageModalState(true);
        setModalHeader("Governance");
        setModalMessage("Kartera protocol is governed by KART tokens. Holders of KART tokens have rights to make proposals and vote on proposals. KART tokens can be received by locking Kartera Basket Tokens in a Basket Farm.")
    }


    return(
        <GovernanceContainer>
            <MessageModal state={messageModalState} handleClose={closeMessageModal} message={modalMessage} header={modalHeader} />

            {
            !active?
            <>
            <Header>Connect your wallet <sup><HelpOutlineIcon fontSize="small" onClick={()=>showInfoBox()}/></sup></Header>
            <br />
            
            <WalletButton large={true}/>
            </>
            :
            <>
            <HeaderContainer>
                <Header>Governance<sup><HelpOutlineIcon fontSize="small" onClick={()=>showInfoBox()}/></sup></Header>
                {/* <CaptionText>Kartera tokens represent voting rights in Kartera Governance. You may vote on proposals or delegate your vote to a third party.</CaptionText> */}
            </HeaderContainer>
            {proposals?
                proposals.map((item, indx)=>(
                <ProposalCard key={`proposal${indx}`}>
                    <ProposalRow>
                        <ProposalId>{`${item?.id}`}</ProposalId>
                        <ProposalDescription>{`${item?.description}`}</ProposalDescription>
                        <ProposalState style={{}}>{`${item?.stateName}`}</ProposalState>
                    </ProposalRow>
                    <ProposalRow style={{justifyContent:'center'}}>
                        <ProposalItem>{`Target: ${item.targets[0]?displayAddress(item.targets[0]):""}`}</ProposalItem>
                    </ProposalRow>
                    <ProposalRow style={{justifyContent:'center'}}>
                        <ProposalItem>{`Signature: ${item?.signature}`}</ProposalItem>
                    </ProposalRow>
                    <ProposalRow style={{justifyContent:'center'}}>
                        <ProposalItem>{`For Votes: ${item?.forVotes.toString()}`}</ProposalItem>
                        <ProposalItem>{`Against Votes ${item?.againstVotes.toString()}`}</ProposalItem >
                        {
                        item.stateName=="Active"?
                            <ProposalItem><Button text={"Vote"} backgroundColor={"#EE4400"}/></ProposalItem>
                        :
                            <></>
                        }
                    </ProposalRow>
                </ProposalCard>
                    
                ))
                :
                <CircularProgress />
                }
                </>
                
            }
            
        </GovernanceContainer>
    )


}

const GovernanceContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 81vh;
    background-image: linear-gradient(to bottom right, #150734, #28559A);
    color: white;
    padding:20px;
`;

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 50px;
    @media (max-width: 770px){
        margin-top: 10px;
    }
`;

const Header = styled.div`
    font-size: 30px;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
    margin-bottom: 10px;
`;

const CaptionText = styled.div`
font-size: 14px;
font-weight: 250;
color: white;
`;

const ProposalCard = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    background-color: white;
    border-radius: 10px;
    margin: 10px 50px;
    min-width: 75%;
    padding: 20px;
`;

const ProposalRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 5px;
    @media (max-width: 770px){
        flex-direction: column;
    }
`;

const ProposalId = styled.div`
    flex: 1;
    font-size: 20px;
    color: black;
    font-weight: 700;
`;

const ProposalDescription = styled.div`
    flex: 15;
    flex-wrap: wrap;
    font-size: 20px;
    color: black;
    font-weight: 700;
`;

const ProposalState = styled.div`
    flex:2;
    font-size: 20px;
    color: black;
    justify-self: flex-end;
    padding:"5px";
    backgroundColor:"#eee";
    font-weight: 700;
`;

const ProposalItem = styled.div`
    flex:2;
    flex-wrap: break-word;
    word-wrap: break-word;
    font-size: 20px;
    color: black;
    justify-self: flex-end;
`;

export default Governance;
