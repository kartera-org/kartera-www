import React from "react";
import {Typography, Divider} from '@material-ui/core'
import styled from "styled-components";

const Footer: React.FC = () => {
    return(
        <FooterContainer>
            <StyledLink href={'https://abhi-29663.medium.com/introducing-kartera-diversified-basket-token-and-swap-protocol-8563a8e9570c'} target="_blank">Blog</StyledLink>
            <StyledLink href={'https://twitter.com/kartera_org'} rel='noreferrer nofollow' target="_blank">Twitter</StyledLink>
            <StyledLink href={'https://github.com/kartera-org/'} rel='noreferrer nofollow' target="_blank">GitHub</StyledLink>
            <StyledLink href={'https://discord.gg/EdbWcX3z4a'} rel='noreferrer nofollow' target="_blank">Discord</StyledLink>
        </FooterContainer>
    );
}

const FooterContainer = styled.div`
    display: flex;
    background-image: linear-gradient(to bottom right, #150734, #28559A);
    justify-content: center;
    align-items: center;
    height: 10vh;
    @media (max-width: 770px){
        flex-direction: column;
        align-items: center;
        height: auto;
    }
`;

const StyledLink = styled.a`
    text-decoration: none;
    color: white;
    opacity:0.75;
    margin: 2%;
    &:hover{
        opacity: 1;
    }
`;

export default Footer;