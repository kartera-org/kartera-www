import React from "react";
import { Button, Card, CardActions, CardContent, Icon, Grid, Typography } from "@material-ui/core";
import styled from "styled-components";

interface WalletProviderCardProps {
  icon: React.ReactNode;
  name: string; 
  onSelect: () => void;
}
const WalletProviderCard: React.FC<WalletProviderCardProps> = ({ icon, name, onSelect }) => (
  <Card style={{margin:'10px', padding:'10px'}}>
    <Icon>{icon}</Icon>
    <Grid container>
    <Grid item onClick={onSelect} style={{cursor: 'pointer'}}><div style={{}}  ></div><div><Typography variant='h5'>{name}</Typography></div>
    </Grid>
    </Grid>
  </Card>
  // <Card>
  //   <Icon>{icon}</Icon>
  //   <CardContent>
  //     <StyledName>{name}</StyledName>
  //   </CardContent>
  //   <CardActions>
  //     <Button onClick={onSelect} variant="contained" >Select</Button>
  //   </CardActions>
  // </Card>
);

const StyledName = styled.div`
  font-size: 18px;
  font-weight: 700;
  text-align: center;
`;

export default WalletProviderCard;
