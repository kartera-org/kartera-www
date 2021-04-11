import React, { useMemo } from 'react';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UseWalletProvider } from "use-wallet";
import WalletConnector from 'components/WalletConnector';


// const [darkModeSetting] = useLocalStorage("darkMode", false);
  

 
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
        <WalletConnector />
        
        {/* <UseWalletProvider 
            chainId={1}
            connectors={{
              walletconnect: { rpcUrl: "https://mainnet.eth.aragon.network/" },
            }}
          >{
            // <div style={{position:'fixed', top:'50px', right:'50px'}}>
            //   <TopBar />
            // </div>
          }
        </UseWalletProvider> */}
      </ThemeProvider>
      </Router>
    );
};

export default App;
