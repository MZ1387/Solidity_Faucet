import { useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
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

      const provider = await detectEthereumProvider();

      if (provider) {

        // you will get a provider from windox context
        // which is injected by metamask and then you will
        // create a new instance of Web3 with provider injected 
        // by metamask. this will provide functionality
        setWeb3API({
          web3: new Web3(provider),
          provider
        });

      } else {
        console.log('Please install metamask.');
      }

    }

    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3API.web3.eth.getAccounts();

      setAccount(accounts[0]);
    }

    web3API.web3 && getAccount();
  }, [web3API.web3]);


  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <div className='is-flex is-align-items-center'>
          <span>
            <strong className='mr-2'>Account: </strong>
          </span>
          <div>
            { 
              account ? 
              account : (
                <button 
                  className="button is-small"
                  onClick={() => web3API.provider.request({ method: 'eth_requestAccounts' })}
                >
                  Connect Wallet
                </button>
              ) 
            }
          </div>
        </div>
        <div className="balance-view is-size-2 my-4">
          Current Balance: <strong>10</strong> ETH
        </div>
        <button 
          className="button is-primary mr-2"
        >
          Donate
        </button>
        <button className="button is-link">Withdraw</button>
      </div>
    </div>
  );
}

export default App;
