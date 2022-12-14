import { EventList } from "@components/EventList";
import { Loading } from "@components/Loading";
import { NoTokensMessage } from "@components/NoTokensMessage";
import { TransactionErrorMessage } from "@components/TransactionErrorMessage";
import { Transfer } from "@components/Transfer";
import { WaitingForTransactionMessage } from "@components/WaitingForTransactionMessage";
import TokenArtifact from "@contracts/Token.json";
import { ERC20, IERC20 } from "@contracts/typechain-types";
import { JsonRpcProvider } from "@ethersproject/providers";
import { JsonRpcSigner } from "@ethersproject/providers/src.ts/json-rpc-provider";
import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

export interface TokenInfoProps {
  provider?: JsonRpcProvider;
  selectedAddress?: string;
  signer?: JsonRpcSigner;
  tokenAddress: string;
}

interface TokenDataState {
  name: string;
  symbol: string;
}

export function TokenInfo({
  provider,
  selectedAddress,
  signer,
  tokenAddress,
}: TokenInfoProps) {
  // This method just clears part of the state.
  const dismissTransactionError = () => {
    setTransactionError(undefined);
  };

  // This is an utility method that turns an RPC error into a human readable
  // message.
  const getRpcErrorMessage = (error: any) => {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  };

  const updateBalance = async () => {
    const balance = await token.balanceOf(selectedAddress!);
    setBalance(balance);
  };
  // This method sends an ethereum transaction to transfer tokens.
  // While this action is specific to this application, it illustrates how to
  // send a transaction.
  const transferTokens = async (to: any, amount: any) => {
    // Sending a transaction is a complex operation:
    //   - The user can reject it
    //   - It can fail before reaching the ethereum network (i.e. if the user
    //     doesn't have ETH for paying for the tx's gas)
    //   - It has to be mined, so it isn't immediately confirmed.
    //     Note that some testing networks, like Hardhat Network, do mine
    //     transactions immediately, but your dapp should be prepared for
    //     other networks.
    //   - It can fail once mined.
    //
    // This method handles all of those things, so keep reading to learn how to
    // do it.

    try {
      // If a transaction fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      dismissTransactionError();

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await token.transfer(to, amount);
      setTxBeingSent(tx.hash);

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that made the transaction fail when it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }

      // If we got here, the transaction was successful, so you may want to
      // update your state. Here, we update the user's balance.
      await updateBalance();
    } catch (error: any) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error(error);
      setTransactionError(error);
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      setTxBeingSent(undefined);
    }
  };

  const token = new ethers.Contract(
    tokenAddress,
    TokenArtifact.abi,
    signer
  ) as ERC20;

  // The next two methods just read from the contract and store the results
  // in the component state.
  const getTokenData = async () => {
    const name = await token.name();
    const symbol = await token.symbol();

    setTokenData({ name, symbol });
  };

  useEffect(() => {
    getTokenData();
    updateBalance();
  }, [tokenAddress]);

  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
  const [tokenData, setTokenData] = useState<TokenDataState | undefined>();

  const [txBeingSent, setTxBeingSent] = useState<any>();
  const [transactionError, setTransactionError] = useState();
  const [networkError, setNetworkStateError] = useState();
  // If the token data or the user's balance hasn't loaded yet, we show
  // a loading component.
  if (!tokenData || !balance || !selectedAddress || !provider || !signer) {
    return (
      <Loading
        contents={JSON.stringify(
          {
            tokenData,
            balance,
            selectedAddress,
          },
          null,
          2
        )}
      />
    );
  }

  return (
    <div className="container p-4">
      <div className="row">
        <div className="col-12">
          <h1>
            {tokenData.name} ({tokenData.symbol})
          </h1>
          <p>
            Welcome <b>{selectedAddress}</b>, you have{" "}
            <b>
              {balance.toString()} {tokenData.symbol}
            </b>
            .
          </p>
        </div>
      </div>

      <hr />

      <div className="row">
        <div className="col-12">
          {/* 
              Sending a transaction isn't an immediate action. You have to wait
              for it to be mined.
              If we are waiting for one, we show a message here.
            */}
          {txBeingSent && <WaitingForTransactionMessage txHash={txBeingSent} />}

          {/* 
              Sending a transaction can fail in multiple ways. 
              If that happened, we show a message here.
            */}
          {transactionError && (
            <TransactionErrorMessage
              message={getRpcErrorMessage(transactionError)}
              dismiss={() => dismissTransactionError()}
            />
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {/*
              If the user has no tokens, we don't show the Transfer form
            */}
          {balance.eq(0) && (
            <NoTokensMessage selectedAddress={selectedAddress} />
          )}

          {/*
              This component displays a form that the user can use to send a 
              transaction and transfer some tokens.
              The component doesn't have logic, it just calls the transferTokens
              callback.
            */}
          {balance.gt(0) && (
            <>
              <Transfer
                transferTokens={(to: any, amount: any) =>
                  transferTokens(to, amount)
                }
                tokenSymbol={tokenData.symbol}
              />
              {signer && token && (
                <EventList provider={provider} tokenContract={token} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
