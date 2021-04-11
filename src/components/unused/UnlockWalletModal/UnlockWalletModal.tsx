import React, { useCallback, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Card, Button, Modal, CardActions, CardContent, CardHeader, Grid } from "@material-ui/core";
import styled, { ThemeProvider } from "styled-components";
import { useWallet } from "use-wallet";

import metamaskLogo from "assets/metamask-fox.svg";
import walletConnectLogo from "assets/wallet-connect.svg";

import WalletProviderCard from "./components/WalletProviderCard";

interface ModalProps {
  isOpen:boolean;
  onDismiss?:any;
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
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

const UnlockWalletModal: React.FC<ModalProps> = ({ isOpen, onDismiss }) => {
  const classes = useStyles();
  const { account, connector, connect } = useWallet();

  const handleConnectMetamask = useCallback(() => {
    connect("injected");
  }, [connect]);

  const handleConnectWalletConnect = useCallback(() => {
    connect("walletconnect");
  }, [connect]);

  useEffect(() => {
    if (account) {
      onDismiss && onDismiss();
    }
    if (connector) {
      localStorage.setItem("walletProvider", connector);
    }
  }, [account, onDismiss]);

  const [modalStyle] = React.useState(getModalStyle);
  return (
    <Modal open={isOpen}
      onClose={onDismiss}
    >
      <div style={modalStyle} className={classes.paper}>
      <Card>
      <CardHeader text="Select a wallet provider." />
      <CardContent>
        <StyledWalletsWrapper>
          <div style={{flex:1,}}>
            <WalletProviderCard icon={<img src={metamaskLogo} style={{ height: 32 }} />} name="Metamask" onSelect={handleConnectMetamask} />
          </div>
          <div style={{flex:1,}}>
            <WalletProviderCard 
              icon={<img src={walletConnectLogo} style={{ height: 32 }} />}
              name="WalletConnect"
              onSelect={handleConnectWalletConnect}
            />
          </div>
        </StyledWalletsWrapper>
      </CardContent>
      <CardActions>
          <Button onClick={onDismiss} variant="contained" >Cancel</Button>
      </CardActions>
      </Card>
    </div>
    </Modal>
  );
};

const StyledWalletsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media (max-width: 600px) {
    flex-direction: column;
    flex-wrap: none;
  }
`;

export default UnlockWalletModal;
