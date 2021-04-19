import React from "react";
import styled from "styled-components";

interface buttonI{
    text:string;
    onClick?:any;
    backgroundColor?:string;
    color?:string;
}

const Button : React.FC<buttonI> = ({text, onClick, backgroundColor, color}) =>{

    return(
        <StyledButton onClick={onClick} style={{backgroundColor:backgroundColor?backgroundColor:"#18273F"}}>
            <StyledLink style={{color:color?color:"#FFFFFF"}}>{text}</StyledLink>
        </StyledButton>
    )
}

const StyledButton = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 10px;
    justify-content: center;
    align-items: center;
    width: 150px;
    min-height: 35px;
    font-size: max(min(18px, 4.5vw), 12px);
    font-weight:500;
    border-radius: 5px;
    padding: 10px 20px;
    border: 2px solid transparent;
    cursor: pointer;
    @media (max-width: 770px){
        width: 35%;
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
`;

export default Button;