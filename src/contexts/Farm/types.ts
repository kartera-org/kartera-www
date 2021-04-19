export interface ContextValues {
    kFarmUserBalance: string;
    kFarmKartBalance: string;
    kFarmTotalSupply: string;
    kFarmBasketBalance: string;
    bFarmBasketBalance: string;
    bFarmUserRewards: string;
    bFarmUserDeposits: string;
    txMessage: string;
    processingTx: boolean;
    txAddress: string;
    unsetTxMessage:()=>void;
    depositBasketTokens: (basketAddress:string, amount:string)=>void;
    withdrawBasketTokens: (basketAddress:string, amount:string)=>void;
    withdrawAllBasketTokens: (basketAddress:string)=>void;
    collectBasketFarmRewards: (basketAddress:string)=>void;
    depositKartTokens: (amount:string)=>void;
    withdrawKartTokens: (amount:string)=>void;
};