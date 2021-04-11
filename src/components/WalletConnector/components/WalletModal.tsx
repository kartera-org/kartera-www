import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Button, Modal, Typography} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Web3Provider } from '@ethersproject/providers';
import MetamaskIcon from '../images/metamask.svg';
import WalletconnectIcon from '../images/wallet-connect.svg';
import FortmaticIcon from '../images/fortmatic.png';
import LatticeIcon from '../images/latticeIcon.png';
import CoinbaseIcon from '../images/coinbaseWalletIcon.svg';
import PortisIcon from '../images/portisIcon.png';

function rand() {
  return Math.round(Math.random() * 20) - 10;
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

interface walletModalI {
  modalState:boolean;
  handleClose?:any;
  connect?:any;
}

const WalletModal=(props:walletModalI)=>{
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
        <div style={{display:'flex', flexDirection:'column'}}>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                <Typography variant='h6'>Connect to your wallet</Typography>
                <Button size='large' onClick={props.handleClose}>X</Button>
                {/* <Button startIcon={CloseIcon}>close</Button> */}
            </div>
        <Grid container justify='center' alignItems='center' style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
            <Grid container><Grid item onClick={()=>{props.handleClose(); props.connect('injected');}} style={{flexGrow:1, display:'flex', justifyContent:'space-between', alignItems:'center', cursor: 'pointer'}}><div style={{marginTop:'10px'}}  ><img width='35px' src={MetamaskIcon} /></div><div><Typography variant='h5'>MetaMask</Typography></div></Grid></Grid>
            {/* <Grid container><Grid item onClick={()=>{props.handleClose(); props.connect('walletconnect');}} style={{flexGrow:1, display:'flex', justifyContent:'space-between', alignItems:'center', cursor: 'pointer'}}><div style={{marginTop:'10px'}}  ><img width='35px' src={WalletconnectIcon} /></div><div><Typography variant='h5'>Wallet Connect</Typography></div></Grid></Grid> */}
            {/* <Grid container><Grid item onClick={()=>{props.handleClose(); props.connect('fortmatic');}} style={{flexGrow:1, display:'flex', justifyContent:'space-between', alignItems:'center', cursor: 'pointer'}}><div style={{marginTop:'10px'}} ><img width='35px' src={FortmaticIcon}/></div><div><Typography variant='h5'>Fortmatic</Typography></div></Grid></Grid> */}
            {/* <Grid container><Grid item onClick={()=>{props.handleClose(); props.connect('lattice');}} style={{flexGrow:1, display:'flex', justifyContent:'space-between', alignItems:'center'}}><div style={{marginTop:'10px'}} ><img width='35px' src={LatticeIcon}/></div><div><Typography variant='h5'>Lattice</Typography></div></Grid></Grid>
            <Grid container><Grid item onClick={()=>{props.handleClose(); props.connect('coinbase');}} style={{flexGrow:1, display:'flex', justifyContent:'space-between', alignItems:'center'}}><div style={{marginTop:'10px'}} ><img width='35px' src={CoinbaseIcon}/></div><div><Typography variant='h5'>Coinbase Wallet</Typography></div></Grid></Grid>
            <Grid container><Grid item onClick={()=>{props.handleClose(); props.connect('portis');}} style={{flexGrow:1, display:'flex', justifyContent:'space-between', alignItems:'center'}}><div style={{marginTop:'10px'}} ><img width='35px' src={PortisIcon}/></div><div><Typography variant='h5'>Portis</Typography></div></Grid></Grid> */}
        </Grid>
      </div>
    </div>
  );

  return (
    <div>
      {/* <button type="button" onClick={handleOpen}>
        Open Modal
      </button> */}
      <Modal
        open={props.modalState}
        onClose={props.handleClose}
      >
        {body}
      </Modal>
    </div>
  );
}

export default WalletModal;