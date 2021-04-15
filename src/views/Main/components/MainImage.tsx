import React, { useMemo } from "react";
import styled from "styled-components";
import mainImage from "assets/mainImage.png";

const MainImage: React.FC = () => {
    return(
        <MainImageDiv>
            <img src={mainImage} alt="Kartera" width="100%"/>
        </MainImageDiv>
    );
}

const MainImageDiv = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    max-width: 100%;
    padding: 50px;
`;

export default MainImage;