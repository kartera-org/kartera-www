import React, { useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import CloseIcon from '@material-ui/icons/Close';

interface MessageModalI{
    header?:string;
    message?:string;
    state:boolean;
    handleClose(): void;
}

const CustomModal: React.FC<MessageModalI> = ( {header, message, state, handleClose} ) => {
    return (
      <>
        { state && (
            <>
                <StyledBackdrop onClick={handleClose} />

                <StyledModal>
                    <HeaderContainer>
                        <Header>{header}</Header>
                        <CloseIcon onClick={handleClose} color="secondary" />
                    </HeaderContainer>  
                    <Body>{message}</Body>
                </StyledModal>
            </>
        )}
      </>
    );
  };

  const StyledBackdrop = styled.div`
    background-color: #000000;
    opacity: 0.75;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 200%;
  `;
  
  const StyledModal = styled.div`
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: fixed;
      background: #FFFFFF;
      border-radius: 10px;
      width: 25%;
      top: 50%;
      left: 50%;
      z-index: 1000;
      transform: translate(-50%, -50%);
  `;

  const HeaderContainer = styled.div`
    display: flex;
    padding: 20px;
    background-color: #eee;
    border-radius: 10px 10px 0 0;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid lightgray;
  `;

  const Header = styled.div`
    display: flex;
    font-size: 25px;
    font-weight: 600;
    color: black;
  `;

  const Body = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: 300;
    color: black;
    margin: 5% 0;
  `;

  const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
  `;
  
  export default CustomModal;
