import React, {useEffect, useState} from 'react';
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { AbstractConnector } from '@web3-react/abstract-connector'
import {InjectedConnector, NoEthereumProviderError,UserRejectedRequestError as UserRejectedRequestErrorInjected} from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { Web3Provider } from '@ethersproject/providers';
import { Fab } from '@material-ui/core/';
import WalletModal from './components/WalletModal';
import * as dotenv from 'dotenv';
import MessageModal from 'components/MessageModal';

import { injected, walletconnect, walletlink, ledger, trezor, frame, fortmatic, magic, portis, torus } from './connectors'

import { useEagerConnect, useInactiveListener } from "./hooks";

dotenv.config();

declare global {
  interface Window {
    ethereum : any;
  }
}

const chainInfo=[
  {chainid:1, name:'Mainnet'},
  {chainid:3, name:'Ropsten'},
  {chainid:4, name:'Rinkeby'},
  {chainid:5, name:'Goerli'},
  {chainid:42, name:'Kovan'},
  {chainid:1337, name:'Ganache'},
];

function walletNameFromConnector(connector:any){
  switch(connector)
  {
    case injected:
      return 'Injected';
    case walletconnect:
      return 'Wallet Connect';
    case walletlink:
      return 'Wallet Link';
    case fortmatic:
      return 'Fortmatic';
    default :
      return 'unknown';
  }
}
function walletConnectorByName(connector:string):AbstractConnector{
  connector = connector.toLowerCase();
  switch(connector)
  {
    case 'injected':
      return injected;
    case 'walletconnect':
      return walletconnect;
    case 'fortmatic':
      return fortmatic;
    case 'portis':
      return portis;
    default :
      return null as any;
  }
}

function getErrorMessage(error:any) {

  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect
  ) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}

const WalletConnector = () => {
  
  const [connected, setConnected] = useState(false);
  const [walletErrorMsg, setWalletErrorMsg] = useState('');
  const context = useWeb3React();
  const { chainId, account, library, activate, active, deactivate, error } = context;

  const [modalState, setModalState]=useState(false);
  const handleClose =()=>setModalState(false);
  const openModal=()=>setModalState(true);

  const [modalStateem, setModalStateem]=useState(false);
  const handleCloseem =()=> setModalStateem(false);
  const openModalem=()=>setModalStateem(true);

  const [accinfo, setAccinfo]=useState({});

  const [msgmodalState, setMsgModalState ] = useState(false);

  const handleCloseMsgModal=()=>{setMsgModalState(!msgmodalState);}


  const Disconnect = async ()=>{
    deactivate();
    // let ethereum = window.ethereum || null;
    // if(window.ethereum){
        // console.log('connecting with window.ethereum: ',  );
        // window.provider =  new ethers.providers.Web3Provider(window.ethereum);
        // let network = await window.provider.getNetwork();
        // window.chainId = network.chainId;
    // }
  }
  const ConnectToWallet = (walletstr:string) => {
    const wallet = walletConnectorByName(walletstr);
    activate(wallet);
    localStorage.setItem('walletname', walletstr);
  }

  useEffect(()=>{
    if(!!error){
      let msg = getErrorMessage(error);
      setWalletErrorMsg(msg);
      openModalem();
    }
    if(!active && !error){
      let info = localStorage.getItem('walletname');
      let walletstr = info? info : "";
      try{
        const wallet = walletConnectorByName(walletstr);
        if(wallet){        
          context.activate(walletConnectorByName(walletstr));
        }
      }catch(e)
      {
        console.log('no injected connector');
      }
    }
    if(active){
        if(chainId != process.env.REACT_APP_ETH_NETWORKID){
          setMsgModalState(true);
        }
    }
  },[error, account, active, chainId])

  return (
    <>
      <MessageModal message={`Please connect to a correct network: ${process.env.REACT_APP_ETH_NETWORK}`} header={'Network Message'} state={msgmodalState} handleClose={handleCloseMsgModal}/>
      <div>
      {active?
      <></>
      : <Fab variant='extended' size='small' style={{backgroundColor:'#eee', color:'#000', position:'fixed', top:'100px', right:'15%', padding:'15px', zIndex:1000}} onClick={openModal}>Connect Wallet</Fab>}
      <WalletModal modalState={modalState} handleClose={handleClose} connect={
        (walletstr:string)=>{
          ConnectToWallet(walletstr);
        }}
      />

      { !!error ? <MessageModal message={walletErrorMsg} header={'Error'} state={modalStateem} handleClose={handleCloseem}/> : <></>}

      </div>
    </>
  )
}

// const WalletComponent = ()=>{
//     return (
//         <Web3ReactProvider getLibrary={getLibrary}>
//             <WalletConnector />
//         </Web3ReactProvider>
//     )
// }

export default WalletConnector;
