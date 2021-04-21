import React from "react";
import styled from "styled-components";

import SmallButton from "components/SmallButton";

interface WalletCardI {
    icon: any;
    name: string;
    onClick: () => void;
  }

const WalletCard: React.FC<WalletCardI> = ({icon, name, onClick}) => (
    <WalletProviderContainer>
        <WalletProviderImage>
            <img src={icon} height="35px" alt={name} />
        </WalletProviderImage>
        <WalletProviderTitle>{name}</WalletProviderTitle>
        <SmallButton text={"Select"} onClick={onClick} backgroundColor={"#00ce00"} ></SmallButton>
    </WalletProviderContainer>
);

const WalletProviderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 150px;
    min-height: 175px;
    padding: 5px;
    box-shadow: inset 0 3px 8px #000;
    margin: 10px;
    padding: 25px;
    border-radius: 25px;
    &:hover{
        background-color: #eee;
    }
`;

const WalletProviderTitle = styled.div`
    flex: 1;
    font-size: 24px;
    font-weight: 700;
    margin: 20px;;
`;

const WalletProviderImage = styled.div`
    flex: 1;
    margin: 10px;
`;

const ButtonContainer = styled.div`
    flex: 1;
    margin: 10px;
`;

export default WalletCard;