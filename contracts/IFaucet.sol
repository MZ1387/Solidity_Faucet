// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// functions that must be implemented in this contract
// cannot inherit from other smart contracts
// can only inherit from other interfaces
// cannot declare a constructor, state variables
// all declared functions must be external

interface IFaucet {
    function addFunds() external payable;
    function withdraw(uint withdrawAmount) external;
}