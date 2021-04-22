export interface ContextValues {
    txMessage: string;
    txAddress: string;
    processingTx: boolean;
    unsetTxMessage: ()=>void;
    baskets?: BasketI[];
    deposit?: (basketAddress:string, tokenAddress:string, amount: string) => void;
    withdraw?: (basketAddress:string, tokenAddress:string, amount:string) => void;
    swap?: (basketAddress:string, tokenAddressFrom:string, tokenAddressTo:string, amount:string) => void;
    swapRate?: (basketAddress:string, tokenAddressFrom:string, tokenAddressTo:string) => Promise<string>;
    tradingAllowed?: (basketAddress:string) => Promise<boolean>;
}

export interface BasketI {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    price: string;
    numberOfConstituents: number;
    numberOfActiveConstituents: number;
    constituents: ConstituentI[];
    userBalance: string;
    totalSupply: string;
    withdrawCost:string;
};

export interface ConstituentI {
    name: string;
    symbol: string;
    active: boolean;
    address: string;
    decimals: number;
    basketBalance: string;
    exchangeRate: string;
    userBalance: string;
};