import { useCallback, useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import './App.css';
import Web3 from 'web3';
import { loadContract } from './utils/load-contract';

function App() {

  const [web3API, setWeb3API] = useState({
    provider: null,
    web3: null,
    contract: null
  });

  const [balance, setBalance] = useState(null);
  const [account, setAccount] = useState(null);
  const [reload, setReload] = useState(false);

  const reloadEffect = useCallback(() => setReload(!reload), [reload]);

  const setAccountListener = (provider) => {
    provider.on('accountsChanged', (accounts) => setAccount(accounts[0]))
  };

  // when component is mounted on the screen
  // useEffect will be executed only once
  useEffect(() => {

    // metamask gves us access to window.ethereum & window.web3
    // metamask injects global API into website
    // API allows websites to request users, accounts, read data, bloackchain
    // sign messages and transactions
    const loadProvider = async () => {

      const provider = await detectEthereumProvider();
      const contract = await loadContract('Faucet', provider);

      if (provider) {

        // execute when metamask account is changed
        setAccountListener(provider);

        // you will get a provider from windox context
        // which is injected by metamask and then you will
        // create a new instance of Web3 with provider injected 
        // by metamask. this will provide functionality
        setWeb3API({
          web3: new Web3(provider),
          provider,
          contract
        });

      } else {
        console.log('Please install metamask.');
      }

    }

    loadProvider();
  }, []);

  useEffect(() => {
    const loadBalance = async () => {

      const { contract, web3 } = web3API;
      const balance = await web3.eth.getBalance(contract.address);
      const balanceInEther = web3.utils.fromWei(balance, 'ether');

      setBalance(balanceInEther);
    };

    web3API.contract && loadBalance();
  }, [web3API, reload]);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3API.web3.eth.getAccounts();

      setAccount(accounts[0]);
    }

    web3API.web3 && getAccount();
  }, [web3API.web3]);

  const addFunds = useCallback(async () => {

    const { contract, web3 } = web3API;

    await contract.addFunds({
      from: account,
      value: web3.utils.toWei('1', 'ether')
    });

    reloadEffect();
  }, [web3API, account, reloadEffect]);

  const withdrawFunds = async () => {
    const { contract, web3 } = web3API;
    const withdrawAmount = web3.utils.toWei('0.1', 'ether');

    await contract.withdraw(withdrawAmount, {
      from: account
    });

    reloadEffect();
  };


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
          Current Balance: <strong>{balance}</strong> ETH
        </div>
        <button 
          className="button is-primary mr-2"
          onClick={addFunds}
        >
          Donate 1 Ether
        </button>
        <button 
          className="button is-link"
          onClick={withdrawFunds}
        >
          Withdraw
        </button>
      </div>
    </div>
  );
}

export default App;
