import React, { useMemo } from 'react';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Web3ReactProvider } from '@web3-react/core';
import WalletConnector from "components/WalletConnector";
import NavBar from "components/NavBar";
import Footer from "components/Footer";
import Main from "views/Main";
import Basket from "views/Basket";
import Swap from 'views/Swap';
import BasketFarm from 'views/BasketFarm';
import KarteraFarm from 'views/KarteraFarm';
import getLibrary from "utils/getLibrary";

import { BasketProvider } from "contexts/Basket";
import Provider from 'contexts/Basket/Provider';

  const App: React.FC = () => {

    const theme  = useMemo(() => {
      return createMuiTheme({
        palette: {
          primary: { main:'#A6FFB7' },
          secondary: { light: '#0066ff',
          main: '#000000',
          // dark: will be calculated from palette.secondary.main,
          contrastText: '#ffcc00',},
        },
      });
    }, []);

    return (
      <Router>
      <ThemeProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <WalletConnector />
        <Provider>
            <NavBar />
            <Switch>
              <Route exact path="/">
                <Main />
              </Route>
              <Route exact path="/diversify">
                <Basket />
              </Route>
              <Route exact path="/swap">
                <Swap />
              </Route>
              <Route exact path="/basketFarm">
                <BasketFarm />
              </Route>
              <Route exact path="/karteraFarm">
                <KarteraFarm />
              </Route>
            </Switch>
            <Footer />
        </Provider>
      </Web3ReactProvider>
      </ThemeProvider>
      </Router>
    );
};

const Providers: React.FC = ({ children }) => {
  return (
    <BasketProvider>{children}</BasketProvider>
  );
};


export default App;
