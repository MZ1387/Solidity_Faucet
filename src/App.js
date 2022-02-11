import { useEffect, useState } from 'react';
import './App.css';
import Web3 from 'web3';

function App() {

  const [web3API, setWeb3API] = useState({
    provider: null,
    web3: null
  });

  const [account, setAccount] = useState(null);

  // when component is mounted on the screen
  // useEffect will be executed only once
  useEffect(() => {

    // metamask gves us access to window.ethereum & window.web3
    // metamask injects global API into website
    // API allows websites to request users, accounts, read data, bloackchain
    // sign messages and transactions
    const loadProvider = async () => {

      let provider = null;

      if (window.ethereum) {
        provider = window.ethereum;

        try {
          // enable metamask
          await provider.enable()
        } catch (error) {
          console.log('User denied account access.');
        }


      } else if (window.web3) {
        provider = window.web3.currentProvider;
      } else if (!process.env.production) {
        provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545')
      }

      // you will get a provider from windox context
      // which is injected by metamask and then you will
      // create a new instance of Web3 with provider injected 
      // by metamask. this will provide functionality
      setWeb3API({
        web3: new Web3(provider),
        provider
      });

    }

    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3API.web3.eth.getAccounts();
      debugger
      setAccount(accounts[0]);
    }

    web3API.web3 && getAccount();
  }, [web3API.web3]);
console.log('account', account);
  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <span>
          <strong>Account: </strong>
        </span>
        <h1>{ account ? account : "not connected..." }</h1>
        <div className="balance-view is-size-2">
          Current Balance: <strong>10</strong> ETH
        </div>
        <button className="btn mr-2">Donate</button>
        <button className="btn">Withdraw</button>
      </div>
    </div>
  );
}

export default App;
