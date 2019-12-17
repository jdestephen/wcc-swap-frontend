import React, { Component } from "react";
import Web3Provider, { Connectors } from "web3-react";
import { Route } from "react-router-dom";
import "./App.scss";
import Web3Connection from "./components/Web3Connection";
import Main from "./components/Main";
import AppProvider from "./context";

require("dotenv").config();

const PROVIDER_URL = process.env.REACT_APP_INFURA_URL;

const {
  NetworkOnlyConnector,
  InjectedConnector,
  WalletConnectConnector
} = Connectors;
const Injected = new InjectedConnector({ supportedNetworks: [1, 4] });
const Network = new NetworkOnlyConnector({
  providerURL: PROVIDER_URL
});
const connectors = { Network, Injected };

class App extends Component {
  state = {
    allTokens: 0,
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null
  };

  render() {
    return (
      <div className="App">
        <Web3Provider connectors={connectors} libraryName={"ethers.js"}>
          <Web3Connection>
            <AppProvider>
              <Route exact path="/" render={() => <Main />} />
            </AppProvider>
          </Web3Connection>
        </Web3Provider>
      </div>
    );
  }
}

export default App;
