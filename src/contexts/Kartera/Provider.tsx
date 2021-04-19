import React, { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import {BigNumber} from "bignumber.js";
import { useWeb3React } from '@web3-react/core';
import { KarteraTokenAddress, BasketAddresses, SwapFarmAddress, KartFarmAddress } from "constants/tokenAddresses";
import { ContextValues } from "./types";
import  * as utils from "utils";

import Context from "./Context";


const Provider: React.FC = ({ children }) => {

    const [userBalance, setUserBalance] = useState<string>('');
    const [basketBalance, setBasketBalance] = useState<string>('');
    const [swapFarmBalance, setSwapFarmBalance] = useState<string>('');
    const [karteraFarmBalance, setKarteraFarmBalance] = useState<string>('');
    const [ethBalance, setEthBalance] = useState<string>('');
    const [accAddress, setAccAddress] = useState<string>('');

    const web3context = useWeb3React();
    const { chainId, account, library, activate, active, deactivate, error } = web3context;

    const fetchAllKartTokenInfo = useCallback(
        async (userAddress: string, provider: any) => {
            try{
                let userbal = await utils.getBalance(provider, KarteraTokenAddress, userAddress, 18);
                setUserBalance(userbal);
                let basketbal = await utils.getBalance(provider, KarteraTokenAddress, BasketAddresses[0], 18);
                setBasketBalance(basketbal);
                let swapfarmbal = await utils.getBalance(provider, KarteraTokenAddress, SwapFarmAddress, 18);
                setSwapFarmBalance(swapfarmbal);
                let kartfarmbal = await utils.getBalance(provider, KarteraTokenAddress, KartFarmAddress, 18);
                setKarteraFarmBalance(kartfarmbal);
                let ethBal = await utils.getEthBalance(provider, userAddress);
                setEthBalance(ethBal);
                setAccAddress(userAddress);

            }catch( e ) {
                console.log('error in kart provider: ', e );
            }

        },[setUserBalance, setBasketBalance, setSwapFarmBalance, setKarteraFarmBalance, setEthBalance, setAccAddress]
    );

    useEffect(() => {
        if (account && library) {
            fetchAllKartTokenInfo(account, library);
            // setUserAddress(account);
        }
      }, [account, library, fetchAllKartTokenInfo]);
    
      useEffect(() => {
        if (account && library) {
            fetchAllKartTokenInfo(account, library);
          let refreshInterval = setInterval(() => fetchAllKartTokenInfo(account, library), 7000);
          return () => clearInterval(refreshInterval);
        }
      }, [account, library, fetchAllKartTokenInfo]);

    return(
        <Context.Provider
          value={{
            userBalance,
            basketBalance,
            swapFarmBalance,
            karteraFarmBalance,
            ethBalance,
            accAddress
          }}
        >
          {children}
        </Context.Provider>
    );

}

export default Provider;