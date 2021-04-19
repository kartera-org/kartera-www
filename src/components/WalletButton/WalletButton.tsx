import React, { useCallback, useState, useEffect } from "react";
import styled from "styled-components";

import { useWeb3React } from '@web3-react/core';

import { injected, walletconnect, walletlink, ledger, trezor, frame, fortmatic, magic, portis, torus } from './connectors';

import SmallButton from "components/SmallButton";
import WalletConnectorModal from "components/WalletConnectorModal";
import WalletModal from "components/WalletModal";

interface WalletBtnI {
    onDismissMenu:()=>void;
}

const WalletButton: React.FC = ({}) => {
    const [walletModalState, setWalletModalState] = useState(false);
    const [walletConnectorState, setWalletConnectorState] = useState(false);
    const [userAccount, setUserAccount] = useState<string | null>();

    const web3context = useWeb3React();
    const { chainId, account, library, activate, active, deactivate, error } = web3context;

  
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
        console.log('disconnecting wallet: ',  );
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
      console.log('localaccount: ', localAccount );
      console.log('walletProvider: ', walletProvider );
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
                {!userAccount ? (
                <SmallButton onClick={handleWalletConnectorClick} text="Connect" backgroundColor={"#33DD00"} />
            ) : (
                <SmallButton onClick={handleDisconnectWallet} text="Disconnect" backgroundColor={"#EE4400"}/>
            )}
            </StyledWalletButton>
            <WalletConnectorModal state={walletConnectorState} onClose={handleDismissWalletConnectorModal} />
        </>
    )
}

const StyledWalletButton = styled.div`
`;

export default WalletButton;