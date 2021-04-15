export interface ContextValues {
    txMessage: string;
    processingTx: boolean;
    unsetTxMessage: ()=>void;
    baskets?: BasketI[];
    deposit?: (basketAddress:string, tokenAddress:string, amount: string) => void;
    withdraw?: (basketAddress:string, tokenAddress:string, amount:string) => void;
}

export interface BasketI {
    address: string;
    name?: string;
    symbol?: string;
    decimals?: number;
    price?: string;
    numberOfConstituents?: number;
    numberOfActiveConstituents?: number;
    constituents?: ConstituentI[];
    userBalance?: string;
};

export interface ConstituentI {
    name?: string;
    symbol?: string;
    address: string;
    decimals?: number;
    basketBalance?: string;
    totalSupply?: string;
    exchangeRate?: string;
    userBalance?: string;
};