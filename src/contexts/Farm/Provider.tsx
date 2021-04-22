import React, { useCallback, useEffect, useState } from "react";
import {BigNumber} from "bignumber.js";
import { useWeb3React } from '@web3-react/core';
import * as basketFarmFunc from "./basketFarm";
import * as kartFarmFunc from "./kartFarm";
import { ethers } from "ethers";
import { BasketAddresses, SwapFarmAddress, KartFarmAddress, KarteraTokenAddress } from "constants/tokenAddresses";
import * as utils from "utils/index";

import Context from "./Context";

const Provider: React.FC = ({ children }) => {

    const [kFarmUserBalance, setKFarmUserBalance] = useState("");
    const [kFarmKartBalance, setKFarmKartBalance] = useState("");
    const [kFarmTotalSupply, setKFarmTotalSupply] = useState("");
    const [kFarmBasketBalance, setKFarmBasketBalance] = useState("");
    const [bFarmBasketBalance, setBFarmBasketBalance] = useState("");
    const [bFarmUserRewards, setBFarmUserRewards] = useState("");
    const [bFarmUserDeposits, setBFarmUserDeposits] = useState("");
    const [txAddress, setTxAddress] = useState("");
    
    const [txMessage, setTxMessage] = useState<string>('');
    const [processingTx, setProcessingTx] = useState<boolean>(false);

    const web3context = useWeb3React();
    const { account, library } = web3context;

    const fetchAllFarmInfo = useCallback(
      async (userAddress: string, provider: any) => {
        try{
        let kFarmUserBalance = await utils.getBalance(provider, KartFarmAddress, userAddress, 18);
        let kFarmKartBalance = await utils.getBalance(provider, KarteraTokenAddress, KartFarmAddress, 18);
        let kFarmTotalSupply = await utils.TotalSupply(provider, KartFarmAddress);
        let kFarmBasketBalance = await utils.getBalance(provider, BasketAddresses[0], KartFarmAddress, 18);
        let bFarmBasketBalance = await utils.getBalance(provider, BasketAddresses[0], SwapFarmAddress, 18);
        let bFarmUserRewards = await basketFarmFunc.AccumulatedRewards(provider, userAddress, BasketAddresses[0]);
        let bFarmUserDeposits = await basketFarmFunc.LockedTokens(provider, userAddress, BasketAddresses[0]);

        setKFarmUserBalance(kFarmUserBalance);
        setKFarmKartBalance(kFarmKartBalance);
        setKFarmTotalSupply(kFarmTotalSupply);
        setKFarmBasketBalance(kFarmBasketBalance);
        setBFarmBasketBalance(bFarmBasketBalance);
        setBFarmUserRewards(bFarmUserRewards);
        setBFarmUserDeposits(bFarmUserDeposits);
        }catch(e){
          console.log('error: ', e.message );
        }

      },[]
    )

    const handleDepositBasketTokens = useCallback( 
      async (basketAddress:string, amount:string) => {
        try{
        setProcessingTx(true);
        const contract = utils.getERC20Contract(library, BasketAddresses[0]);
        console.log('account: ', account );
        let allowance = await utils.getAllowance(SwapFarmAddress, basketAddress, library, account);
        // console.log('allowance: ', allowance.toString() );
      
          if(new BigNumber(allowance.toString()).gte(new BigNumber(amount))){
            try{
              let tx = await basketFarmFunc.Deposit(library, basketAddress, amount);
              console.log('Deposit transaction tx hash: ',  tx);
              setTxAddress(tx);
              tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
              let msg = 'Deposit transaction complete. TXID: ' + tx;
              setTxMessage(msg);
              setProcessingTx(false);
            }catch( e ) {
              console.log('e.message: ', e );
              setTxMessage(`Deposit Transaction failed: ${e.message}`);
              setProcessingTx(false);
            }
          }else{
            let tx = await utils.ApproveTransfer(library, basketAddress, SwapFarmAddress);
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
                      let tx = await basketFarmFunc.Deposit(library, basketAddress, amount);
                      console.log('Deposit transaction tx hash: ',  tx);
                      tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
                      let msg = 'Deposit transaction complete. TXID: ' + tx;
                      setTxMessage(msg);
                      setProcessingTx(false);
                  } catch (e) {
                    setTxMessage(`Deposit Transaction failed: ${e.message}`);
                    setProcessingTx(false);
                  }
                }
            });
          }
        }catch (e) {
            setTxMessage(`Transaction failed: ${e.message}`);
            setProcessingTx(false);
        }

    },[setTxMessage, setProcessingTx, library]);

    const handleWithdrawBasketTokens = useCallback(
      async (basketAddress:string, amount:string) => {
        try{
          setProcessingTx(true);
          let tx = await basketFarmFunc.Withdraw(library, basketAddress, amount);
          setTxAddress(tx);
          console.log('Withdraw transaction tx hash: ',  tx);
          tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
          let msg = 'Withdraw transaction complete. TXID: ' + tx;
          setTxMessage(msg);
          setProcessingTx(false);
          return;
        }catch (e) {
          setTxMessage(`Withdraw failed: ${e.message}`);
          setProcessingTx(false);
        }

      },[setTxMessage, setProcessingTx, library]);

    const handleWithdrawAllBasketTokens = useCallback(
      async (basketAddress:string) => {
        try{
          setProcessingTx(true);
          let tx = await basketFarmFunc.WithdrawAll(library, basketAddress);
          setTxAddress(tx);
          console.log('Withdraw transaction tx hash: ',  tx);
          tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
          let msg = 'Withdraw transaction complete. TXID: ' + tx;
          setTxMessage(msg);
          setProcessingTx(false);
          return;
        }catch (e) {
            setTxMessage(`Withdraw failed: ${e.message}`);
            setProcessingTx(false);
        }

      },[setTxMessage, setProcessingTx, library]);

    const handleCollectBasketFarmRewards = useCallback( 
      async (basketAddress:string) => {
        try{
          setProcessingTx(true);
          let tx = await basketFarmFunc.Collect(library, basketAddress);
          setTxAddress(tx);
          console.log('Collect rewards transaction tx hash: ',  tx);
          tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
          let msg = 'Collect rewards transaction complete. TXID: ' + tx;
          setTxMessage(msg);
          setProcessingTx(false);
          return;
        }catch (e) {
            setTxMessage(`Transaction failed: ${e.message}`);
            setProcessingTx(false);
        }

      },[setTxMessage, setProcessingTx, library]);

    const handleDepositKartTokens = useCallback(
      async (amount:string) => {
        try{
          setProcessingTx(true);
          const contract = utils.getERC20Contract(library, KarteraTokenAddress);
          console.log('account: ', account );
          let allowance = await utils.getAllowance(KartFarmAddress, KarteraTokenAddress, library, account);
          // console.log('allowance: ', allowance.toString() );
        
            if(new BigNumber(allowance.toString()).gte(new BigNumber(amount))){
              try{
                let tx = await kartFarmFunc.DepositKartInFarm(library, amount);
                console.log('Deposit transaction tx hash: ',  tx);
                setTxAddress(tx);
                tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
                let msg = 'Deposit transaction complete. TXID: ' + tx;
                setTxMessage(msg);
                setProcessingTx(false);
                return;
              }catch( e ) {
                setTxMessage(`Deposit Transaction failed: ${e.message}`);
                setProcessingTx(false);
                return;
              }
            }
  
            let tx = await utils.ApproveTransfer(library, KarteraTokenAddress, KartFarmAddress);
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
                      let tx = await kartFarmFunc.DepositKartInFarm(library, amount);
                      console.log('Deposit transaction tx hash: ',  tx);
                      tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
                      let msg = 'Deposit transaction complete. TXID: ' + tx;
                      setTxMessage(msg);
                      setProcessingTx(false);
                  } catch (e) {
                    setTxMessage(`Deposit Transaction failed: ${e.message}`);
                    setProcessingTx(false);
                  }
                }
            });
          }catch (e) {
              setTxMessage(`Transaction failed: ${e.message}`);
              setProcessingTx(false);
          }

      },[setTxMessage, setProcessingTx, library]);

    const handleWithdrawKartTokens = useCallback(
      async (numberOfTokens:string) => {
        try{
          setProcessingTx(true);
          let tx = await kartFarmFunc.WithdrawKartFromFarm(library, numberOfTokens);
          setTxAddress(tx);
          console.log('Withdraw transaction tx hash: ',  tx);
          tx = tx.substring(0, 10) + '...' + tx.substring(tx.length-4);
          let msg = 'Withdraw transaction complete. TXID: ' + tx;
          setTxMessage(msg);
          setProcessingTx(false);
          return;
        }catch (e) {
            setTxMessage(`Transaction failed: ${e.message}`);
            setProcessingTx(false);
        }
      },[setTxMessage, setProcessingTx, library]);

    const handleUnsetTxMessage = useCallback(
        async () =>{
          setTxMessage('');
          setTxAddress('');
        },[setTxMessage]
      );

    useEffect(() => {
    if (account && library) {
        fetchAllFarmInfo(account, library);
    }
    }, [account, library, fetchAllFarmInfo]);

    useEffect(() => {
    if (account && library) {
        fetchAllFarmInfo(account, library);
        let refreshInterval = setInterval(() => fetchAllFarmInfo(account, library), 10000);
        return () => clearInterval(refreshInterval);
    }
    }, [account, library, fetchAllFarmInfo]);

    return(
        <Context.Provider
          value={{
            kFarmUserBalance,
            kFarmKartBalance,
            kFarmTotalSupply,
            kFarmBasketBalance,
            bFarmBasketBalance,
            bFarmUserRewards,
            bFarmUserDeposits,
            txMessage,
            processingTx,
            txAddress,
            unsetTxMessage: handleUnsetTxMessage,
            depositBasketTokens: handleDepositBasketTokens,
            withdrawBasketTokens: handleWithdrawBasketTokens,
            withdrawAllBasketTokens: handleWithdrawAllBasketTokens,
            collectBasketFarmRewards: handleCollectBasketFarmRewards,
            depositKartTokens: handleDepositKartTokens,
            withdrawKartTokens: handleWithdrawKartTokens,
          }}
        >
          {children}
        </Context.Provider>
    );

}

export default Provider;