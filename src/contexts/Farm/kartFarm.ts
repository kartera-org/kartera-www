import KartFarm from "constants/abi/KarteraFarm.json";
import { KartFarmAddress, KarteraTokenAddress } from "constants/tokenAddresses";
import { ethers } from 'ethers';
import * as utils from "utils/index";

export const KarteraFarmContract = (provider:any)=> {
    return new ethers.Contract(KartFarmAddress, KartFarm.abi, provider);
}

export const DepositKartInFarm = async (provider:any, numberOfTokens:string) => {
    const kartFarmContract = KarteraFarmContract(provider);
    let signer = await provider.getSigner(0);
    try{
        const kartFarmContract = KarteraFarmContract(provider);
        let deposittx = await kartFarmContract.connect(signer).deposit(numberOfTokens);
        return deposittx['hash'];
    }catch(e){
        console.log('error: ', e );
        throw(e);
    }
}

export const WithdrawKartFromFarm = async (provider:any, numberOfTokens:string) => {
    const kartFarmContract = KarteraFarmContract(provider);
    let signer = await provider.getSigner(0);
    try{
        let deposittx = await kartFarmContract.connect(signer).withdraw(numberOfTokens);
        return deposittx['hash'];
    }catch(e){
        console.log('error: ', e );
        throw('error');
    }
}

export const NumberOfBaskets = async (provider:any, ) => {
    const kartFarmContract = KarteraFarmContract(provider);
    try{
        let n = await kartFarmContract.numberOfBaskets();
        return n;
    }catch(e){
        console.log('error: ', e );
        throw(e);
    }
}