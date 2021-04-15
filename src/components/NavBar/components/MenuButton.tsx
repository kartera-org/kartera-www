import React from "react";
import styled from "styled-components";

interface buttonI{
    text:string;
    link?:string;
}

const MenuButton : React.FC<buttonI> = ({text, link}) =>{

    return(
        <StyledButton >
            <StyledLink href={link}>{text}</StyledLink>
        </StyledButton>
    )
}

const StyledButton = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 15px;
    justify-content: center;
    align-items: center;
    min-height: 35px;
    fontSize: 18px;
    fontWeight:700;
    opacity: 0.75;
    border: 2px solid transparent;
    &:hover{
        opacity: 1;
        border: 2px solid rbga(200,50,0,0.75);
    }
`;

const StyledLink = styled.a`
    text-decoration: none;
    color: white;
    text-transform: uppercase;
    text-align: center;
`;

export default MenuButton;