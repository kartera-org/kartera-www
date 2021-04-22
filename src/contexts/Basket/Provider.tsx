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
    const [txAddress, setTxAddress] = useState<string>('');
    const [processingTx, setProcessingTx] = useState<boolean>(false);
    const web3context = useWeb3React();
    const { chainId, account, library, activate, active, deactivate, error } = web3context;
    const mmk_addr = "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2";

    const fetchAllBasketInfo = useCallback(
      async (userAddress: string, provider: any) => {
        let tBasket:BasketI[] = new Array();
        for(let i=0; i<BasketAddresses.length; i++){
          let basket_i:BasketI = {
            address:BasketAddresses[i],
            name: "",
            symbol: "",
            decimals: 18,
            price: "",
            numberOfConstituents: 0,
            numberOfActiveConstituents: 0,
            userBalance: "",
            totalSupply: "",
            withdrawCost:"",
            constituents: new Array()
          };
          let n=0;
          try{
            basket_i.name = await utils.Name(provider, BasketAddresses[i]);
            basket_i.symbol = await utils.Symbol(provider, BasketAddresses[i]);
            basket_i.decimals = await utils.Decimals(provider, BasketAddresses[i]);
            basket_i.price = await basketFunc.BasketPrice(provider, BasketAddresses[i]);
            basket_i.numberOfConstituents = await basketFunc.NumberOfConstituents(provider, BasketAddresses[i]);
            n = basket_i.numberOfConstituents?basket_i.numberOfConstituents : 0;
            basket_i.numberOfActiveConstituents = await basketFunc.NumberOfActiveConstituents(provider, BasketAddresses[i]);
            basket_i.totalSupply = await utils.TotalSupply(provider, BasketAddresses[0]);
            basket_i.withdrawCost = await basketFunc.WithdrawCost(provider, BasketAddresses[i]);
          }catch(e){return;}
          for(let j=0; j < n; j++){
            let constituentAddress='';
            let constituentInfo;
            try{
              constituentAddress = await basketFunc.ConstituentAddress(provider, BasketAddresses[i], j);
              constituentInfo = await basketFunc.ConstituentDetails(provider, BasketAddresses[i],constituentAddress);
            }catch(e){return;}
            let cons:ConstituentI = {
              address:constituentAddress,
              name: "",
              symbol: "",
              decimals: 18,
              active: true,
              basketBalance: "",
              exchangeRate: "",
              userBalance: "",
            };
            try{
              let details =await basketFunc.ConstituentDetails(provider, BasketAddresses[0], constituentAddress);
              cons.active = details[1];
              cons.decimals = details[3];
              cons.basketBalance = ethers.utils.formatUnits(details[2], cons.decimals);
              cons.exchangeRate = await basketFunc.ExchangeRate(provider, BasketAddresses[0], constituentAddress);
            }catch(e){return;}
            if(constituentAddress==basketFunc.addr1){
              cons.name = "Ether";
              cons.symbol = "Eth";
              try{
                cons.userBalance = await utils.getEthBalance(provider, userAddress);
              }catch(e){return;}
            }
            else if(constituentAddress==mmk_addr){
              cons.name = "Maker";
              cons.symbol = "MKR";
              try{
                cons.userBalance = await utils.getBalance(provider, constituentAddress, userAddress, cons.decimals);
              }catch(e){return;}              
            }
            else{
              try{
                cons.name = await utils.Name(provider, constituentAddress);
                cons.symbol = await utils.Symbol(provider, constituentAddress);
                cons.userBalance = await utils.getBalance(provider, constituentAddress, userAddress, cons.decimals);
              }catch(e){return;}
            }
            basket_i.constituents.push(cons);
          }
          try{
            basket_i.userBalance = await utils.getBalance(provider, BasketAddresses[i], userAddress, 18);
          }catch(e){
            console.log('error getting basket balance: ', e.message );
            return;
          }
          tBasket.push(basket_i);
        }
        setBaskets(tBasket);
      }, []
    );
    const unsetTxMessage = useCallback(
      async () =>{
        setTxMessage('');
        setTxAddress('');
      },[setTxMessage]
    );

    const handleDeposit = useCallback(
      async (basketAddress:string, tokenAddress:string, amount: string) =>{
        setProcessingTx(true);
        try{
          if(tokenAddress == basketFunc.addr1) {
            try{
              let tx = await basketFunc.MakeEthDeposit(library, basketAddress, amount);
              setTxAddress(tx);
              console.log('make deposit tx hash: ',  tx);
              tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
              let msg = 'Deposit complete. TXID: ' + tx;
              setTxMessage(msg);
              setProcessingTx(false);
            }catch(e){
              setTxMessage(`Transaction failed: ${e.message}`);
              setProcessingTx(false);
            }
          }else{
            let allowance = await utils.getAllowance(basketAddress, tokenAddress, library, account);
            // console.log('allowance: ', allowance.toString() );
        
            if(new BigNumber(allowance.toString()).gte(new BigNumber(amount))){
              try{
                let tx = await basketFunc.MakeDeposit(library, basketAddress, tokenAddress, amount);
                console.log('make deposit tx hash: ',  tx);
                setTxAddress(tx);
                tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
                let msg = 'Deposit complete. TXID: ' + tx;
                setTxMessage(msg);
                setProcessingTx(false);
              }catch(e){
                setTxMessage(`Transaction failed: ${e.message}`);
                setProcessingTx(false);
              }
            }else{
              const contract = utils.getERC20Contract(library, tokenAddress);
              let tx = await utils.ApproveTransfer(library, tokenAddress, basketAddress);
              setTxAddress(tx);
              console.log('approval tx hash: ',  tx);
              tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
              let msg = 'Approval transaction ID: ' + tx;
              setTxMessage(msg);
              let done = false;
              contract.on('Approval', async (owner, spender, value, evnt)=>{
                if(!done){
                  try{
                    done=true;
                    let tx = await basketFunc.MakeDeposit(library, basketAddress, tokenAddress, amount);
                    setTxAddress(tx);
                    console.log('make deposit tx hash: ',  tx);
                    tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
                    let msg = 'Deposit complete. TXID: ' + tx;
                    setTxMessage(msg);
                    setProcessingTx(false);
                  }catch(e){
                    setTxMessage(`Transaction failed: ${e.message}`);
                    setProcessingTx(false);
                  }
                }
              });
            }
          }
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

          let allowance = await utils.getAllowance(basketAddress, KarteraTokenAddress, library, account);
          // console.log('allowance: ', allowance.toString() );
      
          if(new BigNumber(allowance.toString()).gte(new BigNumber(amount))){
            try{
              let tx = await basketFunc.WithdrawLiquidity(library, basketAddress, tokenAddress, amount);
              setTxAddress(tx);
              console.log('Withdraw transaction tx hash: ',  tx);
              tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
              let msg = 'Withdraw transaction complete. TXID: ' + tx;
              setTxMessage(msg);
              setProcessingTx(false);
              return;
            }catch( e ) {
              setTxMessage(`Transaction failed: ${e.message}`);
              setProcessingTx(false);
              return;
            }
          }

          let tx = await utils.ApproveTransfer(library, KarteraTokenAddress, basketAddress);
          setTxAddress(tx);
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
                setTxAddress(tx);
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

    const handleSwap = useCallback(
      async (basketAddress:string, tokenAddressFrom:string, tokenAddressTo:string, amount:string) =>{
        setProcessingTx(true);
        try{
          if(tokenAddressFrom==basketFunc.addr1){
            let tx = await basketFunc.SwapEth(library, basketAddress, tokenAddressFrom, tokenAddressTo, amount);
            setTxAddress(tx);
            console.log('Swap transaction tx hash: ',  tx);
            tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
            let msg = 'Swap transaction complete. TXID: ' + tx;
            setTxMessage(msg);
            setProcessingTx(false);
          }else{
            const contract = utils.getERC20Contract(library, tokenAddressFrom);

            let allowance = await utils.getAllowance(basketAddress, tokenAddressFrom, library, account);
            // console.log('allowance: ', allowance.toString() );
        
            if(new BigNumber(allowance.toString()).gte(new BigNumber(amount))){
              console.log('here inside direct swap: ',  );
              try{
                let tx = await basketFunc.Swap(library, basketAddress, tokenAddressFrom, tokenAddressTo, amount);
                setTxAddress(tx);
                console.log('Swap transaction tx hash: ',  tx);
                tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
                let msg = 'Swap transaction complete. TXID: ' + tx;
                setTxMessage(msg);
                setProcessingTx(false);
              }catch(e){
                setTxMessage(`Swap failed: ${e.message}`);
                setProcessingTx(false);
              }
            }else{
              let tx = await utils.ApproveTransfer(library, tokenAddressFrom, basketAddress);
              setTxAddress(tx);
              tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
              let msg = 'Approval transaction ID: ' + tx;
              setTxMessage(msg);
              let done = false;
              contract.on('Approval', async (owner, spender, value, evnt)=>{
                if(!done){
                  done=true;
                  try{
                    done=true;
                    let tx = await basketFunc.Swap(library, basketAddress, tokenAddressFrom, tokenAddressTo, amount);
                    setTxAddress(tx);
                    console.log('Swap transaction tx hash: ',  tx);
                    tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
                    let msg = 'Swap transaction complete. TXID: ' + tx;
                    setTxMessage(msg);
                    setProcessingTx(false);
                  }catch(e){
                    setTxMessage(`Swap failed: ${e.message}`);
                    setProcessingTx(false);
                  }
                }
              })
            }
          }
        } catch( e ) {
          setTxMessage(`Swap failed: ${e.message}`);
          setProcessingTx(false);
        }
      },
      [setTxMessage, setProcessingTx, library]
    );

    const handleSwapRate = useCallback(
      async (basketAddress:string, tokenAddressFrom:string, tokenAddressTo:string) =>{
        try{
          let rate = await basketFunc.SwapRate(library, basketAddress, tokenAddressFrom, tokenAddressTo);
          return rate;
        } catch( e ) {
          return '0';
        }
      },
      [setTxMessage, setProcessingTx, library]
    );

    const handleTradingAllowed = useCallback(
      async (basketAddress:string) =>{
        try{
          let allowed = await basketFunc.TradingAllowed(library, basketAddress);
          return allowed;
        } catch( e ) {
          return false;
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
            txAddress,
            processingTx,
            unsetTxMessage: unsetTxMessage,
            baskets,
            deposit: handleDeposit,
            withdraw: handleWithdraw,
            swap: handleSwap,
            swapRate: handleSwapRate,
            tradingAllowed: handleTradingAllowed
          }}
        >
          {children}
        </Context.Provider>
      );

}


export default Provider;