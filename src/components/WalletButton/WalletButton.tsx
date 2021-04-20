import React, { useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import { useWeb3React } from '@web3-react/core';

import { injected, walletconnect, walletlink, ledger, trezor, frame, fortmatic, magic, portis, torus } from './connectors';

import SmallButton from "components/SmallButton";
import LargeWalletButton from "components/LargeWalletButton";
import WalletConnectorModal from "components/WalletConnectorModal";
import { useLocation } from "react-router-dom";

interface WalletBtnI {
    large?: boolean;
}

const WalletButton: React.FC<WalletBtnI> = ({large}) => {
    const [walletModalState, setWalletModalState] = useState(false);
    const [walletConnectorState, setWalletConnectorState] = useState(false);
    const [userAccount, setUserAccount] = useState<string | null>();

    const web3context = useWeb3React();
    const { chainId, account, library, activate, active, deactivate, error } = web3context;

    const location = useLocation();
  
    const handleDismissWalletConnectorModal = useCallback(() => {
      setWalletConnectorState(false);
    }, [setWalletConnectorState]);

    const handleWalletConnectorClick = useCallback(() => {
        setWalletConnectorState(true);
    }, [setWalletConnectorState]);
  
    const handleDismissWalletModal = useCallback(() => {
        setWalletModalState(false);
    }, [setWalletModalState]);
  
    const handleWalletModalClick = useCallback(() => {
        setWalletModalState(true);
    }, [setWalletModalState]);
  
    const handleConnectMetamask = useCallback(() => {
        activate(injected);
    }, [activate]);
  
    const handleConnectWalletConnect = useCallback(() => {
        activate(walletconnect);
    }, [activate]);

    const handleDisconnectWallet = useCallback(() => {
        localStorage.removeItem("account");
        localStorage.removeItem("walletProvider");
        deactivate();
        setUserAccount(null);
      }, [deactivate]);
  
    useEffect(() => {
      const localAccount: any = (account ? account.toString() : false) || localStorage.getItem("account");
      if (account) {
        localStorage.setItem("account", localAccount);
        setUserAccount(localAccount);
      }
    }, [account, userAccount, handleDismissWalletModal]);
  
    useEffect(() => {
      const localAccount = localStorage.getItem("account");
      const walletProvider = localStorage.getItem("walletProvider");
      if (!account && localAccount) {
        setUserAccount(localAccount);
        if (localAccount && (walletProvider === "metamask" || walletProvider === "injected")) {
          handleConnectMetamask();
        }
        if (localAccount && walletProvider === "walletconnect") {
          handleConnectWalletConnect();
        }
      }
    }, []);
  
    return (
        <>
            <StyledWalletButton>
              {
              location.pathname == '/'?
                <SmallButton backgroundColor={"#2e6ad1"} link={"/diversify"} text="Use App" />
              :
              !userAccount ? (
                large?
                <LargeWalletButton onClick={handleWalletConnectorClick} text="Connect" />
                :
                <SmallButton onClick={handleWalletConnectorClick} text="Connect" backgroundColor={"#2e6ad1"} />
              ) : (
                <SmallButton onClick={handleDisconnectWallet} text="Disconnect" backgroundColor={"#ff0000"}/>
                )
              }
            </StyledWalletButton>
            <WalletConnectorModal state={walletConnectorState} onClose={handleDismissWalletConnectorModal} />
        </>
    )
}

const StyledWalletButton = styled.div`
`;

export default WalletButton;