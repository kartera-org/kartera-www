import { createContext } from "react";
import { ContextValues } from "./types"


const Context = createContext<ContextValues>({userBalance:"", basketBalance:"", swapFarmBalance:"", karteraFarmBalance:"", ethBalance:"", accAddress:""});

export default Context;
