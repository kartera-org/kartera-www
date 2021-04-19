import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { isAddress } from "web3-utils";

import ERC20 from "constants/abi/ERC20.json";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const ApproveTransfer = async (provider:any, tokenAddress:string, receiverAddress:string):Promise<string>=>{
  let signer = await provider.getSigner(0);
  let contract = getERC20Contract(provider, tokenAddress);
  try{
      let res = await contract.connect(signer).approve(receiverAddress, ethers.constants.MaxUint256);
      console.log('approve tx: ', res );
      return res['hash'];
  }catch(e){
      throw(e);
  }
}

export const getAllowance = async (spenderAddress: string, tokenAddress: string, provider: any, userAddress:any): Promise<string> => {
  const tokenContract = getERC20Contract(provider, tokenAddress);
  let signer = await provider.getSigner(0);
  try {
    console.log('signer: ', signer );
    const allowance: string = await tokenContract.allowance(userAddress, spenderAddress);
    return allowance;
  } catch (e) {
    console.log('error getting allowance: ', e );
    throw (e);
  }
};

export const getEthBalance = async (provider: any, userAddress: string): Promise<string> => {
  try {
    let balance = await provider.getBalance(userAddress);
    let formattedBal = parseFloat(ethers.utils.formatUnits(balance, 18));
    let bal = formattedBal.toString();
    return bal;
  } catch (e) {
    throw (e);
  }
};

export const getBalance = async (provider: any, tokenAddress: string, userAddress: string, decimals:number): Promise<string> => {
  const tokenContract = getERC20Contract(provider, tokenAddress);
  try {
    let balance = await tokenContract.balanceOf(userAddress);
    let formattedBal = ethers.utils.formatUnits(balance, decimals);
    // let bal = formattedBal.toString();
    return formattedBal;
  } catch (e) {
    console.log('error in getting balance: tknAddr:', tokenAddress, ' usrAddr', userAddress );
    throw (e);
  }
}; 

export const TotalSupply = async (provider:any, tokenAddress:string) =>{
  const contract = getERC20Contract(provider, tokenAddress);
  let totalsupply = await contract.totalSupply();
  totalsupply = ethers.utils.formatUnits(totalsupply);
  return totalsupply;
}

export const Name = async (provider:any, tokenAddress:string) =>{
  const contract = getERC20Contract(provider, tokenAddress);
  try {
    let name = await contract.name();
    return name;
  } catch(e){
    throw(e);
  }
}

export const Symbol = async (provider:any, tokenAddress:string) =>{
  const contract = getERC20Contract(provider, tokenAddress);
  try {
    let n = await contract.symbol();
    return n;
  } catch(e){
    throw(e);
  }
}

export const Decimals = async (provider:any, tokenAddress:string) =>{
  const contract = getERC20Contract(provider, tokenAddress);
  try {
    const n:number = await contract.decimals();
    return n;
  } catch(e){
    throw(e);
  }
}

export const getERC20Contract = (provider: any, address: string) => {
  const contract = new ethers.Contract(address, ERC20.abi, provider);
  return contract;
};

export const bnToDec = (bn: BigNumber, decimals = 18) => {
  return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber();
};

export const decToBn = (dec: number, decimals = 18) => {
  return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals));
};

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
  return balance.dividedBy(new BigNumber(10).pow(decimals)).toString();
};

export const getNearestBlock = (from: Array<any>, target: number) => {
  return from.reduce(function (prev: any, curr: any) {
    return Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev;
  });
};

export const getAMPM = (date: any) => {
  const hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  return ampm;
};

export const getTimestampDate = (obj: { ts: number; ap?: boolean }) => {
  const d = new Date(obj.ts * 1000);
  const s = ".";
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear().toString().substring(0, 2) + (obj.ap ? " " + getAMPM(d) : "");
  return (day < 9 ? "0" + day : day) + s + (month <= 9 ? "0" + month : month) + s + year;
};

export const validateAddress = (address: string) => isAddress(address);
