import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { keyframes } from 'styled-components';
import getIcon from "components/Icons";

const AnimateImage: React.FC = () => {

    const [imageName, setImageName] = useState('eth');
    const names = ['eth', 'link', 'wbtc', 'uni', 'aave', 'snx', 'mkr'];
    const [imgindx, setImgIndx] = useState(0);

    useEffect(()=>{
        let refreshInterval = setTimeout(()=>{
            let x = (imgindx+1)%names.length;
            setImgIndx(x);
            setImageName(names[x]);
        }, 6995)
        return () => clearInterval(refreshInterval);
    }, [imageName])

    return(
        <Container>
            <ImageDiv>
                <img src={`${getIcon(imageName)}`} alt={imageName} width="250px" />
            </ImageDiv>
        </Container>
    )
}

const coinAnimation = keyframes`
    0% { -webkit-transform: rotateY(0deg); opacity:0}
    50% { -webkit-transform: rotateY(180deg); opacity:1}
    100% { -webkit-transform: rotateY(360deg); opacity:0}
`;

const ImageDiv = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    max-width: 100%;
    animation: ${coinAnimation} 7s infinite linear;
`;

const Container = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
`;

const ImageText = styled.div`
    color: white;
    font-size: 24px;
    font-weight: 700;
    text-transform: uppercase;
`;

export default AnimateImage;