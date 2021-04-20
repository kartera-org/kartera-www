import React from "react";
import styled from "styled-components";
import metamaskLogo from "assets/metamask-fox.svg";
import walletConnectLogo from "assets/wallet-connect.svg";

interface buttonI{
    text:string;
    onClick?:any;
    backgroundColor?:string;
    color?:string;
}

const LargeWalletButton : React.FC<buttonI> = ({text, onClick, backgroundColor, color}) =>{

    return(
        <StyledButton onClick={onClick} style={{backgroundColor:backgroundColor?backgroundColor:"#2e6ad1"}}>
            <img src={metamaskLogo} width="50px" />
            <StyledLink style={{color:color?color:"#FFFFFF"}}>{text}</StyledLink>
            <img src={walletConnectLogo} width="50px" />
        </StyledButton>
    )
}

const StyledButton = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 10px;
    justify-content: center;
    align-items: center;
    font-size: max(min(24px, 6vw), 30px);
    min-width: 25vw;
    font-weight:500;
    border-radius: 10px;
    padding: 25px;
    cursor: pointer;
    justify-content: space-between;
    box-shadow: 10px -10px 15px #18273F;
    &:hover{
        opacity: 0.9;
    }
    @media (max-width: 770px){
        flex-direction: column;
        opacity: 1;
    }
`;

const StyledLink = styled.a`
    text-decoration: none;
    text-transform: uppercase;
    text-align: center;
    cursor: pointer;
    opacity: 0.9;
    &:hover{
        opacity: 1;
    }
    @media (max-width: 770px){
        opacity: 1;
    }
`;

export default LargeWalletButton;