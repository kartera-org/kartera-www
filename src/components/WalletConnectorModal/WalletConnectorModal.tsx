import React, { useCallback, useState, useEffect } from "react";
import styled from "styled-components";
// import { useWallet } from "use-wallet";
import { useWeb3React } from "@web3-react/core";

import metamaskLogo from "assets/metamask-fox.svg";
import walletConnectLogo from "assets/wallet-connect.svg";

import WalletCard from "./components/WalletCard";
import { injected, walletconnect, walletlink, ledger, trezor, frame, fortmatic, magic, portis, torus } from 'components/WalletButton/connectors';

interface WCModalI {
    state: boolean;
    onClose: ()=>void;
}

const WalletConnectorModal: React.FC<WCModalI> = ({state, onClose}) => {

    const web3context = useWeb3React();
    const { account, activate, active } = web3context;
    const [connector, setConnector] = useState<string>("");

    const handleConnectMetamask = useCallback(() => {
        setConnector("metamask")
        activate(injected);
      }, [activate]);
    
      const handleConnectWalletConnect = useCallback(() => {
        setConnector("walletconnect")
        activate(walletconnect);
      }, [activate]);

      useEffect(() => {
        if (account) {
            onClose && onClose();
        }
        if (active && connector)
        {
            localStorage.setItem("walletProvider", connector);
        }
      }, [account]);

      useEffect(() =>{
        const walletProvider = localStorage.getItem("walletProvider");
        if(walletProvider){
            setConnector(walletProvider);
          }

      }, [])


    return(
        <>
        { state && (
            <>
                <StyledBackdrop onClick={onClose} />

                <WalletProvidersContainer>
                    <HeaderContainer>
                        <Header>{"Select Wallet"}</Header>
                    </HeaderContainer>
                    <Body>
                        <WalletCard name={"MetaMask"} icon={metamaskLogo} onClick={handleConnectMetamask}></WalletCard>
                        
                        <WalletCard name={"WalletConnect"} icon={walletConnectLogo} onClick={handleConnectWalletConnect}></WalletCard>
                    </Body>
                </WalletProvidersContainer>
            </>
        )}
        </>
    )
}

const StyledBackdrop = styled.div`
    background-color: #000000;
    opacity: 0.75;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 200%;
`;

const WalletProvidersContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: fixed;
    background: #FFFFFF;
    border-radius: 10px;
    width: min(500px, 75%);
    padding: 10px;
    top: 50%;
    left: 50%;
    z-index: 1000;
    transform: translate(-50%, -50%);
`;

const HeaderContainer = styled.div`
    display: flex;
    background: "#eee";
`;

const Header = styled.div`
    font-size: 30px;
    font-weight: 700;
    margin: 2%;
    color: black;
`;

const Body = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: 300;
    color: black;
    margin: 5% 0;
`;

export default WalletConnectorModal;