import React, { useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import MenuButton from "./MenuButton"
import MenuItems from "./MenuItems"

interface MenuI {
    onDismiss: () => void;
    mobileMenu?: boolean;
  }

const Menu: React.FC<MenuI> = ({ onDismiss, mobileMenu }) => {
    return (
      <>
        { mobileMenu && (
          <StyledBackdrop onClick={onDismiss} />
        )}
        <StyledNav>
            <MobileTitle>KARTERA</MobileTitle>
            {MenuItems.map((item, index) => {
                return (
                  <MenuButton key={`menu${index}`} link={item.url} text={item.title}></MenuButton>
            )})}
        </StyledNav>
      </>
    );
  };
  
  const slideIn = keyframes`
    0% {
      transform: translateX(-100%)
    }
    100% {
      transform: translateX(0);
    }
  `;
  
  const StyledNav = styled.div`
    align-items: center;
    display: flex;
    @media (max-width: 770px) {
      animation: ${slideIn} 0.3s forwards ease-out;
      flex-direction: column;
      position: fixed;
      background: #000000;
      justify-content: flex-start;
      padding-top: 50px;
      width: 60%;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1000;
    }
  `;
  
  const StyledBackdrop = styled.div`
    background-color: #000000;
    opacity: 0.75;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  `;

  const MobileTitle = styled.div`
    display: none;
    font-size: 30px;
    font-weight: 700;
    color: white;
    @media (max-width: 770px){
        display: block;
    }
  `;  
  
  export default Menu;
  