import React from "react";
import LinkButton from "components/LinkButton";
import {Typography, Card, CardContent, CardActions, Grid, Link, Hidden} from '@material-ui/core'
import styled from "styled-components";
import copy from 'assets/images/copy.png';

const BasketFarm: React.FC = () => {

    return (
        <BasketContainer>

        </BasketContainer>
      );
    };

    const BasketContainer = styled.div`
        min-height: 100vh;
        background-image: linear-gradient(to bottom right, #150734, #28559A);
    `;



export default BasketFarm;