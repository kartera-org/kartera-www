import React, { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import {BigNumber} from "bignumber.js";
import { useWeb3React } from '@web3-react/core';
import { KarteraTokenAddress, BasketAddresses } from "constants/tokenAddresses";
import { BasketI, ConstituentI } from "./types";
import  * as utils from "utils";
import * as basketFunc from "./baskets";

import Context from "./Context";

const Provider: React.FC = ({ children }) => {

    const [baskets, setBaskets] = useState<BasketI[]>();
    const [txMessage, setTxMessage] = useState<string>('');
    const [processingTx, setProcessingTx] = useState<boolean>(false);
    const web3context = useWeb3React();
    const { chainId, account, library, activate, active, deactivate, error } = web3context;

    const fetchAllBasketInfo = useCallback(
      async (userAddress: string, provider: any) => {
        let tBasket:BasketI[] = new Array();
        for(let i=0; i<BasketAddresses.length; i++){
          let basket_i:BasketI = {address:BasketAddresses[i]};
          basket_i.name = await utils.Name(provider, BasketAddresses[i]);
          basket_i.symbol = await utils.Symbol(provider, BasketAddresses[i]);
          basket_i.decimals = await utils.Decimals(provider, BasketAddresses[i]);
          basket_i.price = await basketFunc.BasketPrice(provider, BasketAddresses[i]);
          basket_i.numberOfConstituents = await basketFunc.NumberOfConstituents(provider, BasketAddresses[i]);
          let n = basket_i.numberOfConstituents?basket_i.numberOfConstituents : 0;
          basket_i.numberOfActiveConstituents = await basketFunc.NumberOfActiveConstituents(provider, BasketAddresses[i]);
          basket_i.constituents = new Array();
          for(let j=0; j < n; j++){
            let constituentAddress = await basketFunc.ConstituentAddress(provider, BasketAddresses[i], j);
            let constituentInfo = await basketFunc.ConstituentDetails(provider, BasketAddresses[i],constituentAddress);

            let cons:ConstituentI = {address:constituentAddress};
            if(constituentAddress==basketFunc.addr1){
              cons.name = "Ether";
              cons.symbol = "Eth";
              cons.decimals = 18;
              cons.basketBalance = await utils.getEthBalance(provider, BasketAddresses[0]);
              cons.exchangeRate = await basketFunc.ExchangeRate(provider, BasketAddresses[0], constituentAddress);
              cons.userBalance = await utils.getEthBalance(provider, userAddress);
            }else{
              cons.name = await utils.Name(provider, constituentAddress);
              cons.symbol = await utils.Symbol(provider, constituentAddress);
              cons.decimals = await utils.Decimals(provider, constituentAddress);
              cons.basketBalance = await utils.getBalance(provider, constituentAddress, BasketAddresses[0], cons.decimals);
              cons.exchangeRate = await basketFunc.ExchangeRate(provider, BasketAddresses[0], constituentAddress);
              cons.userBalance = await utils.getBalance(provider, constituentAddress, userAddress, cons.decimals);
          }

            basket_i.constituents.push(cons);
          }
          basket_i.userBalance = await utils.getBalance(provider, BasketAddresses[i], userAddress, 18);
          tBasket.push(basket_i);
        }
        setBaskets(tBasket);
      }, [setBaskets]
    );
    const unsetTxMessage = useCallback(
      async () =>{
        setTxMessage('');
      },[setTxMessage]
    );

    const handleDeposit = useCallback(
      async (basketAddress:string, tokenAddress:string, amount: string) =>{
        setProcessingTx(true);
        try{
          const contract = utils.getERC20Contract(library, tokenAddress);
          let tx = await utils.ApproveTransfer(library, tokenAddress, basketAddress, amount);
          console.log('approval tx hash: ',  tx);
          tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
          let msg = 'Approval transaction ID: ' + tx;
          setTxMessage(msg);
          let done = false;
          contract.on('Approval', async (owner, spender, value, evnt)=>{
            if(!done){
              done=true;
              let tx = await basketFunc.MakeDeposit(library, basketAddress, tokenAddress, amount);
              console.log('make deposit tx hash: ',  tx);
              tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
              let msg = 'Deposit complete. TXID: ' + tx;
              setTxMessage(msg);
              setProcessingTx(false);
            }
          });
        } catch ( e ) {
            setTxMessage(`Transaction failed: ${e.message}`);
            setProcessingTx(false);
        }
      },
      [setTxMessage, setProcessingTx, library]
    );

    const handleWithdraw = useCallback(
      async (basketAddress:string, tokenAddress:string, amount:string) =>{
        setProcessingTx(true);
        try{
          const contract = utils.getERC20Contract(library, KarteraTokenAddress);
          
          const tokensreturned = await basketFunc.ActualWithdrawCost(library, basketAddress, amount);
          console.log('tokensreturned: ', tokensreturned.toString() );

          let tx = await utils.ApproveTransfer(library, KarteraTokenAddress, basketAddress, tokensreturned);
          console.log('approval tx hash: ',  tx);

          tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
          let msg = 'Approval transaction ID: ' + tx;
          setTxMessage(msg);
          let done = false;
          contract.on('Approval', async (owner, spender, value, evnt)=>{
            if(!done){
              done=true;
              try{
                let tx = await basketFunc.WithdrawLiquidity(library, basketAddress, tokenAddress, amount);
                console.log('Withdraw transaction tx hash: ',  tx);
                tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
                let msg = 'Withdraw transaction complete. TXID: ' + tx;
                setTxMessage(msg);
                setProcessingTx(false);
              } catch (e) {
                setTxMessage(`Transaction failed: ${e.message}`);
                setProcessingTx(false);
              }
            }
          });
        }catch ( e ) {
          setTxMessage(`Transaction failed: ${e.message}`);
          setProcessingTx(false);
        }
      },
      [setTxMessage, setProcessingTx, library]
    );

    useEffect(() => {
      if (account && library) {
        fetchAllBasketInfo(account, library);
      }
    }, [account, library, fetchAllBasketInfo]);
  
    useEffect(() => {
      if (account && library) {
        fetchAllBasketInfo(account, library);
        let refreshInterval = setInterval(() => fetchAllBasketInfo(account, library), 10000);
        return () => clearInterval(refreshInterval);
      }
    }, [account, library, fetchAllBasketInfo]);
  

    return (
        <Context.Provider
          value={{
            txMessage,
            processingTx,
            unsetTxMessage: unsetTxMessage,
            baskets,
            deposit: handleDeposit,
            withdraw: handleWithdraw
          }}
        >
          {children}
        </Context.Provider>
      );

}


export default Provider;