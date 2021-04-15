import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import Web3 from "web3";
import { provider, TransactionReceipt } from "web3-core";
import { AbiItem, isAddress } from "web3-utils";

import ERC20 from "constants/abi/ERC20.json";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const waitTransaction = async (provider: provider, txHash: string) => {
  const web3 = new Web3(provider);
  let txReceipt: TransactionReceipt | null = null;
  while (txReceipt === null) {
    const r = await web3.eth.getTransactionReceipt(txHash);
    txReceipt = r;
    await sleep(2000);
  }
  return txReceipt.status;
};

export const approve = async (
  userAddress: string,
  spenderAddress: string,
  tokenAddress: string,
  provider: provider,
  amount: string,
  onTxHash?: (txHash: string) => void
): Promise<boolean> => {
  try {
    const tokenContract = getERC20Contract(provider, tokenAddress);
    return tokenContract
      .approve(spenderAddress, amount)
      .send({ from: userAddress }, async (error: any, txHash: string) => {
        if (error) {
          console.log("ERC20 could not be approved", error);
          onTxHash && onTxHash("");
          return false;
        }
        if (onTxHash) {
          onTxHash(txHash);
        }
        const status = await waitTransaction(provider, txHash);
        if (!status) {
          console.log("Approval transaction failed.");
          return false;
        }
        return true;
      });
  } catch (e) {
    console.log("error", e);
    return false;
  }
};

export const ApproveTransfer = async (provider:any, tokenAddress:string, receiverAddress:string, numberOfTokens:string):Promise<string>=>{
  let signer = await provider.getSigner(0);
  let contract = getERC20Contract(provider, tokenAddress);
  try{
      let res = await contract.connect(signer).approve(receiverAddress, numberOfTokens);
      console.log('approve tx: ', res );
      return res['hash'];
  }catch(e){
      throw(e);
  }
}

export const getAllowance = async (userAddress: string, spenderAddress: string, tokenAddress: string, provider: provider): Promise<string> => {
  try {
    const tokenContract = getERC20Contract(provider, tokenAddress);
    const allowance: string = await tokenContract.allowance(userAddress, spenderAddress);
    return allowance;
  } catch (e) {
    return "0";
  }
};

export const getEthBalance = async (provider: any, userAddress: string): Promise<string> => {
  try {
    let balance = await provider.getBalance(userAddress);
    let formattedBal = parseFloat(ethers.utils.formatUnits(balance, 18));
    let bal = formattedBal.toFixed(4);
    return bal;
  } catch (e) {
    return "0";
  }
};

export const getBalance = async (provider: any, tokenAddress: string, userAddress: string, decimals:number): Promise<string> => {
  const tokenContract = getERC20Contract(provider, tokenAddress);
  try {
    let balance: string = await tokenContract.balanceOf(userAddress);
    let formattedBal = parseFloat(ethers.utils.formatUnits(balance, decimals));
    let bal = formattedBal.toFixed(4);
    return bal;
  } catch (e) {
    return "0";
  }
};

export const TotalSupply = async (provider:any, tokenAddress:string) =>{
  const contract = getERC20Contract(provider, tokenAddress);
  let totalsupply = await contract.totalSupply();
  return totalsupply;
}

export const Name = async (provider:any, tokenAddress:string) =>{
  const contract = getERC20Contract(provider, tokenAddress);
  try {
    let name = await contract.name();
    return name;
  } catch(e){
    return '';
  }
}

export const Symbol = async (provider:any, tokenAddress:string) =>{
  const contract = getERC20Contract(provider, tokenAddress);
  try {
    let n = await contract.symbol();
    return n;
  } catch(e){
    return '';
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
  return balance.dividedBy(new BigNumber(10).pow(decimals)).toFixed();
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
