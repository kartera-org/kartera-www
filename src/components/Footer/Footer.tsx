import React from "react";
import styled from "styled-components";

const Footer: React.FC = () => {
    return(
        <FooterContainer>
            <FooterLinks>
                <StyledLink href={'https://abhi-29663.medium.com/introducing-kartera-diversified-basket-token-and-swap-protocol-8563a8e9570c'} target="_blank">Blog</StyledLink>
                <StyledLink href={'https://twitter.com/kartera_org'} rel='noreferrer nofollow' target="_blank">Twitter</StyledLink>
                <StyledLink href={'https://github.com/kartera-org/'} rel='noreferrer nofollow' target="_blank">GitHub</StyledLink>
                <StyledLink href={'https://discord.gg/EdbWcX3z4a'} rel='noreferrer nofollow' target="_blank">Discord</StyledLink>
            </FooterLinks>
            <FooterLinks>
            <a href="https://www.freepik.com/vectors/background"  style={{color:'white', fontSize:'10px'}}>Background vector created by kjpargeter - www.freepik.com</a>
            </FooterLinks>
        </FooterContainer>
    );
}

const FooterContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 10vh;
    @media (max-width: 770px){
        flex-direction: column;
        align-items: center;
        height: auto;
    }
`;

const FooterLinks = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px;
`;

const StyledLink = styled.a`
    text-decoration: none;
    color: white;
    opacity:0.75;
    margin: 10px 20px;
    &:hover{
        opacity: 1;
    }
`;

export default Footer;