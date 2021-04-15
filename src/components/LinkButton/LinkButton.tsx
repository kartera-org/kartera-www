import React from "react";
import styled from "styled-components";

interface buttonI{
    text:string;
    link?:string;
}

const LinkButton : React.FC<buttonI> = ({text, link}) =>{

    return(
        <StyledButton >
            <StyledLink href={link}>{text}</StyledLink>
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
    background-color: #96FBFF;
    fontSize: 18px;
    fontWeight:700;
    border-radius: 5px;
    padding: 10px 20px;
    opacity: 0.75;
    border: 2px solid transparent;
    &:hover{
        opacity: 1;
        border: 2px solid rbga(200,50,0,0.75);
    }
`;

const StyledLink = styled.a`
    text-decoration: none;
    color: black;
    text-transform: uppercase;
    text-align: center;
`;

export default LinkButton;