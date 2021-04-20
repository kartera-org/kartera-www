import React, { useState, useCallback } from "react";
import { IconButton } from '@material-ui/core'
import styled, { keyframes } from "styled-components";
import MenuIcon from '@material-ui/icons/Menu';
import Menu from "./components/Menu";
import WalletButton from "components/WalletButton";

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
            <LogoText>KARTERA</LogoText>
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
  background-image: linear-gradient(to bottom right, #150734, #28559A);
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
  marginLeft: 25px;
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

export default Navbar;
