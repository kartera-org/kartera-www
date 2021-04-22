import { createContext } from "react";
import { ContextValues } from "./types";

const Context = createContext<ContextValues>({
    txMessage:'',
    txAddress: '',
    processingTx:false,
    unsetTxMessage:()=>{}}
);

export default Context;
