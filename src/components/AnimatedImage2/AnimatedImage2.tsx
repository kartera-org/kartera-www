import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Grid } from "@material-ui/core";
import { keyframes } from 'styled-components';
import CirImage from "assets/images/icons_circle3.png";
import WhiteBgImage from "assets/images/white_bg1.png";
import KartImage from "assets/images/kart.png";

const AnimateImage: React.FC = () => {

    return(
        <Container>
            <Grid container >
                <Grid item>
                    <ImageContainer>
                        <BGImageDiv>
                            <img src={WhiteBgImage} alt={""} />
                        </BGImageDiv>
                        <KartImageDiv>
                            <img src={KartImage} alt={""} />
                        </KartImageDiv>
                        <CircularImageDiv>
                            <img src={CirImage} alt={""} />
                        </CircularImageDiv>
                    </ImageContainer>
                </Grid>
            </Grid>
        </Container>
    )
}

const coinAnimation = keyframes`
    0% { -webkit-transform: rotate(0deg); }
    50% { -webkit-transform: rotate(180deg); }
    100% { -webkit-transform: rotate(360deg);}
`;

const kartAnimation = keyframes`
    0% { -webkit-transform: rotateY(0deg); }
    50% { -webkit-transform: rotateY(-180deg); }
    100% { -webkit-transform: rotateY(-360deg);}
`;

const ImageContainer = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const CircularImageDiv = styled.div`
    animation: ${coinAnimation} 30s infinite linear;
`;

const KartImageDiv = styled.div`
    position: absolute;
    top: 0;
    left: 0;
`;

const BGImageDiv = styled.div`
    position: absolute;
    top: 0;
    left: 0;
`;

const Container = styled.div`
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    @media (max-width: 960px) {
        display: none;
    }
`;

const ImageText = styled.div`
    color: white;
    font-size: 24px;
    font-weight: 700;
    text-transform: uppercase;
`;

export default AnimateImage;