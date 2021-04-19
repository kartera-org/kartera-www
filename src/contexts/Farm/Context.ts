import { createContext } from "react";
import { ContextValues } from "./types";


const Context = createContext<ContextValues>({
    kFarmUserBalance: "",
    kFarmKartBalance: "",
    kFarmTotalSupply: "",
    kFarmBasketBalance: "",
    bFarmBasketBalance: "",
    bFarmUserRewards: "",
    bFarmUserDeposits: "",
    txMessage:"",
    processingTx:false,
    txAddress:"",
    unsetTxMessage:()=>{},
    depositBasketTokens: (basketAddress:string, amount:string)=>{},
    withdrawBasketTokens: (basketAddress:string, amount:string)=>{},
    collectBasketFarmRewards: (basketAddress:string)=>{},
    depositKartTokens: (n:string)=>{},
    withdrawKartTokens: (n:string)=>{},
    withdrawAllBasketTokens: (basketAddress:string)=>{},
});

export default Context;
