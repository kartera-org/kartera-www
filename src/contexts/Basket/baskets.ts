import SwapBasket from "constants/abi/SwapBasket.json";
import { BigNumber, ethers } from 'ethers';
import * as utils from "utils/index";

export const addr0 = '0x0000000000000000000000000000000000000000';
export const addr1 = '0x0000000000000000000000000000000000000001';

export const getBasketContract = (provider: any, address: string) => {
    const contract = new ethers.Contract(address, SwapBasket.abi, provider);
    return contract;
  };

export const NumberOfConstituents = async (provider:any, basketAddress:string) =>{
    const contract = getBasketContract(provider, basketAddress);
    try{
        let n = await contract.numberOfConstituents();
        return n;
    }catch( e ) 
    {
        console.log('error in numberOfConstituents: ',  e);
        throw(e);
    }
}

export const NumberOfActiveConstituents = async (provider:any, basketAddress:string) =>{
    const contract = getBasketContract(provider, basketAddress);
    try{
        let n = await contract.numberOfActiveConstituents();
        return n;
    }catch( e ) 
    {
        console.log('error in numberOfActiveConstituents: ',  e);
        throw(e);
    }
}

export const ConstituentAddress = async (provider:any, basketAddress:string, indx:number) =>{
    const contract = getBasketContract(provider, basketAddress);
    try{
        let addr = await contract.constituentAddress(indx);
        return addr;
    }catch( e ) {
        throw(e);
    }
}

export const ConstituentDetails = async (provider:any, basketAddress:string, tokenAddress:string) =>{
    const contract = getBasketContract(provider, basketAddress);
    try{
        let details = await contract.constituentInfo(tokenAddress);
        return details;
    } catch ( e ) {
        throw(e);
    }
}

export const BasketPrice = async (provider:any, basketAddress:string) =>{
    const contract = getBasketContract(provider, basketAddress);
    try {
        let price = await contract.basketTokenPrice();
        let prc = parseFloat(ethers.utils.formatUnits(price, 18)).toString();
        return prc;
    } catch ( e ) {
        throw(e);
    }
}

export const ExchangeRate = async (provider:any, basketAddress:string, tokenAddress:string) =>{
    const contract = getBasketContract(provider, basketAddress);
    try {
        let exrate = await contract.exchangeRate(tokenAddress);
        let exchangeRate =  parseFloat(ethers.utils.formatUnits(exrate, 18)).toString();
        return exchangeRate;
    } catch ( e ) {
        throw(e);
    }
}

export const WithdrawCost = async (provider:any, basketAddress:string) =>{
    const contract = getBasketContract(provider, basketAddress);
    try {
        let withdrawCost = await contract.withdrawCost(ethers.utils.parseEther('1'));
        return ethers.utils.formatUnits(withdrawCost, 18)
    } catch ( e ) {
        throw(e);
    }
}

export const ActualWithdrawCost = async (provider:any, basketAddress:string, numberOfTokens:string) =>{
    const contract = getBasketContract(provider, basketAddress);
    try {
        let withdrawCost = await contract.withdrawCost(numberOfTokens);
        return withdrawCost
    } catch ( e ) {
        throw(e);
    }
}

export const MakeEthDeposit = async (provider:any, basketAddress:string, numberOfTokens:string) =>{
    const contract = getBasketContract(provider, basketAddress);
    let signer = await provider.getSigner(0);
    try{
        let deposittx = await contract.connect(signer).addLiquidity(addr1, numberOfTokens, {value:numberOfTokens});
        return deposittx['hash'];
    }catch( e ){
        console.log('error: ', e );
        throw(e);
    }
}

export const MakeDeposit = async (provider:any, basketAddress:string, tokenAddress:string, numberOfTokens:string) =>{
    const contract = getBasketContract(provider, basketAddress);
    let signer = await provider.getSigner(0);
    try{
        let deposittx = await contract.connect(signer).addLiquidity(tokenAddress, numberOfTokens);
        return deposittx['hash'];
    }catch(e){
        throw(e);
    }
}

export const WithdrawLiquidity = async (provider:any, basketAddress:string, tokenAddress:string, numberOfTokens:string) =>{
    const contract = getBasketContract(provider, basketAddress);
    let signer = await provider.getSigner(0);
    console.log('siger: ', signer );
    try{
        console.log('tokenAddress: ', tokenAddress );
        console.log('numberOfTokens: ', numberOfTokens );
        let deposittx = await contract.connect(signer).withdrawLiquidity(tokenAddress, numberOfTokens);
        return deposittx['hash'];
    }catch(e){
        console.log('withdrawliquidity error: ', e.message );
        throw(e);
    }
}

export const Swap = async (provider:any, basketAddress:string, addrFrom:string, addrTo:string, numberOfTokens:string) =>{
    const contract = getBasketContract(provider, basketAddress);
    let signer = await provider.getSigner(0);
    try{
        let swaptx = await contract.connect(signer).swap(addrFrom, addrTo, numberOfTokens);
        return swaptx['hash'];
    }catch(e){
        console.log('error: ', e );
        throw(e);
    }
}

export const SwapEth = async (provider:any, basketAddress:string, addrFrom:string, addrTo:string, numberOfTokens:string) =>{
    const contract = getBasketContract(provider, basketAddress);
    let signer = await provider.getSigner(0);
    try{
        let deposittx = await contract.connect(signer).swap(addrFrom, addrTo, numberOfTokens, {value:numberOfTokens});
        return deposittx['hash'];
    }catch( e ){
        console.log('error: ', e );
        throw(e);
    }
}

export const SwapRate = async (provider:any, basketAddress:string, addrFrom:string, addrTo:string) =>{
    const contract = getBasketContract(provider, basketAddress);
    try{
        let exrate = await contract.swapRate(addrFrom, addrTo);
        let rate:string = exrate.toString();
        return rate;
    }catch(e){
        console.log('error: ', e );
        throw(e);
    }
}

export const TradingAllowed = async (provider:any, basketAddress:string) =>{
    const contract = getBasketContract(provider, basketAddress);
    try{
        let state = await contract.tradingAllowed_();
        return state;
    }catch(e){
        throw(e);
    }
}