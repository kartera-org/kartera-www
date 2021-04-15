import { createContext } from "react";
import BigNumber from "bignumber.js";
import { ContextValues } from "./types";


const Context = createContext<ContextValues>({});

export default Context;
