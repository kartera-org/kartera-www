import React, { useState, useCallback } from "react";
import { Link } from 'react-router-dom';
import { Grid, Container, Button } from "@material-ui/core";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

interface TopBarProps {
}

const TopBar: React.FC<TopBarProps> = () => {
  const location = useLocation();

  return (
    <Grid container >
      
    </Grid>
  );
};

const StyledLogoWrapper = styled.div`
  width: 156px;
  @media (max-width: 400px) {
    width: auto;
  }
`;

const StyledTopBar = styled.div``;

const StyledTopBarInner = styled.div`
  align-items: center;
  display: flex;
  height: 72px;
  justify-content: space-between;
  max-width: ${(props) => props.theme.siteWidth}px;
  width: 100%;
`;

const StyledNavWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledMobileMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
`;

const StyledAccountButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  width: 210px;
  @media (max-width: 400px) {
    justify-content: center;
    width: auto;
  }
`;

const StyledMenuButton = styled.button`
  background: none;
  border: 0;
  margin: 0;
  outline: 0;
  padding: 0;
  display: none;
  @media (max-width: 770px) {
    align-items: center;
    display: flex;
    height: 44px;
    justify-content: center;
    width: 44px;
  }
`;

const StyledLeftMenuBalancesWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 72px;
  justify-content: space-between;
`;

const StyledTopBarDarkModeSwitch = styled.div`
  @media (max-width: 1130px) {
    display: none;
  }
`;

export default TopBar;
