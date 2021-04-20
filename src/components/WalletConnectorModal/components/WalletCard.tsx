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
            <img src={icon} width="35px" alt={name} />
        </WalletProviderImage>
        <WalletProviderTitle>{name}</WalletProviderTitle>
        <SmallButton text={"Select"} onClick={onClick} backgroundColor={"#00ce00"} ></SmallButton>
    </WalletProviderContainer>
);

const WalletProviderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 5px;
    &:hover{
        background-color: #eee;
    }
`;

const WalletProviderTitle = styled.div`
    display: flex;
    flex: 1;
    font-size: 18px;
    font-weight: 700;
    margin: 1% 5%;
`;

const WalletProviderImage = styled.div``;

const SelectButton = styled.div`

`;

export default WalletCard;