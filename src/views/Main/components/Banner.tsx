import React, { useMemo } from "react";
import { Typography } from '@material-ui/core'
import styled from "styled-components";
import copy from 'assets/copy.png';
import { KarteraTokenAddress as kartTokenAddr} from "constants/tokenAddresses";

const Banner: React.FC = () => {
  return(
    <>
            <BannerDiv>
              <StyledText1>Diversified</StyledText1>
              <StyledText1>Token</StyledText1>
              <StyledText1>Basket &</StyledText1>
              <StyledText1>Swap</StyledText1>
              <StyledText1>Protocol</StyledText1>
              <StyledText2> Kartera is the ultimate diversification protocol. Exposure to the basket allows anyone to diversify risk and earn return from swap trades done with the basket. </StyledText2>

              <KarteraTokenContainer>

                <KarteraTitle>KarteraToken (KART)</KarteraTitle>
                <KarteraAddress>
                    <div className='introtext' onClick={()=>{navigator.clipboard.writeText(kartTokenAddr)}} style={{cursor:'pointer'}}>{kartTokenAddr}</div>&nbsp;
                    <img src={copy} alt="copy" width='20px' color="white"/>
                </KarteraAddress>
              </KarteraTokenContainer>
            </BannerDiv>
    </>
    )
};

    const BannerDiv = styled.div`
        display: flex;
        flex:1;
        flex-direction: column;
        align-self: center;
    `;

    const StyledText1 = styled.div`
      line-height: 1.5;
      font-size: 35px;
      font-weight: 900;
      color: white;
    `;

    const StyledText2 = styled.div`
      margin-top: 5%;
      padding: 10px;
      line-height: 1.25;
      font-size: 16px;
      font-weight: 400;
      color: white;
    `;

    const KarteraTokenContainer = styled.div`
      display: flex;
      flex-direction: column;
      margin-top: 5%;
      @media (max-width: 770px) {
        display: none;
      }
    `;

    const KarteraTitle = styled.div`
      font-size: 20px;
      font-weight: 700;
      marginLeft: 150px;
      marginTop: 25px;
      color: white;
    `;

    const KarteraAddress = styled.div`
      display: flex;
      align-items: center;
      color: white;
    `;

export default Banner;