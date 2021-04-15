import BigNumber from "bignumber.js";

export interface ContextValues {
  account?: string;
  chainId?: number;
  network?: string;
  balance?: BigNumber;
}