import SwapFarm from "constants/abi/SwapFarm.json";
import { SwapFarmAddress } from "constants/tokenAddresses";
import { ethers } from 'ethers';
import * as utils from "utils/index";

export const SwapFarmContract = (provider:any)=> {
    return new ethers.Contract(SwapFarmAddress, SwapFarm.abi, provider);
}

export const NumberOfBaskets= async (provider:any) => {
    const swapFarmContract = SwapFarmContract(provider);
    let n = await swapFarmContract.nummberOfBaskets();
    return n;
}

export const BasketAddress = async (provider:any, indx:number) =>{
    const swapFarmContract = SwapFarmContract(provider);
    let addr = await swapFarmContract.basketAddress(indx);
    return addr;
}

export const BasketAllocation = async (provider:any, basketaddr:string) => {
    const swapFarmContract = SwapFarmContract(provider);
    let details = await swapFarmContract.basketAllocation(basketaddr);
    return details;
}

export const AccumulatedRewards = async (provider:any, userAddress:string, basketaddr:string) => {
    const swapFarmContract = SwapFarmContract(provider);
    try{
        let rewards = await swapFarmContract.accumulatedRewards(userAddress, basketaddr);
        return ethers.utils.formatUnits(rewards, 18);
    }catch(e){
        console.log('e: ', e );
        throw(e);
    }
}

export const LockedTokens = async (provider:any, userAddress:string, basketaddr:string) => {
    const swapFarmContract = SwapFarmContract(provider);
    try{
        let lockedtkns = await swapFarmContract.lockedTokens(userAddress, basketaddr)
        return ethers.utils.formatUnits(lockedtkns);
    }catch(e){
        console.log('error: ', e );
        throw(e);
    }
}

export const Deposit = async (provider:any, basketaddr:string, numberOfTokens:string) => {
    const swapFarmContract = SwapFarmContract(provider);
    let signer = await provider.getSigner(0);
    try{
        let deposittx = await swapFarmContract.connect(signer).deposit(basketaddr, numberOfTokens);
        return deposittx['hash'];
    }catch(e){
        console.log('error: ', e );
        throw(e);
    }
}

export const Withdraw = async (provider:any, basketaddr:string, numberOfTokens:string) => {
    const swapFarmContract = SwapFarmContract(provider);
    let signer = await provider.getSigner(0);
    try{
        let deposittx = await swapFarmContract.connect(signer).withdraw(basketaddr, numberOfTokens);
        return deposittx['hash'];
    }catch(e){
        console.log('error: ', e );
        throw(e);
    }
}

export const WithdrawAll = async (provider:any, basketaddr:string) => {
    const swapFarmContract = SwapFarmContract(provider);
    let signer = await provider.getSigner(0);
    try{
        let deposittx = await swapFarmContract.connect(signer).withdrawAll(basketaddr);
        return deposittx['hash'];
    }catch(e){
        console.log('error: ', e );
        throw(e);
    }
}

export const Collect = async (provider:any, basketaddr:string) => {
    const swapFarmContract = SwapFarmContract(provider);
    let signer = await provider.getSigner(0);
    try{
        let deposittx = await swapFarmContract.connect(signer).collectRewards(basketaddr);
        return deposittx['hash'];
    }catch(e){
        console.log('error: ', e );
        throw('error');
    }
}