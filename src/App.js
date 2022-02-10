import { useEffect } from 'react';
import './App.css';

function App() {

  // when component is mounted on the screen
  // useEffect will be executed only once
  useEffect(() => {

    // metamask gves us access to window.ethereum & window.web3
    // metamask injects global API into website
    // API allows websites to request users, accounts, read data, bloackchain
    // sign messages and transactions
    const loadProvider = async () => {

      console.log('#web3#', window.web3);
      console.log('#eth#', window.ethereum);
    }

    loadProvider()
  }, []);

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <div className="balance-view is-size-2">
          Current Balance: <strong>10</strong> ETH
        </div>
        <button
          className="btn mr-2"
          onClick={async () => {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts"})
            console.log('on click', accounts);
          }}
        >
          Enable Ethereum
        </button>
        <button className="btn mr-2">Donate</button>
        <button className="btn">Withdraw</button>
      </div>
    </div>
  );
}

export default App;
