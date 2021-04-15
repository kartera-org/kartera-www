import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { keyframes } from 'styled-components';
import getIcon from "components/Icons";

const FlipYImage: React.FC = () => {

    const [imageName, setImageName] = useState('eth');
    const names = ['eth', 'link', 'wbtc', 'uni', 'aave', 'snx', 'mkr'];
    const [imgindx, setImgIndx] = useState(0);

    useEffect(()=>{
        setTimeout(()=>{
            let x = (imgindx+1)%names.length;
            setImgIndx(x);
            setImageName(names[x]);
        }, 5000)
    }, [imageName])

    return(
        <ImageDiv>
            <img src={`${getIcon(imageName)}`} alt={imageName} width="50px" />
        </ImageDiv>
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
    animation: ${coinAnimation} 5s infinite linear;
`;

export default FlipYImage