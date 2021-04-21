import React from "react";
import styled from "styled-components";

interface buttonI{
    text:string;
    onClick?:any;
    backgroundColor?:string;
    color?:string;
    link?:string;
}

const SmallButton : React.FC<buttonI> = ({text, onClick, backgroundColor, color, link}) =>{

    return(
        <StyledButton onClick={onClick} style={{backgroundColor:backgroundColor?backgroundColor:"#18273F"}} >
            <StyledLink href={link} style={{color:color?color:"#FFFFFF"}}>{text}</StyledLink>
        </StyledButton>
    )
}

const StyledButton = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 10px;
    justify-content: center;
    align-items: center;
    font-size: max(min(14px, 4.5vw), 12px);
    font-weight:500;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    box-shadow: 0 3px 8px #000;
    @media (max-width: 770px){
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

export default SmallButton;