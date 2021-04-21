import React, { useState, useCallback } from "react";
import { IconButton } from '@material-ui/core'
import styled, { keyframes } from "styled-components";
import MenuIcon from '@material-ui/icons/Menu';
import Menu from "./components/Menu";
import WalletButton from "components/WalletButton";
import KartIcon from "assets/images/kart_icon.png";

const Navbar : React.FC = (props)=> {

  const [mobileMenu, setMobileMenu] = useState(false);

  const handleDismissMobileMenu = useCallback(() => {
    setMobileMenu(false);

  }, [setMobileMenu]);

  const handlePresentMobileMenu = useCallback(() => {
    setMobileMenu(true);
  }, [setMobileMenu]);

    return (
      <StyledNavBar>
        <StyledNavBarInner>
          <Logo>
              <IconDiv>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={()=>{handlePresentMobileMenu()}}>
                  <MenuIcon />
                </IconButton>
              </IconDiv>
              <LogoImgContainer>
                <img src={KartIcon} alt="kartera" width="50px"/>
              <LogoText>KARTERA</LogoText>
              </LogoImgContainer>

          </Logo>
          
          {mobileMenu?
              <MobileMenuContainer>
                <Menu onDismiss={handleDismissMobileMenu} mobileMenu={mobileMenu}/>
              </MobileMenuContainer>
              :
              <MenuContainer>
                <Menu onDismiss={handleDismissMobileMenu} mobileMenu={mobileMenu}/>
              </MenuContainer>

          }
          <WalletButton />
        </StyledNavBarInner>
      </StyledNavBar>
    );
}

const MobileMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
`;

const MenuContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledNavBar = styled.div`
  color: white;
  height:auto;
  align-items: center;
`;

const StyledNavBarInner = styled.div`
  display: flex;
  padding: 20px;
  color: white;
  width: 100%-150px;
  align-items: center;
  justify-content: space-between;
`;

const LogoText = styled.div`
  font-size: 30px;
  font-weight: 900;
  margin-left: 10px;
  @media (max-width: 860px) {
    margin-left: 5px;
  }
`;

const Logo = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

const slideIn = keyframes`
  0% {
    transform: translateX(-100%)
  }
  100% {
    transform: translateX(0);
  }
`;

const IconDiv = styled.div`
  display: none;
  @media (max-width: 770px) {
    display: block;
  }
`;

const LogoImgContainer = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 770px) {
}
`;

export default Navbar;
