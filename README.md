# Starter DApp Template

This is a starter dapp template that deploys and interacts with a simple Solidity smart contract using Hardhat and MetaMask as part of one's development workflow. This dapp template is very simple and uses a trivial 'Token' smart contract that allows you to create your own token and also mint it to deployer's address. The deployer can then transfer the tokens to whichever address he likes.

The template finally looks like this:
![starter-template-image](https://raw.githubusercontent.com/DoDAO-io/dodao-aave-developer-1-course/main/images/starter-template.png)

# Template Stack Overview

* Solidity (To write our smart contract)
* Hardat (build, test and deployment framework)
* React (Create our frontend)
* Ethers (web3 library for interacting with the blockchain and our smart contract)
* MetaMask (Wallet browser extension)
* Alchemy (node provider)

To use the code in this repository, you will need to have Node.js and npm installed on your computer. Also, please make sure to set up Metamask and Alchemy accounts.

## MetaMask Installation & Configuration

* To install MetaMask, first visit the MetaMask website (https://metamask.io/) and click the "Get MetaMask" button. This will take you to the page for the MetaMask extension on the Chrome web store (https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn), where you can click "Add to Chrome" to install the extension.  

* Once the extension is installed, you will see the MetaMask icon appear in your browser's toolbar. Clicking on the icon will open the MetaMask pop-up window, where you can create a new account or import an existing one.

* After creating an account, you will need to configure MetaMask to connect to the Ethereum network. To do this, click on the network dropdown in the top-left corner of the MetaMask window and select the network you want to connect to (e.g. "Main Ethereum Network" for the mainnet, or "Goerli Test Network" for the Goerli test network).  You can also add custom networks by clicking the "Custom RPC" option and entering the network's URL.

* Once you have configured MetaMask to connect to the desired network, you can use it to manage your Ethereum accounts, sign transactions, and interact with decentralized applications. You can also use MetaMask to switch between networks and test contracts without the need to run a full Ethereum node.

## Getting access to Goerli Test network using Alchemy

* To get access to an Alchemy node on the Goerli test network, you will first need to create an account on the Alchemy website (https://alchemy.com/). 

* Once your account is created, you will be able to log in to the Alchemy dashboard and access the network settings for the Goerli test network. From there, you can generate an API key that you can use to connect to the Alchemy node.

* To connect to the Alchemy node using the generated API key, you will need to use a library or tool that supports the Alchemy API. For example, if you are using the Web3.js library, you can connect to the Alchemy node by using the Web3.eth.alchemy method, passing in the API key as a parameter.

* Once you are connected to the Alchemy node, you can use it to interact with the Goerli test network, including sending transactions and deploying and calling smart contracts. You can also use the Alchemy dashboard to monitor your node's performance and track your usage of the Alchemy API.

# Code Setup

Once you have these tools installed, you can follow these steps to setup the code:

* Download or clone the repository to your local computer using git:
  ```shell
  git clone https://github.com/DoDAO-io/dodao-simple-contract-template.git
  ```

* Navigate to the root directory of the repository and install the project dependencies using npm:
  ```shell
  npm install
  ```

* Compile the smart contract code by running the following command:
  ```shell
  npx hardhat compile
  ```

* Deploy the smart contract to the Goerli network by running the deploy script:
  ```shell
  npx hardhat run scripts/deploy.ts --network goerli
  ```

* Once the contract has been deployed, you can interact with it using the frontend directory. This directory contains a simple web application built with React that allows you to send and receive tokens using the deployed contract. To run the frontend, navigate to the frontend directory and run the following commands:
  ```shell
  cd frontend
  npm install
  npm start
  ```

* The frontend should now be running on your local computer. You can access it by visiting `http://localhost:3000` in your web browser.

* In addition to the steps above, the template also includes a Makefile that provides a number of useful commands for working with the project. For example, you can use the make compile command to compile the contract code. You can see the full list of commands by running make or make help.
