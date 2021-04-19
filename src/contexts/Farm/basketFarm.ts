import SwapFarm from "constants/abi/SwapFarm.json";
import { SwapFarmAddress } from "constants/tokenAddresses";
import { ethers } from 'ethers';
import * as utils from "utils/index";

export const BasketFarmContract = (provider:any)=> {
    return new ethers.Contract(SwapFarmAddress, SwapFarm.abi, provider);
}

export const NumberOfBaskets= async (provider:any) => {
    const basketFarmContract = BasketFarmContract(provider);
    let n = await basketFarmContract.nummberOfBaskets();
    return n;
}

export const BasketAddress = async (provider:any, indx:number) =>{
    const basketFarmContract = BasketFarmContract(provider);
    let addr = await basketFarmContract.basketAddress(indx);
    return addr;
}

export const BasketAllocation = async (provider:any, basketaddr:string) => {
    const basketFarmContract = BasketFarmContract(provider);
    let details = await basketFarmContract.basketAllocation(basketaddr);
    return details;
}

export const AccumulatedRewards = async (provider:any, userAddress:string, basketaddr:string) => {
    const basketFarmContract = BasketFarmContract(provider);
    try{
        let rewards = await basketFarmContract.accumulatedRewards(userAddress, basketaddr);
        return ethers.utils.formatUnits(rewards, 18);
    }catch(e){
        console.log('e: ', e );
        throw(e);
    }
}

export const LockedTokens = async (provider:any, userAddress:string, basketaddr:string) => {
    const basketFarmContract = BasketFarmContract(provider);
    try{
        let lockedtkns = await basketFarmContract.lockedTokens(userAddress, basketaddr)
        return ethers.utils.formatUnits(lockedtkns);
    }catch(e){
        console.log('error: ', e );
        throw(e);
    }
}

export const Deposit = async (provider:any, basketaddr:string, numberOfTokens:string) => {
    const basketFarmContract = BasketFarmContract(provider);
    let signer = await provider.getSigner(0);
    try{
        let deposittx = await basketFarmContract.connect(signer).deposit(basketaddr, numberOfTokens);
        return deposittx['hash'];
    }catch(e){
        console.log('error: ', e );
        throw('error');
        return;
    }
}

export const Withdraw = async (provider:any, basketaddr:string, numberOfTokens:string) => {
    const basketFarmContract = BasketFarmContract(provider);
    let signer = await provider.getSigner(0);
    try{
        let deposittx = await basketFarmContract.connect(signer).withdraw(basketaddr, numberOfTokens);
        return deposittx['hash'];
    }catch(e){
        console.log('error: ', e );
        throw(e);
    }
}

export const WithdrawAll = async (provider:any, basketaddr:string) => {
    const basketFarmContract = BasketFarmContract(provider);
    let signer = await provider.getSigner(0);
    try{
        let deposittx = await basketFarmContract.connect(signer).withdrawAll(basketaddr);
        return deposittx['hash'];
    }catch(e){
        console.log('error: ', e );
        throw(e);
    }
}

export const Collect = async (provider:any, basketaddr:string) => {
    const basketFarmContract = BasketFarmContract(provider);
    let signer = await provider.getSigner(0);
    try{
        let deposittx = await basketFarmContract.connect(signer).collectRewards(basketaddr);
        return deposittx['hash'];
    }catch(e){
        console.log('error: ', e );
        throw('error');
    }
}