import React from "react";
import Button from "components/LinkButton";
import styled from "styled-components";
import copy from 'assets/images/copy.png';
import Banner from "./components/Banner";
import AnimateImage from "components/AnimatedImage";

const Main: React.FC = () => {

    return (
      <Container>
        <InnerContainer>
          <Banner />
          <AnimateImage />
        </InnerContainer>

          <ButtonGroup>
            <Button link={"/diversify"} text={"Diversify"}/>
            <Button link={"/swap"} text={"Swap"}/>
            <Button link={"/swapFarmComp"} text={"Basket Farm"}/>
            <Button link={"/kartFarmComp"} text={"Kart Farm"}/>
          </ButtonGroup>
      </Container>
      );
    };

    const Container = styled.div`
        min-height: 100vh;
        background-image: linear-gradient(to bottom right, #150734, #28559A);
    `;
    
    const InnerContainer = styled.div`
      display: flex;
      justify-content: center;
      padding: 10%;
      @media (max-width: 770px) {
        flex-direction: column-reverse;
      }
    `;

    const ButtonGroup = styled.div`
      display: none;
      justify-content: space-around;
      padding: 10px;
      padding-bottom: 100px;
      @media (max-width: 770px) {
      display: flex;
      justify-content: center;
        align-items: center;
        flex-direction: column;
      }
    `;

export default Main;