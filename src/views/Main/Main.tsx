import React from "react";
import Button from "components/LinkButton";
import styled from "styled-components";
import copy from 'assets/images/copy.png';
import Banner from "./components/Banner";
import AnimateImage from "components/AnimatedImage";
import AnimateImage2 from "components/AnimatedImage2";

const Main: React.FC = () => {

    return (
      <Container >
        <InnerContainer>
          <Banner />
          <AnimateImage2 />
        </InnerContainer>

          <ButtonGroup>
            <Button link={"/diversify"} text={"Diversify"}/>
            <Button link={"/swap"} text={"Swap"}/>
            <Button link={"/farm"} text={"Farm"}/>
            <Button link={"/governance"} text={"Governance"}/>
          </ButtonGroup>
      </Container>
      );
    };

    const Container = styled.div`
        min-height: 81vh;
    `;
    
    const InnerContainer = styled.div`
      display: flex;
      justify-content: center;
      padding: 10%;
      @media (max-width: 960px) {
        flex-direction: column-reverse;
        align-items: center;
        padding: 5% 0;
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