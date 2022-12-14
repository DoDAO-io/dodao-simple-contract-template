import { TokenInfo } from "@components/TokenInfo";
import contractAddress from "@contracts/contract-address.json";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import { JsonRpcProvider } from "@ethersproject/providers";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";
import React from "react";
import { ConnectWallet } from "./ConnectWallet";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected } from "./NoWalletDetected";

declare global {
  interface Window {
    ethereum: any;
  }
}

// This is the Hardhat Network id that we set in our hardhat.config.js.
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
const HARDHAT_NETWORK_ID = "1337";

// This component is in charge of doing these things:
//   1. It connects to the user's wallet
//   2. Initializes ethers and the Token contract
//   3. Polls the user balance to keep it updated.
//   4. Transfers tokens by sending transactions
//   5. Renders the whole application
//
// Note that (3) and (4) are specific of this sample application, but they show
// you how to keep your Dapp and contract's state in sync,  and how to send a
interface DappState {
  selectedAddress?: string;
  networkError?: string;
}

// transaction.
export class Dapp extends React.Component<{}, DappState> {
  private _provider?: JsonRpcProvider;
  private initialState?: DappState;
  private _pollDataInterval?: any;
  constructor(props: any) {
    super(props);

    // We store multiple things in Dapp's state.
    // You don't need to follow this pattern, but it's an useful example.
    this.initialState = {
      networkError: undefined,
    };

    this.state = this.initialState;

    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    this._provider.resetEventsBlock(0);
  }
  render() {
    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install MetaMask.
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    // The next thing we need to do, is to ask the user to connect their wallet.
    // When the wallet gets connected, we are going to save the users's address
    // in the component's state. So, if it hasn't been saved yet, we have
    // to show the ConnectWallet component.
    //
    // Note that we pass it a callback that is going to be called when the user
    // clicks a button. This callback just calls the _connectWallet method.
    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet
          connectWallet={() => this._connectWallet()}
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }

    // If everything is loaded, we render the application.
    return (
      <TokenInfo
        provider={this._provider}
        selectedAddress={this.state.selectedAddress}
        signer={this._provider?.getSigner(0)}
        tokenAddress={contractAddress.Token}
      />
    );
  }

  componentWillUnmount() {
    // We poll the user's balance, so we have to stop doing that when Dapp
    // gets unmounted
    this._stopPollingData();
  }

  componentDidMount() {
    try {
      this._connectWallet();
    } catch (e) {}
  }

  async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Once we have the address, we can initialize the application.

    // First we check the network
    if (!this._checkNetwork()) {
      return;
    }

    this._initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]: any) => {
      this._stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      if (newAddress === undefined) {
        return this._resetState();
      }

      this._initialize(newAddress);
    });

    // We reset the dapp state if the network is changed
    window.ethereum.on("chainChanged", ([networkId]: any) => {
      this._stopPollingData();
      this._resetState();
    });
  }

  _initialize(userAddress: any) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    this.setState({
      selectedAddress: userAddress,
    });
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState!);
  }

  // This method checks if Metamask selected network is Localhost:8545
  _checkNetwork() {
    // if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
    //   return true;
    // }
    //
    this.setState({
      networkError: "Please connect Metamask to Localhost:8545",
    });

    return true;
  }
}
